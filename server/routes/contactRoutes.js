import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';
import { validateContact } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/', validateContact, submitContactForm);

export default router;
