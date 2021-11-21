export const isProduction = process.env.NODE_ENV === 'production'
export const PORT = isProduction ? process.env.PORT : process.env.API_PORT || 5000
export const PROD_URL = 'https://travel-troupe-api.herokuapp.com'
