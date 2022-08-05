import '../style/dashboard.css'
import '../style/options.css'
import Chat from './Chat'
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';

function Dashboard() {
    const { user, socket } = useContext(AppContext)
    const [friendID, setFriendID] = useState('');
    const [room, setRoom] = useState(null);
    const [modal, setModal] = useState(true);
    const [availableChatrooms, setAvailableChatrooms] = useState([]);

    useEffect(() => {
        // get all avail rooms
        socket.emit('get-rooms', user.userObject.username, response => {
            console.log('get rooms result', JSON.parse(response))
            setAvailableChatrooms(JSON.parse(response))
        })
    }, [])

    const leaveRoom = (event) => {
        event.preventDefault();
        console.log("some left your room")


        setModal(true);
        setRoom(null)
    }

    const createRoom = (event) => {
        event.preventDefault();
        if (friendID.trim() != '') {
            const namedRoom = user.userObject.username > friendID ? `${friendID}-${user.userObject.username}` : `${user.userObject.username}-${friendID}`
            setRoom(namedRoom)
            setModal(false)
        }
    }

    const joinRoom = (event) => {
        event.preventDefault();
        console.log(event.target.innerHTML)
        const join_room = event.target.innerHTML
        setRoom(join_room)
        setModal(false)

        const members = join_room.split("-")
        const friend = members[0] === user.userObject.username ? members[1] : members[0]
        console.log("setting friend ID", friend)
        setFriendID(friend)
    }

    // then listen for available rooms
    socket.on('listen-rooms', new_room => {
        setAvailableChatrooms((prev) => [...prev, new_room])
    })

    return (
        <div className='center-dashboard'>
            <div className="dashboard flex">

                <div className="options-sidebar">
                    <h4>{user.userObject.name}</h4>
                    <h5>@{user.userObject.username}</h5>
                    {modal ? (
                        <>
                            <hr />
                            <label>Create a Room</label>
                            <div className='open-rooms'>
                                <form className='chat-align' onSubmit={createRoom}>
                                    {/* <p>Chat with:</p> */}
                                    <input value={friendID} onChange={(event) => setFriendID(event.target.value)} />
                                    <button className='room-submit' type='submit'>Start Chat</button>
                                </form>
                                <hr></hr>
                                <h5>Open Rooms</h5>
                                <ul>
                                    {availableChatrooms && availableChatrooms.map(chatroom => {
                                        return <li key={chatroom} className='open-room' onClick={joinRoom}>{chatroom}</li>
                                    })
                                    }
                                </ul>
                            </div>
                        </>
                    ) :
                        (<form onSubmit={leaveRoom}>
                            <button type='submit'>Leave Room</button>
                        </form>)
                    }
                </div>
                <div className="dashboard-body">
                    {room ?
                        <Chat key={room} room={room} friend={friendID} />
                        :
                        <h1>Join a room to chat</h1>
                    }

                </div>
            </div>
        </div>
    )
}
export default Dashboard;