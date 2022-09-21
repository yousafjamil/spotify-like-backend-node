const mongoose=require('mongoose');


const dbConnection=async()=>{
    try {
        const connectiondb = mongoose.connect('mongodb+srv://yousaf:yousaf03448307585@cluster0.igtgl.mongodb.net/?retryWrites=false&w=majority').then((data) => console.log('DB Coonected...')).catch(e => console.log("db conn err", e))
console.log('db connected')
    } catch (error) {
        console.log(error)
    }
};

module.exports=dbConnection;