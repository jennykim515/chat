
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

/**
 * key: user
 * value: list of rooms
 */
let rooms = {}

function addToRoom(user, room) {
    if (user in rooms) {
        rooms[user].push(room)
    }
    else {
        rooms[user] = [room]
    }
}

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

            console.log("new user update", new_user)
            socket.broadcast.emit('new-user-update', new_user)
            status(true)
        };
    })

    socket.on('ping', (user) => {
        if (user in users) {
            console.log('friend', user, 'is online')
            socket.emit('friend-info', users[user])
        }
        else {
            console.log(user, 'is offline')
        }
    })

    socket.on('send-message', (message, room) => {
        socket.to(room).emit('receive-message', message)
    })

    socket.on('join-room', (room, cb) => {
        // creating room
        socket.join(room)

        const userList = room.split('-')
        const user1 = userList[0]
        const user2 = userList[1]

        addToRoom(user1, room)
        addToRoom(user2, room)

        cb(`joined ${room}`)
    })

    socket.on('get-rooms', (username, cb) => {
        // cb(JSON.stringify(rooms[username]))
        cb(JSON.stringify(rooms[username]))
    })

    socket.on('disconnect', function () {
        for (let username in users) {
            if (users[username].socketId === socket.id) {
                socket.broadcast.emit('someone-disconnected', username)
                delete users[username];
                delete rooms[username]
                return;
            }
        }
    });
})
