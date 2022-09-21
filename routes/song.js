const router = require('express').Router();
const Admin = require('../middlewares/Admin');
const Auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');
const { User } = require('../models/user');
const { Song, validate } = require('../models/song');

router.post('/create/song', Auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { name, artist, img, duration, song } = req.body;

    const newsong = new Song({ name, artist, img, duration, song });
    await newsong.save();
    res.status(200).json({ message: "song successfully created", newsong })
})

// all  song
router.get('/allsong', async (req, res) => {
    const songs = await Song.find();
    res.status(200).json({ message: "all  songs", songs })
})
// update the song
router.put('/update/song/:id', [validObjectId, Auth], async (req, res) => {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json({ message: "song successfully updated", updatedSong })

})

//delete song
router.delete('/delete/:id', async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (!song) {
        return res.status(404).json({ message: "song not found" })
    } else {
        const deteteSong = await Song.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "song successfully deleted" })
    }

})


module.exports = router;