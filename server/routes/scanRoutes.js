import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createScan,
  getUserScans,
  getScanById,
  deleteScanById,
  clearAllScans,
} from '../controllers/scanController.js';

const router = express.Router();

router.post('/scan', authMiddleware, createScan);
router.get('/scans', authMiddleware, getUserScans);
router.get('/scans/:id', authMiddleware, getScanById);
router.delete('/scans/:id', authMiddleware, deleteScanById);
router.delete('/scans', authMiddleware, clearAllScans);

export default router;
