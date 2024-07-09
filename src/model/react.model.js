import mongoose,{Schema} from "mongoose";


const reactSchema=new Schema({
    whoreact :{
        type: Schema.Types.ObjectId, // one who get react
        ref: "User",
        require: [true, " is required"],
    },
    whogetreact :{
        type: Schema.Types.ObjectId, // one to whom give react
        ref: "User",
        require: [true, " is required"],
    }
})
export  const Lovereact = mongoose.model("Lovereact",reactSchema) 