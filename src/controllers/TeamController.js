import slugify from 'slugify'
import Team from '../models/Team.js'
import User from '../models/User.js'

export async function createTeam(req, res) {
  try {
    const { user, body: { name } } = req

    if (name && user && user.name) {
      const owner = await User.findOne({ name: user.name })
      const slug = slugify(`${owner.name} ${name}`.toLowerCase())
      const team = await Team.create({
        name,
        slug,
        owner: owner.id,
        teamComposition: [
          owner.id
        ]
      })
      return res.status(201).json(team)
    }
    throw new Error('Invalid request')
  } catch(e) {
    console.error(e)
    return res.status(400).json({ error: 'Bad request' })
  }
}

/**
 * Joining team with slug
 */
export async function joinTeam(req, res) {
  const { name } = req.user
  const { slug } = req.body

  const currentUser = await User.findOne({ name })

  const team = await Team.findOne({ slug })

  if (team && currentUser) {
    if (!team.teamComposition.includes(currentUser.id)) {
      team.teamComposition.push(currentUser.id)
      team.save()
      return res.status(200).json({ message: 'joined'})
    } else {
      return res.status(400).json({ message: 'you\'ve already joined this team'})
    }
  }

  return res.status(400).json({ message: 'Nothing happened'})
}

export async function getUsersTeam(req, res) {
  try {
    const { user: { name } } = req

    if (name) {
      const currentUser = await User.findOne({ name })
      const teams = await Team.find({ teamComposition: { $in: [currentUser.id]} })
        .populate('teamComposition')
      return res.status(200).json(teams)
    }
    throw new Error('Invalid request')

  } catch(e) {
    return res.status(400).json({ error: 'Bad request' })
  }
}

export async function getTeamById(req, res) {
  const { params: { teamId } } = req
  try {
    if (teamId) {
      const team = await Team.findById(teamId).populate('teamComposition')

      return res.status(200).json(team)
    } else {
      throw new Error('Bad request, please provide a valid teamId')
    }
  } catch(e) {
    return res.status(400).json({ error: 'Bad request' })
  }
}
