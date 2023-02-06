// создание токена
import jwt from 'jsonwebtoken'
// Шифруем пароль
import bcrypt from 'bcryptjs';
import UserModal from '../models/User.js'



export const register = async (req, res) => {

    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const { email, fullName } = req.body
        const candidateName = await UserModal.findOne({ fullName })
        const candidateEmail = await UserModal.findOne({ email })
        if (candidateName || candidateEmail) {
            return res.status(400).json({
                message: 'Пользователь с таким именем или почтой уже существует'
            })
        }

        const doc = new UserModal({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hash,
            avatarUrl: req.body.avatarUrl,
        })



        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id,
        }, 'qwezxcasd',
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc


        res.json({ ...userData, token })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Не удалось зарегистрироваться'
        })
    }


}


export const login = async (req, res) => {

    try {
        const user = await UserModal.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password)


        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'qwezxcasd')


        res.json({ ...user._doc, token })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Не удалось авторизоваться'
        })
    }


}


export const getMe = async (req, res) => {

    try {
        const user = await UserModal.findById(req.userId)
            .populate(['friends'])

        if (!user) {
            return res.status(404).json({
                message: 'Пользваотель не найден'
            })
        }

        res.json(user._doc)
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Не удалось получить данные'
        })
    }
}


export const updateFullName = async (req, res) => {

    try {
        const updateUser = await UserModal.findByIdAndUpdate({ _id: req.userId },
            { '$set': { fullName: req.body.fullName } }, { new: true }
        )
        res.json(updateUser)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Не удалось обновить профиль'
        })
    }


}



export const getAllUsers = async (req, res) => {
    try {
        let fullName = req.query.term
        // const users = await UserModal.find()

        // if (fullName) {
        const users = await UserModal.find({ fullName: new RegExp(fullName, 'i') })
        return res.json(users)
        // }


        // res.json(users)
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Не удалось получить пользователей'
        })
    }
}

export const following = async (req, res) => {
    try {

        const userId = req.params.id

        UserModal.findOneAndUpdate({
            _id: req.userId
        },
            {
                $push: { friends: userId }
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть пользователя'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Пользователь не найдена'
                    })
                }
                res.json(doc)
            }
        ).populate('friends')


    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Не удалось добавить пользователя в друзья'
        })
    }
}
export const unfollowing = async (req, res) => {
    try {

        const userId = req.params.id

        UserModal.updateOne({
            _id: req.userId
        },
            {
                $pull: { "friends": userId }
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть пользователя'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Пользователь не найдена'
                    })
                }
                res.json(doc)
            }
        )


    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Не удалось удалить пользователя из друзей'
        })
    }
}
