const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        images: {type: [String], default:[]},
        following: {type: [String], default:[]},
        followers: {type: [String], default:[]},
        profilePicture: {type: String, default:"uploads/00ba2cb49fd84c1821b8790b0c4123ed"}
    },
    {timestamps: true}
)

const userModel = mongoose.model("users", userSchema)

module.exports = {
    userModel,
}