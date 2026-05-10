import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { createError, AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['TRAVELER', 'HOST']).optional().default('TRAVELER'),
  image: z.string().url().optional().or(z.literal('')),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const generateToken = (userId: string) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400);

    const { name, email, password, role, image } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return sendError(res, 'Email already registered', 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name, email, password: hashed, role, image,
        travelerProfile: role === 'TRAVELER' ? { create: {} } : undefined,
        hostProfile: role === 'HOST' ? { create: { bio: '', languages: [] } } : undefined,
      },
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
    });

    const token = generateToken(user.id);
    sendSuccess(res, { user, token }, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400);

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return sendError(res, 'Invalid email or password', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return sendError(res, 'Invalid email or password', 401);

    const token = generateToken(user.id);
    const { password: _, ...safeUser } = user;
    sendSuccess(res, { user: safeUser, token }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, role: true, image: true, createdAt: true,
        travelerProfile: true,
        hostProfile: { select: { id: true, bio: true, verified: true, languages: true } },
      },
    });
    if (!user) return next(createError('User not found', 404));
    sendSuccess(res, user, 'User fetched');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // JWT is stateless — client removes token. We can blacklist here with Redis if needed.
  sendSuccess(res, null, 'Logged out successfully');
};

// Google OAuth — placeholder (wire up with passport or custom handler)
export const googleAuth = async (req: Request, res: Response) => {
  const redirectUri = `https://wandermind-server.onrender.com/api/auth/google/callback`;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(googleAuthUrl);
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    if (!code) return res.redirect(`${process.env.CLIENT_URL}/login?error=no_code`);

    const redirectUri = `https://wandermind-server.onrender.com/api/auth/google/callback`;

    // Exchange code for tokens
    console.log('Exchanging Google code for tokens...');
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json() as any;
    console.log('Google Token Data:', tokenData);
    if (tokenData.error) throw new Error(tokenData.error_description || 'Failed to exchange code');

    // Get user info
    console.log('Fetching Google user info...');
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json() as any;
    console.log('Google User Profile:', googleUser);

    // Upsert user
    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.picture,
          googleId: googleUser.id,
          role: 'TRAVELER',
          travelerProfile: { create: {} },
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.id, image: googleUser.picture },
      });
    }

    // Generate JWT and redirect
    const token = generateToken(user.id);
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role, image: user.image }))}`);
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};
