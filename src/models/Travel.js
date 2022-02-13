import mongoose from 'mongoose'

export const TravelSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  destination: String,
  startDate: Date,
  endDate: Date,
  picture: String,
})

export default mongoose.model('Travel', TravelSchema)
