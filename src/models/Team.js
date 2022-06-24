import mongoose from 'mongoose'

export const TeamSchema = new mongoose.Schema({
  name: { type: String, unique: false },
  slug: { type: String, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teamComposition: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  validatedStartDate: { type: Date, required: false },
  validatedEndDate: { type: Date, required: false },
  datesProposals: [{
    proposal: { type: mongoose.Schema.Types.ObjectId},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    proposedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: false}],
  }],
})

export default mongoose.model('Team', TeamSchema)
