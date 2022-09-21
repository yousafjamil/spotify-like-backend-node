const mongoose = require('mongoose');
const Joi = require('joi');



const playlistSchema = mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    desc: { type: String },
    img: { type: String },
    songs: { type: [String], default: [] },

})

const validate = (playlist) => {
    const shcema = Joi.object({
        name: Joi.string(),
        song: Joi.string(),
        desc: Joi.string().allow(),
        img: Joi.string().allow(),
        user: Joi.string(),

    })
    return shcema.validate(playlist)
}



let Playlist = mongoose.model("playlist", playlistSchema);

module.exports = {
    validate,
    Playlist
}