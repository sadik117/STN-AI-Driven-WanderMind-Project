import { Request, Response, NextFunction } from 'express';
import cloudinary from '../lib/cloudinary';
import { sendSuccess, sendError } from '../utils/response';
import fs from 'fs';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'wandermind',
    });

    // Remove file from local storage
    fs.unlinkSync(req.file.path);

    sendSuccess(res, { url: result.secure_url }, 'Image uploaded successfully');
  } catch (err) {
    next(err);
  }
};
