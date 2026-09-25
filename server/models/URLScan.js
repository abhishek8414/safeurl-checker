import mongoose from 'mongoose';

const urlScanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedUrl: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
    },
    protocol: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ['Likely Safe', 'Suspicious', 'High Risk'],
    },
    checks: [String],
    warnings: [String],
    positiveIndicators: [String],
    scannedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const URLScan = mongoose.model('URLScan', urlScanSchema);

export default URLScan;
