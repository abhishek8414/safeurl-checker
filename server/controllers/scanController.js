import URLScan from '../models/URLScan.js';
import { analyzeUrl } from '../utils/urlAnalyzer.js';

const createScan = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, message: 'A URL is required.' });
    }

    const analysis = analyzeUrl(url);

    if (!analysis.isValid) {
      return res.status(400).json({
        success: false,
        message: 'The submitted URL is invalid or malformed.',
        analysis,
      });
    }

    const scan = await URLScan.create({
      userId: req.user._id,
      originalUrl: url.trim(),
      normalizedUrl: analysis.normalizedUrl,
      domain: analysis.domain,
      protocol: analysis.protocol,
      score: analysis.score,
      riskLevel: analysis.riskLevel,
      checks: analysis.checks,
      warnings: analysis.warnings,
      positiveIndicators: analysis.positiveIndicators,
      scannedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'URL analysis complete.',
      scan,
      analysis,
    });
  } catch (error) {
    console.error('Create scan error:', error);
    return res.status(500).json({ success: false, message: 'Unable to complete URL scan.' });
  }
};

const getUserScans = async (req, res) => {
  try {
    const scans = await URLScan.find({ userId: req.user._id }).sort({ scannedAt: -1 });
    return res.status(200).json({ success: true, scans });
  } catch (error) {
    console.error('Get scans error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch scan history.' });
  }
};

const getScanById = async (req, res) => {
  try {
    const scan = await URLScan.findOne({ _id: req.params.id, userId: req.user._id });

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan record not found.' });
    }

    return res.status(200).json({ success: true, scan });
  } catch (error) {
    console.error('Get scan detail error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch scan details.' });
  }
};

const deleteScanById = async (req, res) => {
  try {
    const deleted = await URLScan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Scan record not found.' });
    }

    return res.status(200).json({ success: true, message: 'Scan record deleted successfully.' });
  } catch (error) {
    console.error('Delete scan error:', error);
    return res.status(500).json({ success: false, message: 'Unable to delete scan.' });
  }
};

const clearAllScans = async (req, res) => {
  try {
    await URLScan.deleteMany({ userId: req.user._id });
    return res.status(200).json({ success: true, message: 'Scan history cleared successfully.' });
  } catch (error) {
    console.error('Clear scan history error:', error);
    return res.status(500).json({ success: false, message: 'Unable to clear scan history.' });
  }
};

export { createScan, getUserScans, getScanById, deleteScanById, clearAllScans };
