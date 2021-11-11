import app from './app.js'

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : process.env.API_PORT || 5000

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}: http://localhost:${PORT}`)
})
