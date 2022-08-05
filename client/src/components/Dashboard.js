import '../style/dashboard.css'
import '../style/options.css'
import Chat from './Chat'
import { useState, useContext } from 'react';
import { AppContext } from '../App';

function Dashboard() {
    const { user } = useContext(AppContext)
    const [friendID, setFriendID] = useState('');
    const [room, setRoom] = useState(null);
    const [modal, setModal] = useState(true);


    const leaveRoom = (event) => {
        event.preventDefault();
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

    return (
        <div className='center-dashboard'>
            <div className="dashboard flex">

                <div className="options-sidebar">
                    <h4>{user.userObject.name}</h4>
                    <h5>@{user.userObject.username}</h5>
                    {modal ? (
                        <>
                            <form onSubmit={createRoom}>
                                <label>Chat with:</label>
                                <input value={friendID} onChange={(event) => setFriendID(event.target.value)} />
                                <button type='submit'>Start Chat</button>
                            </form>

                            <hr />
                            <div className='open-rooms'>
                                <h5>Open Rooms</h5>
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