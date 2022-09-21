const router = require('express').Router();
const Admin = require('../middlewares/Admin');
const Auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');
const { User } = require('../models/user');
const { Playlist, validate } = require('../models/playlist');


router.post('/create', Auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { name, song, desc, img } = req.body;

    const newplaylist = await Playlist.create({ name, song, desc, img, user: req.user.id });

    const user = await User.findById(req.user.id);
    user.playlists.push(newplaylist.id);
    await user.save();
    res.status(200).json({ message: 'playlist successfully created', newplaylist })
})
// get all playlist
router.get('/all', async (req, res) => {
    const allplaylist = await Playlist.find();
    res.status(200).json({ message: 'all playlist', allplaylist })
})

// get my created playlist
router.get('/mycreated', Auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    const mycreatedPlylist = await Playlist.findById({user})
    res.status(200).json({
        message: "my all  created playlist",
        mycreatedPlylist,

    })
})

// update playlist
router.put('/update/:id', [validObjectId, Auth], async (req, res) => {
    const updatedplaylist = await Playlist.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json({ message: "playlist updated", updatedplaylist })
})

// delete playlist
router.delete('/delete/:id', validObjectId, Auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    let index = await user.playlists.indexOf(req.params.id);


    const deletedplaylist = await Playlist.findByIdAndDelete(req.params.id);
    if (!deletedplaylist) {
        return res.status(400).json({ message: "playlist not found" })
    }
    if (!index) {
        return res.status(404).json("playlis not found")
    }
    user.playlists.splice(index, 1);
    await user.save()
    res.status(200).json({ message: "playlist successfully deleted." })
})

module.exports = router;