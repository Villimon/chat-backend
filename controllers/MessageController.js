import { io } from '../index.js'
import MessageModal from '../models/Message.js'
import DialogModal from '../models/Dialog.js'

export const getMessages = async (req, res) => {
    try {
        const dialogId = req.query.dialog

        const dialogs = await MessageModal.find({ dialog: dialogId })
            .populate(['dialog', 'user'])

        res.json(dialogs)
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Сообщение не получены'
        })
    }
}


export const createMessage = async (req, res) => {
    try {
        const doc = new MessageModal({
            text: req.body.text,
            dialog: req.body.dialogId,
            user: req.userId
        })


        const message = await doc.save()
            .then((obj) => {
                obj.populate(['dialog', 'user'], (err, message) => {
                    if (err) {
                        return res.status(500).json({
                            status: 'error',
                            message: err
                        })
                    }

                    DialogModal.findOneAndUpdate(
                        { _id: doc.dialog },
                        { lastMessage: message._id },
                        { upsert: true },
                        function (err, doc) {
                            if (err) {
                                return res.status(500).json({
                                    status: 'error',
                                    message: err
                                })
                            }
                        }
                    )

                    io.emit('NEW:MESSAGE', message)
                    res.json(message)

                })
            })





        // res.json(message)
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Сообщение не создано'
        })
    }
}


export const deleteMessage = async (req, res) => {
    try {
        const id = req.params.id

        const dialog = await MessageModal.findOneAndRemove({ _id: id })

        res.json({
            message: "Сообщение удалено"
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Сообщение не удалено'
        })
    }
}
