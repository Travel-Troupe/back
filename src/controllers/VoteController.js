import Team from '../models/Team.js'

export async function addDateProposition(req, res) {
  try {
    const { user: { id: userId } } = req

    const {
      startDate,
      endDate,
      teamId
    } = req.body

    const team = await Team.findOne({ '_id': teamId })
    let alreadyProposedDates = team.datesProposals

    if (alreadyProposedDates && alreadyProposedDates.length > 0) {
      alreadyProposedDates.forEach(date => {
        if (date.proposedBy && date.proposedBy == userId){
          return res.status(428).json({ message: 'You have already proposed a date in this trip' })
        }
        if (date.votedBy && date.votedBy.includes(userId)){
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

      const updatedTeam = await Team.updateOne({ '_id': teamId  },{
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
    const { teamId } = req.body
    if (id) {
      const team = await Team.findOne({ '_id': teamId })

      let alreadyProposedDates = team.datesProposals
      if (alreadyProposedDates && alreadyProposedDates.length > 2) {
        alreadyProposedDates.sort(function (proposal1, proposal2) {
          if (proposal1.votedBy.length > proposal2.votedBy.length) return -1
          if (proposal1.votedBy.length < proposal2.votedBy.length) return 1
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
      teamId,
      proposalId,
    } = req.body

    let team = await Team.findOne({ '_id': teamId  })
    let proposedDates = team.datesProposals

    if (proposedDates && proposedDates.length > 0) {
      proposedDates.forEach(date => {
        if (date.proposedBy && date.proposedBy == userId){
          return res.status(428).json({ message: 'You have already proposed a date in this trip' })
        }
        if (date.votedBy &&  date.votedBy.length > 0 && date.votedBy.includes(userId)){
          return res.status(428).json({ message: 'You have already voted for a date in this trip' })
        }
      })

      proposedDates.forEach(date => {
        if (date.id == proposalId){
          if(date.votedBy &&  date.votedBy.length > 0 ){
            date.votedBy.push(userId)
          }
        }
      })
    }

    if (team) {
      const updatedTeam = await Team.updateOne({ '_id': teamId },{
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

export async function validateDate(req, res){
  try {
    const { user: { id: userId } } = req

    const {
      teamId,
      startDate,
      endDate,
    } = req.body

    const team = await Team.findOne({ '_id': teamId  })
    const selectedStartDate = new Date(startDate)
    const selectedEndDate = new Date(endDate)

    if (
      team.owner === userId
      && !!selectedStartDate
      && !!selectedEndDate
    ) {
      const updatedTeam = await Team.updateOne({ '_id': teamId },{
        validatedStartDate: selectedStartDate,
        validatedEndDate: selectedEndDate,
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
