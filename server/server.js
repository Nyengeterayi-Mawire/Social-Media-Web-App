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
const path = require('path');

const app = express(); 
//middlewares  
app.use(express.json());
app.use(cors());  
app.use(express.static('upload')); 
app.use(express.static(path.join(__dirname, 'client/build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });
app.get('/',(req,res)=>{
    res.send('The backend is working')
})

//create http server
const server = http.createServer(app);

const io= new Server(server,{
    cors : {
        origin : "http://localhost:3000", 
        methods : ["GET","POST"]
    }
})



//list of online users
let userList = []
io.on("connection",(socket)=>{
    userList.push({userID :socket.handshake.query.userID , username: socket.handshake.query.username, socketID : socket.id })
    io.emit('newLogin',{userID :socket.handshake.query.userID , username: socket.handshake.query.username, socketID : socket.id })
    socket.join('room'); 
    socket.on('addPost',data=>{ 
        io.emit('addPost',data)
    })

    socket.to('room').emit('activeUsers',userList); 

    //send message
    socket.on('privateMessage',(data)=>{
        socket.to(data.socketID).emit('privateMessage',data)
    }) 
    //follow a user
    socket.on('follow',data=>{ 
        socket.to(data.socketID).emit('follow',data.follower)
    }) 
    //unfollow a user
    socket.on('unFollow',data=>{ 
        socket.to(data.socketID).emit('unFollow',data.follower)
    }) 
    //like a post
    socket.on('likeNotification',data=>{
        socket.to(data.userLiked.socketID).emit('likeNotification',data);
    }); 
    //comment on post
    socket.on('commentNotification',data=>{ 
        socket.to(data.userLiked.socketID).emit('commentNotification',data)
    }); 
    //send message
    socket.on('sendMessage',data=>{
        socket.to(data.sendTo.socketID).emit('sendMessage',data)
    })

    //logout or disconnect
    socket.on("disconnect",()=>{ 
    userList = userList.filter(user=>user.socketID !== socket.id)
        console.log('user disconnected',socket.handshake.query.userID)
        console.log(' new list',userList) 
        io.emit('logout',socket.handshake.query.userID)
    })
})

//Request to get list of online users
app.get('/socket',(req,res)=>{
    res.status(200).json(userList)
})

//Routes
app.use('/register',userRouter);  
app.use('/post',postsRouter);  
app.use('/comment', commentsRouter);
app.use('/message',messageRouter);




mongoose.connect(process.env.URL).then(()=>{
server.listen(process.env.PORT,()=>{
    console.log('listening on port 3001')
})
}).catch((err)=>console.log(err))

