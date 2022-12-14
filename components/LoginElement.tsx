import { useState } from "react";
import LoginData from "../scripts/loginData";
import styles from '../styles/Login.module.css'

export default function LoginElement({ onLogin = () => { }, users }: { onLogin: Function, users: any }) {
    const [newUser, setNewUser] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const name = e.target.name.value
        const username = e.target.username.value
        const password = e.target.password.value

        if (newUser) {
            const user = users.find((user: any) => user.username === username)
            if (user) {
                alert('Username already exists')
            }
            else {
                LoginData.login(username, password, { name, username, password, runs: [] })
                fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        username: username,
                        password: password,
                        runs: []
                    })
                })
                onLogin()
            }
        }
        else {
            const user = users.find((user: any) => user.username === username && user.password === password)
            if (user) {
                LoginData.login(username, password, user)
                onLogin()
            }
            else {
                alert('Incorrect username or password')
            }
        }
    }


    return (
        <>
            <form className="flex flex-col justify-center items-center w-full format width-clamp" onSubmit={handleSubmit}>
                <h1 className="title m-12">{newUser ? 'New User' : 'Login'}</h1>
                {newUser && <input type="text" placeholder="Name" className={styles.input} autoComplete="on" name="name" id="name" />}
                <input type="text" placeholder="Username" className={styles.input} autoComplete="on" name="username" id="username" />
                <input type="password" placeholder="Password" className={styles.input} autoComplete="on" name="password" id="password" />
                <button type="submit" className='mt-4 py-4'>{newUser ? 'Add New User' : 'Login'}</button>
            </form>
            <button className={'width-clamp format mt-8 py-4'} onClick={() => setNewUser(!newUser)}>{newUser ? 'Login' : 'New User'}</button>

            {!newUser && <div className="flex flex-col justify-center items-center w-full format width-clamp mt-8 py-4">
                <h2 className="title m-4">Default User</h2>
                <p>Username: default</p>
                <p>Password: password</p>
            </div>

            }
        </>
    )
}

