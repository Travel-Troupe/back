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
