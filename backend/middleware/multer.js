import multer from "multer";
import path from "path";
import fs from "fs";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Define the path for the upload directory
const uploadDir = path.join(__dirname, '../uploads/images/temp');

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use the created directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Pass the storage configuration directly to multer
export const upload = multer({ storage });
