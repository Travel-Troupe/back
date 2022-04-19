import mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  password: { type: String, required: true, select: false },
})

export default mongoose.model('User', UserSchema)
