import '../style/signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';

const Signup = () => {
    const [languages, setLanguages] = useState([]);
    const [chosenLanguage, setChosenLanguage] = useState('Choose Language')
    const { setUser, socket } = useContext(AppContext);

    useEffect(() => {
        const apikey = 'AIzaSyDW-JB_QAQcuf5DGf6YErsWMCDIEkbE16Y'
        const target = 'en'
        fetch(`https://translation.googleapis.com/language/translate/v2/languages?key=${apikey}&target=${target}`)
            .then((response) => response.json())
            .then((data) => setLanguages(data.data.languages))
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        const userObject = {
            username: event.target.username.value,
            name: event.target.name.value,
            language: chosenLanguage,
        }

        socket.emit('register-user', userObject, function (response) {
            if (response) {
                setUser({
                    userObject
                })

            }
        })

    }
    return (
        <div className="sign-up">
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h3>Sign Up</h3>
                <div className='input-container'>
                    <label className='label'>Name </label>
                    <input placeholder='Johnny Chen' className='input' name='name' type='text' />
                </div>

                <br />

                <div className='input-container'>
                    <label className='label'>Username</label>
                    <input placeholder='johnnychen' className='input' name='username' type='text' />
                    <br />
                </div>

                <DropdownButton id="dropdown-size-small" title={`${chosenLanguage}`}>
                    {(languages).map(l => {
                        return <Dropdown.Item
                            key={l.language}
                            onClick={() => setChosenLanguage(l.name)} >{l.name}</Dropdown.Item>
                    })}
                </DropdownButton>



                <div className='btn-center'>
                    <button type='submit' className='submitBtn'>Submit</button>
                </div>


            </form>
        </div>
    )
}
export default Signup;