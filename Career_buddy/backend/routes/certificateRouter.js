import { Router } from 'express';
import upload from '../middlewares/upload.js';
import { uploadCertificate } from '../controllers/certificateController.js';
import { isAuthenticated } from '../middlewares/auth.js'; // Add authentication middleware

const router = Router();

// Define the route for file uploads with authentication
router.post('/upload', isAuthenticated, upload.single('certificate'), uploadCertificate);

export default router;
