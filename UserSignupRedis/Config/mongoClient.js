// mongoClient.js
import mongoose from 'mongoose';
import config from './config.js';

mongoose.connect(config.MONGODB.uri, {
});

const db = mongoose.connection;

db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('MongoDB connected'));

export default mongoose;
