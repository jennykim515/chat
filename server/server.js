
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080'],
    },
})

/**
 * key: username
 * value: {
 *  name: Name
 *  language: language
 *  socketId: socket id
 * }
 */
let users = {}

io.on('connection', socket => {
    socket.on('register-user', (new_user, status) => {
        if (new_user.username in users) {
            console.log(`${new_user} already exists`)
            for (let user in users) {
                console.log(user.username)
            }
            status(false)
        }
        else {
            users[new_user.username] = {
                name: new_user.name,
                language: new_user.language,
                socketId: socket.id
            }

            socket.broadcast.emit('new-user-update', new_user)
            status(true)
        };
    })

    socket.on('ping', (user) => {
        if (user in users) {
            console.log(user, 'is online')
            socket.emit('friend-info', users[user])
        }
        else {
            console.log(user, 'is offline')
        }
    })

    socket.on('send-message', (message, room) => {
        console.log("received mssage, sending it back", message)
        socket.to(room).emit('receive-message', message)
    })

    socket.on('join-room', (room, cb) => {
        console.log("Creating", room, "on server side")
        socket.join(room)
        cb(`joined ${room}`)
    })


    socket.on('disconnect', function () {
        for (let username in users) {
            if (users[username].socketId === socket.id) {
                socket.broadcast.emit('someone-disconnected', username)
                delete users[username];
                return;
            }
        }
    });
})
