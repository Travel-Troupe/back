import axios from 'axios'

export default class Location {
  static async getLocation(locationPoi) {
    try {
      const { data: mapboxData } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationPoi}.json`,
        {
          params: {
            access_token: process.env.MAPBOX_KEY
          }
        }
      )

      return mapboxData?.features?.[0] ?? []

    } catch(unsplashError) {
      return { error:'Location not found' }
    }
  }
}
