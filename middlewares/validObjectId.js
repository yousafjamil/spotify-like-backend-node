const  mongoose=require('mongoose');
const User=require('../models/user')
const validObjectId=async (req,res,next)=>{
if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(400).json({message:"invalid object  ID"})
   
}
next()
};

module.exports=validObjectId;