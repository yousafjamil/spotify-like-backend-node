const mongoose = require('mongoose');
const Joi = require('joi');



const songSchema = mongoose.Schema({
    name: { type: String, required: [true, 'name is required'] },
    artist: { type: String, required: [true, 'artist is required'] },
    song: { type: String, required: true },
    img: { type: String, required: true },
    duration: { type: String, required: true },

})

const validate = (song) => {
    const shcema = Joi.object({
        name: Joi.string(),
        artist: Joi.string().required(),
        song: Joi.string().required(),
        img: Joi.string().required(),
        duration: Joi.string().required(),

    })
    return shcema.validate(song)
}



let Song = mongoose.model("song", songSchema);

module.exports = {
    validate,
    Song
}