import { StorageConfig } from 'config/storage.config';
import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      let dest: string;

      if (file.mimetype.startsWith('image/')) {
        dest = StorageConfig.image.destination;
      } else if (file.mimetype.startsWith('video/')) {
        dest = StorageConfig.video.destination;
      } else if (file.mimetype.startsWith('audio/')) {
        dest = StorageConfig.audio.destination;
      }  else {
        return cb(new Error('Unsupported media type'), 'uncown');
      }

      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),

  limits: {
    fileSize: StorageConfig.video.maxSize, // koristi veći limit jer može biti video
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'video/mp4',
      'video/webm',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type!'), false);
    }
  },
};
