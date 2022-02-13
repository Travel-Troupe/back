import slugify from 'slugify'
import Team from '../models/Team.js'
import User from '../models/User.js'

export async function createTeam(req, res) {
  try {
    const { user, body: { name } } = req
    if (name && user && user.nickname) {
      const owner = await User.findOne({ name: user.nickname })
      const slug = slugify(`${owner.name} ${name}`)
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

export async function joinTeam(req, res) {
  return res.status(200).json({ message: 'joined'})
}

export async function getUsersTeam(req, res) {
  try {
    const { user: { nickname: name } } = req
    if (name) {
      const currentUser = await User.findOne({ name })
      const teams = await Team.find({ teamComposition: currentUser.id })
        .populate('teamComposition')
      return res.status(200).json(teams)
    }
    throw new Error('Invalid request')

  } catch(e) {
    return res.status(400).json({ error: 'Bad request' })
  }
}

// export async function searchTeam(req, res) {

// }
