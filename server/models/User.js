import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true // Removes accidental spaces
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['operator', 'admin'], 
    default: 'operator' 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true,
  strict: false // Allows extra fields added during the relay
});

export default mongoose.model('User', userSchema);