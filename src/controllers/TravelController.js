import axios from 'axios'
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
        .populate({
          path : 'team',
          populate : {
            path : 'teamComposition'
          }
        })

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

    let location = {}

    const {
      teamId,
      name,
      locationPoi,
      startDate,
      endDate,
    } = req.body

    const [team] = await Team.find({ id: teamId, owner: userId })

    if (team.owner == userId) {
      let picture = ''

      try {
        const unsplashQueryData = await axios.get('https://api.unsplash.com/search/photos', {
          params: {
            query: name,
            orientation: 'landscape',
          },
          headers: {
            'Authorization':`'Client-ID ${process.env.UNSPLASH_CLIENTID}`
          }
        })
        const { data: { results } } = unsplashQueryData
  
        picture = results?.[0]?.urls?.small ?? ''
      } catch(unsplashError) {
        picture = '' // !TODO put a placeholder picture
      }
      try {
        const { data: mapboxData } = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationPoi}.json`,
          {
            params: {
              access_token: process.env.MAPBOX_KEY
            }
          }
        )
        
        location = mapboxData?.features?.[0] ?? []
  
      } catch(unsplashError) {
        location = { error:'Location not found' }
      }

      const travel = await Travel.create({
        team: teamId,
        name,
        location,
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

export async function getTravelById(req, res) {
  try {
    const { params: { travelId } } = req

    const travel = await Travel.findById(travelId)
      .populate({
        path : 'team',
        populate : {
          path : 'teamComposition'
        }
      })
    if (travel) {
      return res.status(200).json(travel)
    } else {
      throw new Error(`No travel found with id ${travelId}`)
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
      const travel = await Travel.updateOne({ '_id':travelId},{
        steps: [...steps, newStep]
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
      let index = steps.findIndex(e => e._id === stepId)
      steps.splice(index, 1)      
      const travel = await Travel.updateOne({ '_id': travelId},{
        steps,
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
