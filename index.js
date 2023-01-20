import express from 'express';
import mongoose from 'mongoose';
import router from './router.js';
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import checkAuth from './utils/checkAuth.js';
import UserModal from './models/User.js'

const app = express()
const PORT = process.env.PORT || 3003
const DB_URL = `mongodb+srv://admin:admin@cluster0.aeu5zzy.mongodb.net/?retryWrites=true&w=majority`



app.use(express.json())
app.use(cors())
app.use('/api', router)
app.use('/uploads', express.static('uploads'))



const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.put('/users', checkAuth, upload.single('image'), async (req, res) => {
    const updateUser = await UserModal.findByIdAndUpdate({ _id: req.userId },
        { '$set': { avatarUrl: `/uploads/${req.file.originalname}` } }, { new: true }
    )
    res.json(updateUser)
    // res.json({
    //     url: `/uploads/${req.file.originalname}`
    // })
})


async function startApp() {
    try {
        await mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
        app.listen(PORT, () => {
            console.log("Сервер запущен и DB запущена")
        })
    } catch (error) {
        console.log(error);
    }
}

startApp()
