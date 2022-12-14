import { useRouter } from "next/router";
import { useState } from "react";
import LoginElement from "../components/LoginElement";
import PageWrapper from "../components/PageWrapper";
import { server } from "../config";
import LoginData from "../scripts/loginData";

export default function Profile(props: { host: string, users: any[] }) {
    const [change, setChange] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (LoginData.user.username === "default") return alert("You cannot change the default user's information.");
       
        if (change === "name") {
            LoginData.changeName(e.target[0].value);
        }
        if (change === "username") {
            LoginData.changeUsername(e.target[0].value);
        }
        if (change === "password") {
            LoginData.changePassword(e.target[0].value);
        }
        setChange("");

        fetch(`${server}${props.host}/api/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(LoginData.user)
        })

    }

    const deleteAccount = () => {
        if(!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
        LoginData.logout();
        fetch(`${server}${props.host}/api/users`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(LoginData.user)
        })
    }


    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    return (
        <PageWrapper>
            {LoginData.isLoggedIn ?
                <>
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <h1 className="title">Profile</h1>

                        {!change && <>
                            <button className="button format width-clamp mt-8 py-4" onClick={() => setChange("name")}>Change Name</button>
                            <button className="button format width-clamp mt-8 py-4" onClick={() => setChange("username")}>Change Username</button>
                            <button className="button format width-clamp mt-8 py-4" onClick={() => setChange("password")}>Change Password</button>
                            <button className="button format width-clamp mt-20 py-4" onClick={() => { LoginData.logout(); refreshData() }}>Logout</button>
                            <button className="button format width-clamp mt-16 py-4" onClick={deleteAccount}>Delete Account</button>
                        </>}

                        {change && <form className="flex flex-col justify-center items-center w-full format width-clamp mt-16 sm:mt-0 px-8 pt-8" onSubmit={handleSubmit}>
                            {change === "name" && <>
                                <label htmlFor="name" className="text-4xl">Name</label>
                                <input type="text" placeholder="Name" className="input w-full mt-8" />
                            </>}
                            {change === "username" && <>
                                <label htmlFor="username" className="text-4xl">Username</label>
                                <input type="text" placeholder="Username" className="input w-full mt-8" />
                            </>}
                            {change === "password" && <>
                                <label htmlFor="password" className="text-4xl">Password</label>
                                <input type="password" placeholder="Password" className="input w-full mt-8" />
                            </>}
                            <button type="submit" className='mt-8 py-4'>Change</button>
                        </form>}

                        {change && <button className="button format width-clamp mt-8 py-4" onClick={() => setChange("")}>Cancel</button>}

                    </div>
                </>
                :
                <LoginElement onLogin={refreshData} users={props.users} />
            }
        </PageWrapper>
    )
}

export async function getServerSideProps(context: any) {
    let host = context.req.headers.host;
    let userRes = await fetch(`${server}${host}/api/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let allUsers = await userRes.json();
    let users = allUsers.data;
    return {
        props: {
            users,
            host: context.req.headers.host,
        }
    }
}