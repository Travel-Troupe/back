import mongoose from 'mongoose'

export const TravelSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  name: { type: String, required: true },
  picture: { type: String, required: false },
  startDate: { type: Date, required: true },
  steps: [{
    step: { type: mongoose.Schema.Types.ObjectId, ref: 'Step' },
    name: { type: String, required: true },
    picture: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  }],
})

export default mongoose.model('Travel', TravelSchema)
