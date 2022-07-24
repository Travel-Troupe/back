import axios from 'axios'
import Team from '../models/Team.js'
import Travel from '../models/Travel.js'
import Location from '../services/Location.js'

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
    const {
      teamId,
      name,
      locationPoi,
      startDate,
      endDate,
    } = req.body

    const [team] = await Team.find({ id: teamId, owner: userId })

    if (team && team.owner.toString() === userId.toString()) {
      let picture = ''

      const location = await Location.getLocation(locationPoi)

      try {
        const unsplashQueryData = await axios.get('https://api.unsplash.com/search/photos', {
          params: {
            query: location?.place_name ?? name,
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

    const location = await Location.getLocation(address)

    const travel = await Travel.findById(travelId)
      .populate({
        path : 'team',
        populate : {
          path : 'teamComposition'
        }
      })

    if (travel) {
      const { team: { teamComposition } } = travel

      const memberIds = teamComposition.map(({ _id: id }) => id.toString())

      if (memberIds.includes(userId.toString())) {
        const newStep = {
          name,
          date: new Date(startDate),
          description,
          address: location
        }

        const updatedTravel = await Travel.updateOne({ '_id':travelId },{
          $push: {
            steps: newStep
          }
        }, { new: true})

        return res.status(200).json(updatedTravel)
      } else {
        throw new Error(
          'This user cannot update this travel'
        )
      }

    } else {
      throw new Error(
        'This travel doesn\'t exists'
      )
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}

export async function deleteTravelSteps(req, res) {
  try {
    const { params: { stepId }, user: { id: userId } } = req
    let travel = await Travel.findOne({ 'steps._id': stepId })
      .populate({
        path : 'team',
        populate : {
          path : 'teamComposition'
        }
      })
    const { team: { teamComposition }, _id: travelId } = travel

    if (travel) {
      const memberIds = teamComposition.map(({ _id: id }) => id.toString())
      if (memberIds.includes(userId.toString())) {
        const updatedTravel = await Travel.updateOne({ '_id': travelId },{
          $pull: {
            steps: stepId
          }
        })
        return res.status(200).json(updatedTravel)
      }
    } else {
      throw new Error(
        'This user cannot delete a step from this travel'
      )
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}
