import { io } from '../index.js'
import DialogModal from '../models/Dialog.js'
import MessageModal from '../models/Message.js'


export const getAllDialogs = async (req, res) => {
    try {
        const authorId = req.userId
        const dialogs = await DialogModal.find({ $or: [{ author: authorId }, { partner: authorId }] })
            .populate(['author', 'partner'])
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'user'
                }
            })
        res.json(dialogs)
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Диалоги не получены'
        })
    }
}


export const createDialog = async (req, res) => {
    try {
        const doc = new DialogModal({
            author: req.body.author,
            partner: req.body.partner,
        })



        const dialog = await doc.save()

        const messageDoc = new MessageModal({
            text: req.body.text,
            dialog: dialog._id,
            user: req.body.author
        })

        const message = await messageDoc.save()
            .then((message) => {


                DialogModal.findOneAndUpdate(
                    { _id: dialog._id },
                    { $set: { lastMessage: message } },
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

                res.json(dialog)
                io.emit('DIALOG_CREATED', {
                    ...doc,
                    dialog: dialog
                })


            })




        // res.json({ dialog, message })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Диалог не создан'
        })
    }
}


export const deleteDialog = async (req, res) => {
    try {
        const id = req.params.id

        const dialog = await DialogModal.findOneAndRemove({ _id: id })

        const message2 = await MessageModal.deleteOne({ dialog: dialog })

        res.json({
            dialog,
            message2,
            message: 'Диалог удален'
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Диалоги не удален'
        })
    }
}
