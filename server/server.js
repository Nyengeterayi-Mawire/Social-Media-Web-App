require('dotenv').config();
const express = require('express');   
const cors = require('cors');  
const http = require('http')
const {Server} = require('socket.io')
const { default: mongoose } = require('mongoose'); 
const userRouter = require('./routes/userRoutes.js');  
const postsRouter = require('./routes/postsRoutes.js') 
const commentsRouter = require('./routes/commentsRoutes.js'); 
const messageRouter = require('./routes/messageRoutes.js');
// const {auth} = require('./middleware/auth.js') 

const app = express();   
app.use(express.json());
 app.use(cors());  
 app.use(express.static('upload')); 

 const server = http.createServer(app);

 const io= new Server(server,{
     cors : {
         origin : "http://localhost:3000", 
         methods : ["GET","POST"]
     }
 })
 
 
 
 
 let userList = []
 io.on("connection",(socket)=>{
     console.log(`user : ${socket.handshake.query.username} with id number ${socket.handshake.query.userID} has socket id ${socket.id}`) 
     userList.push({userID :socket.handshake.query.userID , username: socket.handshake.query.username, socketID : socket.id })
     console.log('list',userList);  

     io.emit('newLogin',{userID :socket.handshake.query.userID , username: socket.handshake.query.username, socketID : socket.id })
    socket.join('room'); 
    socket.on('addPost',data=>{ 
        console.log(data)
        io.emit('addPost',data)
    })
  
     socket.to('room').emit('activeUsers',userList); 

     socket.on('privateMessage',(data)=>{
        socket.to(data.socketID).emit('privateMessage',data)
     }) 

     socket.on('follow',data=>{ 
        console.log('data received',data)
        socket.to(data.socketID).emit('follow',data.follower)
     }) 
     socket.on('unFollow',data=>{ 
        console.log('data received',data)
        socket.to(data.socketID).emit('unFollow',data.follower)
     }) 
     socket.on('likeNotification',data=>{
        console.log(data) 
        socket.to(data.userLiked.socketID).emit('likeNotification',data);
     }); 
     socket.on('commentNotification',data=>{ 
        console.log(data) 
        socket.to(data.userLiked.socketID).emit('commentNotification',data)
     }); 
     socket.on('sendMessage',data=>{
        console.log(data); 
        socket.to(data.sendTo.socketID).emit('sendMessage',data)
     })
 
     socket.on("disconnect",()=>{ 
        userList = userList.filter(user=>user.socketID !== socket.id)
         console.log('user disconnected',socket.handshake.query.userID)
         console.log(' new list',userList) 
         io.emit('logout',socket.handshake.query.userID)
     })
 })

app.get('/socket',(req,res)=>{
    res.status(200).json(userList)
})

app.use('/register',userRouter);  
app.use('/post',postsRouter);  
app.use('/comment', commentsRouter);
app.use('/message',messageRouter);




mongoose.connect(process.env.URL).then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log('listening on port 3001')
    })
}).catch((err)=>console.log(err))

