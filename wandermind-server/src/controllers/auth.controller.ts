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
    if (!parsed.success) return sendError(res, parsed.error.errors[0].message, 400);

    const { name, email, password, role } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return sendError(res, 'Email already registered', 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name, email, password: hashed, role,
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
    if (!parsed.success) return sendError(res, parsed.error.errors[0].message, 400);

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
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.CLIENT_URL}/auth/google/callback&response_type=code&scope=openid%20email%20profile`;
  res.redirect(googleAuthUrl);
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Exchange code for token, upsert user, return JWT
  res.redirect(`${process.env.CLIENT_URL}/auth/google/callback?error=not_implemented`);
};
