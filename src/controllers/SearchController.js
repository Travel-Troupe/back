import axios from 'axios'

export const getPlace = async (req, res) => {
  try {
    const { searchText } = req.body
  
    const mapboxData = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(searchText)}.json`,
      {
        params: {
          access_token: process.env.MAPBOX_KEY
        }
      }
    )
    const { data } = mapboxData

    return res.status(200).json(data)
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: `Bad request: ${e?.message}` })
  }
}
