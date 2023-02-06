import mongoose from "mongoose";




const MessageSchema = new mongoose.Schema({
    text: { type: String, require: true },
    unread: { type: Boolean, default: false },
    dialog: { type: mongoose.Schema.Types.ObjectId, ref: 'Dialog', require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
},
    {
        timestamps: true
    }
)



export default mongoose.model('Message', MessageSchema);