import express from 'express';
import { getQuestions, saveAssessment, getHistory } from '../controllers/assessmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/questions/:questionnaireId', protect, getQuestions);
router.post('/', protect, saveAssessment);
router.get('/history', protect, getHistory);

export default router;