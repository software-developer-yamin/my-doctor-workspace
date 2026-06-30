import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './public/uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadMedia = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimetypes = /image\/jpeg|image\/jpg|image\/png|image\/webp|application\/pdf/;
    const allowedExts = /jpeg|jpg|png|webp|pdf/;
    const mimetype = allowedMimetypes.test(file.mimetype);
    const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDFs are allowed'));
  },
});

export default uploadMedia;
