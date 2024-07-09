import mongoose,{Schema} from "mongoose";

const chatSchema = new Schema ({
    userone : {type: String, required: true},  //
    usertwo : { type: String ,required:true },   //
    messages : [{
        createdAt:{type:Date,default: Date.now()},
        message : {type:String},
        senderid :{type:String}
    }]
})

export const  Chats= mongoose.model("Chats",chatSchema)