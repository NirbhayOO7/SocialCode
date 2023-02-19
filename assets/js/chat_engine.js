class chatEngine{

    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        // below line will emit an event named connection.
        this.socket = io.connect('http://localhost:5000');  // io is global variable we get from the sockets.io cdn which we have in home.ejs file, io.connect will fire an event called connection which we have handeled in our backend module in chat_socket.js

        if(this.userEmail)
        {
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self = this;
        // console.log(this);

        // below line will detect an event 'connect' from the chat_socket.js-> io.socket.on function.
        this.socket.on('connect', function(){ // on receiving connect event, perform the callback funtion. 
            console.log('Connection established using sockets..........!');
        });

        self.socket.emit('join_room', {  //join_room is the event name it can be anything, but we have to mention the same even name on the server side to recieve the incoming event.
            user_email:self.userEmail,
            chatroom : 'socialcode'
        });

        self.socket.on('user_joined', function(data){
            console.log('a user joined!', data);
        });

      // CHANGE :: send a message on clicking the send message button
        $("#send-message").click(function () {
            let msg = $("#chat-message-input").val();
        
            if (msg != "") {
            self.socket.emit("send_message", {
                message: msg,
                user_email: self.userEmail,
                chatroom: "socialcode",
            });
            }

            console.log(msg);
        });
    
        self.socket.on("receive_message", function (data) {
            console.log("message received", data.message);
    
            let newMessage = $("<li>");
    
            let messageType = "other-message";
    
            if (data.user_email == self.userEmail) {
            messageType = "self-message";
            }
    
            newMessage.append(
            $("<span>", {
                html: data.message,
            })
            );
    
            newMessage.append(
            $("<sub>", {
                html: data.user_email,
            })
            );
    
            newMessage.addClass(messageType);
    
            $("#chat-messages-list").append(newMessage);
        });
    }
}

// class chatEngine {
//     constructor(chatBoxId, userEmail) {
//       this.chatBox = $(`#${chatBoxId}`);
//       this.userEmail = userEmail;
  
//       this.socket = io.connect("http://localhost:5000");
  
//       if (this.userEmail) {
//         this.connectionHandler();
//       }
//     }
  
//     connectionHandler() {
//       let self = this;
  
//       this.socket.on("connect", function () {
//         console.log("connection established using sockets...!");
//       });

//       self.socket.emit("join_room", {
//         user_email: self.userEmail,
//         chatroom: "codeial",
//       });

//       self.socket.on("user_joined", function (data) {
//         console.log("a user joined!", data);
//       });
  
    //   // CHANGE :: send a message on clicking the send message button
    //   $("#send-message").click(function () {
    //     let msg = $("#chat-message-input").val();
  
    //     if (msg != "") {
    //       self.socket.emit("send_message", {
    //         message: msg,
    //         user_email: self.userEmail,
    //         chatroom: "codeial",
    //       });
    //     }
    //   });
  
//       self.socket.on("receive_message", function (data) {
//         console.log("message received", data.message);
  
//         let newMessage = $("<li>");
  
//         let messageType = "other-message";
  
//         if (data.user_email == self.userEmail) {
//           messageType = "self-message";
//         }
  
//         newMessage.append(
//           $("<span>", {
//             html: data.message,
//           })
//         );
  
//         newMessage.append(
//           $("<sub>", {
//             html: data.user_email,
//           })
//         );
  
//         newMessage.addClass(messageType);
  
//         $("#chat-messages-list").append(newMessage);
//       });
//     }
//   }