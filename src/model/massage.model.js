

import mongoose,{Schema} from "mongoose";


const massageRequest = new Schema({
    whorequesttomassage :{
        type: Schema.Types.ObjectId, // one who get react
        ref: "User",
        require: [true, " is required"],
    },
    whoaccepttomassage :{
        type: Schema.Types.ObjectId, // one to whom give react
        ref: "User",
        require: [true, " is required"],
    },
    
})
export  const Massagerequest = mongoose.model("Massagerequest",massageRequest) 