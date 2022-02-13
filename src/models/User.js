import mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
  name: { type: String, unique: true },
})

export default mongoose.model('User', UserSchema)