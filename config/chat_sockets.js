module.exports.chatSockets = function(socketServer){
 
    let io = require("socket.io")(socketServer, {
      cors: {
        origin: "*",
      },
    });
    // below line will detect and event name connection and also fires/emit back an event in the form of acknowledgement name connect and that event has been cathched at user end in js file name chat_engine.
    io.sockets.on('connection', function(socket){ // connection is an event, on recieving the event 'connection', then perform the callback funtion.
        console.log('new connecton recived', socket.id);
        // socket is an object which contains lots of property of the user which is sending the connection

        socket.on('disconnect', function(){
            console.log('socket disconnected!')
        });

        socket.on('join_room', function(data){
            console.log('Joining request recieved', data);

            socket.join(data.chatroom);    // what this line will do is if there exist a chatroom with name socialcode, then enter the user into it, if not then create the chatroom and then enter the user into it.

            // after user joined the chat room, then sent the notification to other user present in that chatroom. 

            io.in(data.chatroom).emit('user_joined', data);

            //  CHANGE :: detect send_message and broadcast to everyone in the room
            socket.on("send_message", function (data) {
                console.log('message recieved at server end!');
                io.in(data.chatroom).emit("receive_message", data);
            });
        });
    });
};

// module.exports.chatSockets = function (socketServer) {
//     let io = require("socket.io")(socketServer, {
//       cors: {
//         origin: "*",
//       },
//     });
    
//     io.sockets.on("connection", function (socket) {
//       console.log("new connection received", socket.id);
  
//       socket.on("disconnect", function () {
//         console.log("socket disconnected!");
//       });
  
//       socket.on("join_room", function (data) {
//         console.log("joining request rec.", data);
  
//         socket.join(data.chatroom);
  
//         io.in(data.chatroom).emit("user_joined", data);
//       });
  
//       // CHANGE :: detect send_message and broadcast to everyone in the room
//       socket.on("send_message", function (data) {
//         io.in(data.chatroom).emit("receive_message", data);
//       });
//     });
//   };