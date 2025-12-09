import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema ({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  online: {
    type: Boolean,
    default: false
  },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;