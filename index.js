import express from 'express';
import mongoose from 'mongoose';
// import socket from 'socket.io';
import { Server } from "socket.io";
// const socket = require('socket.io')
// import * as socket from 'socket.io';
import { createServer } from "http";
import router from './router.js';
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import checkAuth from './utils/checkAuth.js';
import UserModal from './models/User.js'

const app = express()
const http = createServer(app);
// const server = createServer(app)
export const io = new Server(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
// const io = socket(http);
const PORT = process.env.PORT || 3003
const DB_URL = `mongodb+srv://admin:admin@cluster0.aeu5zzy.mongodb.net/?retryWrites=true&w=majority`

//Как сделать получение друзей лучше 
//Чтобы получать нормально друзей, нужно в бэке написать populate, чтобы мы получали не только айди ну и всме данные,а не чтобы потом на фронте пробегать по массиву и выбирать только дрезй по айди 

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
        io.on("connection", (socket) => {
            console.log('CONNECTED');
            socket.emit('111', 'qwe')
        })
        await mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
        http.listen(PORT, () => {
            console.log("Сервер и БД запущены")
        })
    } catch (error) {
        console.log(error);
    }
}

startApp()
