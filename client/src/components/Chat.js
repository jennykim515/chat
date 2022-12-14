import '../style/chat.css'
import { io } from 'socket.io-client'
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../App';

function Chat(props) {
    const room = props.room;
    const [message, setMessage] = useState({
        message: '',
        sent: false
    });
    const [messages, setMessages] = useState([]);
    const { socket } = useContext(AppContext);
    const [friendInfo, setFriendInfo] = useState({});


    useEffect(() => {
        socket.emit('join-room', room, message => {
            socket.emit('ping', props.friend);
        })

    }, [])

    useEffect(() => {
        console.log("connected at least")
        socket.on('receive-message', message => {
            setMessages(oldMessages => [...oldMessages, {
                message: message,
                sent: false
            }])
        })

        socket.on('new-user-update', new_user => {
            // new user was added to database, check if it's friend's
            if (new_user.username === props.friend) {
                setFriendInfo(new_user)
            }
        })

        socket.on('friend-info', response => {
            console.log("Received friend info", response)
            setFriendInfo(response);
        })

        socket.on('someone-disconnected', disconnected_user => {
            if (disconnected_user === props.friend) {
                setFriendInfo({});
            }
        })
    }, [socket])


    const changeInput = (event) => {
        setMessage({
            message: event.target.value,
            sent: true
        });
    }

    const sendMessage = (event) => {
        event.preventDefault();
        setMessage({
            message: '',
            sent: true
        })
        socket.emit("send-message", message, room)
        setMessages(oldMessages => [...oldMessages, {
            message: message,
            sent: true
        }])
    }

    return (
        <div>
            <div className='person-details-bar'>
                {Object.entries(friendInfo).length > 0 ?
                    <>
                        <h1>{friendInfo.name}</h1>
                        <h5>@{props.friend}</h5>
                        {/* <h5>{friendInfo.language}</h5> */}
                    </>
                    :
                    (<>
                        <h5>User {props.friend} is currently offline and won't be able to see your messages</h5>
                    </>)
                }

            </div>

            <div className='messages-container'>
                <ul>
                    {messages.map((message, i) => {
                        if (message.sent) {
                            return <li key={i} className='sent-message'><p>{message.message.message}</p></li>
                        }
                        else {
                            return <li key={i} className='received-message'><p>{message.message.message}</p></li>
                        }
                    })}
                </ul>
            </div>
            <form onSubmit={sendMessage} className='flex'>
                <input placeholder="message" value={message.message} onChange={changeInput} type='text' className='new-message' />
                <button>Send</button>
            </form>
        </div>
    )
}

export default Chat;
