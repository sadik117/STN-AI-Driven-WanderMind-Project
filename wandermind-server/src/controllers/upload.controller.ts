import { Request, Response, NextFunction } from 'express';
import cloudinary from '../lib/cloudinary';
import { sendSuccess, sendError } from '../utils/response';
import fs from 'fs';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Upload request received');
    if (!req.file) {
      console.log('No file in request');
      return sendError(res, 'No file uploaded', 400);
    }

    console.log('File received:', req.file.path);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'wandermind',
    });

    console.log('Cloudinary upload success:', result.secure_url);

    // Remove file from local storage
    fs.unlinkSync(req.file.path);

    sendSuccess(res, { url: result.secure_url }, 'Image uploaded successfully');
  } catch (err) {
    next(err);
  }
};
