import Team from '../models/Team.js'

export async function addDateProposition(req, res) {
  try {
    const { user: { id: userId } } = req
  
    const {
      startDate,
      endDate,
      slug
    } = req.body
  
    const team = await Team.findOne({ slug })
    let alreadyProposedDates = team.datesProposals

    if (alreadyProposedDates && alreadyProposedDates.length > 0) {
      alreadyProposedDates.forEach(date => {
        if (date.proposedBy && date.proposedBy == userId){
          return res.status(428).json({ message: 'You have already proposed a date in this trip' })
        }
        if (date.VotedBy && date.VotedBy.includes(userId)){
          return res.status(428).json({ message: 'You have already voted for a date in this trip' })
        }
      })
    }

    if (team) {
      let newDateProposition = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        proposedBy: userId, 
      }

      const updatedTeam = await Team.updateOne({ slug },{
        datesProposals: [...alreadyProposedDates, newDateProposition],
      })

      return res.status(200).json(updatedTeam)
    } else {
      throw new Error(
        'This user cannot propose a date for this travel'
      )
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}

export async function getProposedDates(req, res) {
  try {
    const { user: { id } } = req
    const { slug } = req.body
    if (id) {
      const team = await Team.findOne({ slug })
  
      let alreadyProposedDates = team.datesProposals
      if (alreadyProposedDates && alreadyProposedDates.length > 2) {
        alreadyProposedDates.sort(function (proposal1, proposal2) {
          if (proposal1.VotedBy.length > proposal2.VotedBy.length) return -1
          if (proposal1.VotedBy.length < proposal2.VotedBy.length) return 1
        })
      }
            
      return res.status(200).json(alreadyProposedDates)
    }
  
    throw new Error('Invalid request')
  } catch(e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}

export async function addVote(req, res) {
  try {
    const { user: { id: userId } } = req
    
    const {
      slug,
      proposalId,
    } = req.body
    
    let team = await Team.findOne({ slug })
    let proposedDates = team.datesProposals
    
    if (proposedDates && proposedDates.length > 0) {
      proposedDates.forEach(date => {
        if (date.proposedBy && date.proposedBy == userId){
          return res.status(428).json({ message: 'You have already proposed a date in this trip' })
        }
        if (date.VotedBy &&  date.VotedBy.length > 0 && date.VotedBy.includes(userId)){
          return res.status(428).json({ message: 'You have already voted for a date in this trip' })
        }
      })

      proposedDates.forEach(date => {
        if (date.id == proposalId){
          if(date.VotedBy &&  date.VotedBy.length > 0 ){
            date.VotedBy.push(userId)
          }
        }
      })  
    }
    
    if (team) {
      const updatedTeam = await Team.updateOne({ slug },{
        datesProposals: proposedDates,
      })

      return res.status(200).json(updatedTeam)
    } else {
      throw new Error(
        'This user cannot vote for a date in this travel'
      )
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}

export async function validDates(req, res){
  try {
    const { user: { id: userId } } = req
    
    const {
      slug,
      proposalId,
    } = req.body
    
    let team = await Team.findOne({ slug })
    let proposedDates = team.datesProposals
    let selectedDate = proposedDates.find(date => date.id == proposalId)

    if (team.owner == userId)  {
      const updatedTeam = await Team.updateOne({ slug},{
        validatedStartDate: selectedDate.startDate,
        validatedEndDate: selectedDate.endDate,
      })

      return res.status(200).json(updatedTeam)
    } else {
      throw new Error(
        'This user is not the owner of the team'
      )
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}
