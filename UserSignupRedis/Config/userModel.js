// userModel.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // For production, hash the password!
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
