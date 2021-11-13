export const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : process.env.API_PORT || 5000
export const PROD_URL = 'https://travel-troupe-api.herokuapp.com/'