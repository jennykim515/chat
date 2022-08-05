import '../style/signup.css';

const Login = () => {
    const handleSubmit = (event) => {
        event.preventDefault();

        // props.setUser(event.target.username.value)
    }
    return (
        <div className="sign-up">
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h3>Login</h3>

                <label>Username</label>
                <input placeholder='johnnychen' name='username' type='text' />
                <br />
                <label>Password</label>
                <input type='password' />
                <br />

                <button type='submit'>Submit</button>

            </form>
        </div>
    )
}
export default Login;