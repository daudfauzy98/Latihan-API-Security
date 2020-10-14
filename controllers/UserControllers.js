import User from './../models/user.js'
import express from 'express'
import bcrypt from 'bcrypt'

const userRouter = express.Router()

// Add new user
userRouter.post('/add', async (req, res) => {
   try {
      const {
         username,
         password
      } = req.body

      // Digit kode salt dalam kode hash
      var saltRounds = 10
      const hashedPw = await bcrypt.hash(password, saltRounds)

      const newUser = new User({
         "username": username,
         "password": hashedPw
      })

      const createdUser = await newUser.save()
      res.status(201).json(createdUser)

   } catch(error) {
      res.status(500).json({ error: error })
   }
})

// Login user
userRouter.post('/login', async (req, res) => {
   try {
      // Ambil username dan password yang dimasukkan
      const { username, password } = req.body;
      
      // Buat variabel untuk penampung value username
      const currentUser = await new Promise((resolve, reject) => {
         User.find({ "username": username }, (err, user) => {
            if(err)
                  reject(err)
            resolve(user)
         })
      })
      
      // Cek apakah ada username seperti yang dimasukkan?
      if(currentUser[0]) {
         // Jika ketemu (ada) cek passwordnya
         bcrypt.compare(password, currentUser[0].password).then((result) => {
            if(result){
               // Urus token disini 
               // Jika password benar
               res.status(201).json({ "status": "Logged in!" });
            }
            else {
               // Jika password salah
               res.status(201).json({ "status": "Wrong password!" });
            }
         });
      }
      else{
         // Jika username yang dimasukkan tidak terdaftar
         res.status(201).json({ "status": "Username not found" });
      }
   } catch(error) {
      // Jika terjadi error/kesalahan teknis saat login
       res.status(500).json({ error: error })
   }
})

userRouter.get('/profile/:id', async (req, res) => {
   const user = await User.findById(req.params.id)

   if(user) {
       res.json(user)
   } else {
       res.status(404).json({ message: 'User ID not found!' })
   }
})

userRouter.put('/update/:id', async (req, res) => {
   const { username, password } = req.body
   
   const user = await User.findById(req.params.id)

   var saltRounds = 10
   const hashedPassword = await bcrypt.hash(password, saltRounds)

   if(user) {
      user.username = username
      user.password = hashedPassword

       const updateUser = await user.save()

       res.json(updateUser)
   } else {
       res.status(404).json({ message: 'User ID not found!' })
   }
})

userRouter.delete('/delete/:id', async (req, res) => {
   const user = await User.findById(req.params.id)

   if(user) {
       await user.remove()
       res.json({ message: 'User success removed' })
   } else {
       res.status(404).json({ message: 'User ID not found!' })
   }
})

export default userRouter