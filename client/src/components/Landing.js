import '../style/signup.css';
import { useContext } from 'react';
import { AppContext } from '../App';

const Signup = () => {
    const { setUser } = useContext(AppContext);
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("adding user", event.target.username.value, 'to database')
        console.log("you are now logged in")
        setUser(event.target.username.value)
    }
    return (
        <div className="sign-up">
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h3>Sign Up</h3>
                <label>Name </label>
                <input placeholder='Johnny Chen' name='name' type='text' />
                <br />
                <label>Username</label>
                <input placeholder='johnnychen' name='username' type='text' />
                <br />
                <label>Password</label>
                <input type='password' />
                <br />
                <label>Confirm Password</label>
                <input type='password' />
                <br />
                <button type='submit'>Submit</button>

            </form>
        </div>
    )
}
export default Signup;