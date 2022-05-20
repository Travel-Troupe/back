import Team from '../models/Team.js'
import Travel from '../models/Travel.js'

export async function getUsersTravel(req, res) {
  try {
    const { user: { id } } = req
    if (id) {
      // user's team
      const teams = await Team.find({ teamComposition: { $in: [id] } }, 'id')
      const teamIds = teams.map(e => e?._id) 
      
      const travels = await Travel.find({ team: { $in: teamIds } })

      return res.status(200).json(travels)
    }

    throw new Error('Invalid request')
  } catch(e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}

export async function createTravel(req, res) {
  try {
    const { user: { id: userId } } = req

    const {
      teamId,
      name,
      startDate,
      endDate,
      picture = ''
    } = req.body

    const [team] = await Team.find({ id: teamId, owner: userId })

    if (team.owner == userId) {
      const travel = await Travel.create({
        team: teamId,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        picture
      })
  
      return res.status(200).json(travel)
    } else {
      throw new Error(
        'This user cannot create a travel'
      )
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}

export async function addTravelStep(req, res) {
  try {
    const { user: { id: userId } } = req

    const {
      travelId,
      name,
      startDate,
      description,
      address,
    } = req.body

    let travel = await Travel.findOne({ id: travelId, owner: userId })
    let steps = travel.steps

    if (travel) {
      let newStep = {
        name,
        date: new Date(startDate),
        description, 
        address
      }
      steps.push(newStep)
      const travel = await Travel.updateOne({ '_id':travelId},{
        steps
      })
  
      return res.status(200).json(travel)
    } else {
      throw new Error(
        'This user cannot add a step to this travel'
      )
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}

export async function getTravelSteps(req, res) {
  try {
    const { user: { id } } = req
    const { travelId } = req.body
    if (id) {
      let travel = await Travel.findOne({ id: travelId})

      return res.status(200).json(travel)
    }

    throw new Error('Invalid request')
  } catch(e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}

export async function deleteTravelSteps(req, res) {
  try {
    const { params: { stepId } } = req
    let travel = await Travel.findOne({ 'steps._id': stepId })
    let steps = travel?.steps
    let travelId = travel?._id
    if (travel) {
      let index = steps.map(function(e) { return e._id }).indexOf(stepId)
      steps.splice(index, 1)      
      const travel = await Travel.updateOne({ '_id': travelId},{
        'steps': steps,
      })
  
      return res.status(200).json(travel)
    } else {
      throw new Error(
        'This user cannot add a step to this travel'
      )
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}
