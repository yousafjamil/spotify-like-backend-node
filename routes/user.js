const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Admin = require('../middlewares/Admin');
const Auth = require('../middlewares/auth');
const validObjectId = require('../middlewares/validObjectId');
const { Song } = require('../models/song');
const { User, validate } = require('../models/user');

router.post('/register', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message })

    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "user with  this email  already  exist" })
    } else {
        const hashpassword = await bcrypt.hash(req.body.password, 10)
        const newuser = new User({
            ...req.body,
            password: hashpassword
        }
        ).select('-password')
        const saveuser = await newuser.save();
     
        res.status(200).json({
            message: "user account successfully created",
            saveuser
        })
    }
})
// /////////////login

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "user does not exist" });
    const matchpassword = await bcrypt.compare(req.body.password, user.password);
    if (!matchpassword) {
        return res.status(400).json({ message: "invalid password", success: false })
    } else {
        let token = user.generateToken();

        res.status(200).json({
            message: "user successfully login",
            token
        })
    }
})

// get all  reguster user
router.get('/allusers', Auth, async (req, res) => {
    let users = await User.find().select('-password');
    res.status(200).json({ message: "all registered user", users })
})

// get  user by  id
router.get('/user/:id', validObjectId, Auth, async (req, res) => {
    let user = await User.findById(req.params.id).select('-password')
    res.status(200).json({ message: " registered user", user })
})

// update user
router.put('/update/:id', [validObjectId, Auth], async (req, res) => {
    const updateduser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select('-password');
    res.status(200).json({ message: "user successfully updated", updateduser })
})



// delete user
router.delete('/delete/user/:id', [validObjectId, Admin], async (req, res) => {

    let deleteuser = await User.findByIdAndDelete(req.params.id);
    if (!deleteuser) return res.status(400).json({ message: "user which you want to  delete is not found" });

    res.status(200).json({ message: "user successfully deleted" })
});



router.put('/like/song/:id', [validObjectId, Auth], async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(400).json({ message: "song not exist" })
    const user = await User.findById(req.user.id);
    let index = await user.likedSong.indexOf(song.id);
 
    if (index === -1) {
        user.likedSong.push(song.id)
        await user.save();
        return res.status(400).json({ message: "song  liked" })
    } else {
        user.likedSong.splice(index, 1);
        await user.save();
        res.status(400).json({ message: "song  Unlike" })
    }

})


// delete song
router.delete('/delete/song/:id', [validObjectId, Auth], async (req, res) => {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
        return res.status(400).json({ message: "song not found" })
    }
    const user = await User.findById(req.user.id);
    let index = user.likedSong.indexOf(req.params.id)
    user.likedSong.splice(index, 1);
    await user.save();
    res.status(200).json({ message: "song successfully deleted", deletedSong })

})
// user liked songs
router.get('/likedsong',Auth,async(req,res)=>{
    const user=await User.findById(req.user.id);
    const likedsong=await Song.find({_id:user.likedSong});
    res.status(200).json({message:"all liked song",likedsong})
})



module.exports = router