require('dotenv').config();

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/dbsawala');

const app = require('express')();

const http = require('http').Server(app);

const userRoute = require('./routes/userRoute');
const User = require('./models/chatModel');

app.use('/', userRoute);

const io = require('socket.io')(http);

var usp = io.of('/user-namespace');

usp.on('connection', async function(socket){
    console.log('User connected');
        
        var userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate({_id: userId}, {$set:{ is_online: true }})

        //user broadcast online status
        socket.broadcast.emit('getOnlineUser', {user_id: userId});

    socket.on('disconnect', async function(){
        console.log('User Disconnected');

        var userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate({_id: userId}, {$set:{ is_online: false }});

        //user broadcast offline status
        socket.broadcast.emit('getOfflineUser', {user_id: userId});

    });

    //chating implemetasi
    socket.on('newChat', function(data){
        socket.broadcast.emit('loadNewChat', data);
    });

});


http.listen(3000, function(){
    console.log('port connected')
});