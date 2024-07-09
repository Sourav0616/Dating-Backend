
import mongoose,{Schema} from "mongoose";


const matchRequestSchema = new Schema({
    whorequest :{
        type: Schema.Types.ObjectId, // one who get react
        ref: "User",
        require: [true, " is required"],
    },
    whogetrequest :{
        type: Schema.Types.ObjectId, // one to whom give react
        ref: "User",
        require: [true, " is required"],
    },
    
})
export  const Matchrequest = mongoose.model("Matchrequest",matchRequestSchema) 