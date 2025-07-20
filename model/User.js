import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        maxLength: 50,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    birthDate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    shehrityId: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    }
});
const User = mongoose.model("User", userSchema);
export default User;