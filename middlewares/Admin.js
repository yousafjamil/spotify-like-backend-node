const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Admin = async (req, res, next) => {
    let token = req.headers.token;
    try {
        if (!token) return res.status(403).json({ message: "Access Denied" });

        let decoded = await jwt.verify(token, 'some secret here');
        if (!decoded) return res.status(400).json({ message: "invalid token" })

        // req.user=await User.findById(decoded);
        // req.user=decoded;
       
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "only Admin can Access" });
        }

        next()
    } catch (error) {
        res.status(500).json({ error })
    }


}
module.exports = Admin;