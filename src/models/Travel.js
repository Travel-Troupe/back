import mongoose from 'mongoose'

export const TravelSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  name: { type: String, required: true },
  location: { type: Object, required: true },
  picture: { type: String, required: false },
  startDate: { type: Date, required: true },
  steps: [{
    step: { type: mongoose.Schema.Types.ObjectId},
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
  }],
})

export default mongoose.model('Travel', TravelSchema)
