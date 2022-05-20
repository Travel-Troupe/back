import mongoose from 'mongoose'

export const TeamSchema = new mongoose.Schema({
  name: { type: String, unique: false },
  slug: { type: String, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teamComposition: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  validedStartDate: { type: Date, required: true },
  validedEndDate: { type: Date, required: true },
  datesProposition: [{
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  }],

})

export default mongoose.model('Team', TeamSchema)
