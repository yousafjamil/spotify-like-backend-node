const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: { type: String, required: [true, 'name is required'] },
    email: { type: String, required: [true, 'email is required'] },
    password: { type: String, required: [true, 'password is required'] },
    gander: { type: String, required: [true, 'gander is required'] },
    year: { type: String, required: [true, 'year is required'] },
    month: { type: String, required: [true, 'month is required'] },
    likedSong: { type: [String], default: [] },
    playlists: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false },


})

const validate = (user) => {
    const shcema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        year: Joi.string().required(),
        gander: Joi.string().required().valid('male', 'female'),
        month: Joi.string().required(),
        isAdmin:Joi.boolean()

    })
    return shcema.validate(user)
}

userSchema.methods.generateToken = function () {
    let token = jwt.sign({ id: this.id, isAdmin: this.isAdmin }, 'some secret here');
    return token;
}

let User = mongoose.model("user", userSchema);

module.exports = {
    validate,
    User
}