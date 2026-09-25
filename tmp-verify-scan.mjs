import mongoose from 'mongoose';
import connectDB from './server/config/db.js';
import URLScan from './server/models/URLScan.js';
import { createScan } from './server/controllers/scanController.js';

await connectDB();
await URLScan.deleteMany({});

const userId = new mongoose.Types.ObjectId();
const calls = [];
const res = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    calls.push(payload);
    return payload;
  },
};

await createScan({ body: { url: 'https://example.com' }, user: { _id: userId } }, res);
const count = await URLScan.countDocuments({ userId });
console.log(JSON.stringify({ createdCalls: calls.length, returnedUrl: calls[0]?.scan?.originalUrl || null, databaseDocuments: count }, null, 2));

await mongoose.disconnect();
process.exit(0);
