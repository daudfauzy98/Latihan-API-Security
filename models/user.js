import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
   {
      username: {
         type: String,
         required: true,
      },
      password: {
         type: String,
         required: true,
      }
   },
   {
      timestamps: true,
   }
)
// Parameter 'User' nanti yang akan menjadi nama collections di database MongoDB
// Pada database MongoDB, secara otomatis 'User' akan dikonversi menjadi 'users'
const User = mongoose.model('User', userSchema)

export default User