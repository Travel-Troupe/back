import axios from 'axios'

const LOCATION_TYPES = ['country', 'region', 'postcode', 'district', 'place', 'locality', 'neighborhood', 'address', 'poi']

export const getPlace = async (req, res) => {
  try {
    const { searchText, locationTypes } = req.body
    let locationParams

    if (locationTypes && locationTypes.length) {
      // verify if valid types are passed
      const validLocationTypes = locationTypes.every(
        locationType => LOCATION_TYPES.includes(locationType)
      )

      if (!validLocationTypes) {
        throw new Error(`Valid arguments for 'locationTypes' are the followings: ${LOCATION_TYPES.join(', ')}`)
      }
      locationParams = locationTypes.join(',')
    }

    const mapboxData = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(searchText)}.json`,
      {
        params: {
          access_token: process.env.MAPBOX_KEY,
          types: locationParams,
          language: 'fr'
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
