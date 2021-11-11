import mongoose from 'mongoose'

const connectDb = () => {
  mongoose
    .connect(
      `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOST ?? 'mongodb'}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}?authSource=admin`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err))
}

export default connectDb
