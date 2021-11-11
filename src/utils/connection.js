import mongoose from 'mongoose'

const connectDb = () => {
  const MONGO_DB_URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_DB_URI : `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOST ?? 'mongodb'}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}?authSource=admin`
  mongoose
    .connect(
      MONGO_DB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err))
}

export default connectDb
