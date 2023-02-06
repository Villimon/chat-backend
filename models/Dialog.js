import mongoose from "mongoose";




const DialogSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
},
    {
        timestamps: true
    }
)



export default mongoose.model('Dialog', DialogSchema);