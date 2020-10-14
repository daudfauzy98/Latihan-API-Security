import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import router from './router.js'
import userRouter from './controllers/UserControllers.js'

// Membuat objek app dari kelas Express
const app = express()

// Konksikan program dengan MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true,}
).then(() => {
    console.log('Connect to MongoDB database success!')
}).catch(err => {
    console.log('Connect to failed ' + err)
})

// Middlewares
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res, next) => {
    res.json({ message: "Success!" })
})

app.use('/api', router)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || '4000'
app.listen(PORT, () => {
    console.log(`App listens on port ${PORT}`)
})