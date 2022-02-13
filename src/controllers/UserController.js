import User from '../models/User.js'

export async function loggedIn(req, res) {
  try {
    const { nickname } = req.user
    const user = await User.findOne({ name: nickname }).exec()
    const { name } = user ?? (
      await User.create({ name: nickname })
    )
    return res.status(200).json({ name })
  } catch(e) {
    return res.status(400).json({ message: 'User is not defined' })
  }
}
