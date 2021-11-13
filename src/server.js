import app from './app.js'
import { PORT } from './config/constant.js'

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}: http://localhost:${PORT}`)
})
