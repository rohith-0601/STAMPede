import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    },
    latitude:{
        type:Number,
        required:true
    },
    longitude:{
        type:Number,
        required:true
    },
    updatedAt:{
        type:Date,
        default:Date.now(),
    }
})

const User = mongoose.model("User",UserSchema);
export default User;