const  express=require('express');
const  app=express();
const dbConnection=require('./db')


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'))
dbConnection()



// user root route
app.use('/',require('./routes/user'));

// song root route
app.use('/',require('./routes/song'))
// playlist root route
app.use('/playlist',require('./routes/playlist'))


// error handler
app.use( (error,req,res,next)=>{
    const error=new Error('not found');
    let status=error.status=404 || 500
    res.json({
        message:error.message,
        status
    })
})
 const server= app.listen(3000,()=>{
    console.log('app  run  on port 3000')
})

// process.on('unhandledRejection',(err)=>{
//     console.log(`error ${err.message}`);
//     server.close(()=>{
//         process.exit(1)
//     })
// })



// process.on('uncaughtException', function (error) {
//     console.log(error.stack);
//  });
