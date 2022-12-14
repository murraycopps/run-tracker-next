import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import TimeInput from "../components/TimeInput";
import { server } from "../config";
import { useRouter } from "next/router";
import LoginData from "../scripts/loginData";
import LoginElement from "../components/LoginElement";

interface user {
    _id: string;
    username: string;
    password: string;
    runs: string[];
}

export default function New(props: { users: user[], host: string }) {
    const [date, setDate] = useState(undefined as unknown as Date);
    const [time, setTime] = useState(0);


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const name = e.target.name.value
        const distance = e.target.distance.value * 1609.34;
        const notes = e.target.notes.value
        const shoes = e.target.shoes.value

        console.log("Submitted", name, distance, time, date, notes, shoes);

        if (!name || !distance || !time || !date || !notes) return alert("Please fill out all fields")
        if (distance < 0) return alert("Distance must be greater than 0")
        if (time < 0) return alert("Time must be greater than 0")
        if (new Date(date).getTime() > new Date().getTime()) return alert("Date cannot be in the future")

        e.target.name.value = "";
        e.target.distance.value = "";
        setTime(0);
        setDate(new Date());
        e.target.notes.value = "";
        e.target.shoes.value = "";
        LoginData.addUserRun({ name, distance, time, date, notes, shoes });


        let res = await fetch(`${server}${props.host}/api/users`, {
            method: "PUT",
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
                <div className="flex flex-col justify-center items-center w-full">
                    <h1 className="title m-12">New Run</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col justify-between items-center w-full">
                        <ul className="run-data new-run-data">
                            <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                <label htmlFor="name" className="new-label">Name:</label>
                                <input type="text" name="name" id="name" className="new-input" />
                            </li>
                            <li className="flex flex-row justify-between gapx-16 items-top w-full medium-screen-switch-flex-col">
                                <label htmlFor="notes" className="new-label new-notes-label">Notes:</label>
                                <textarea name="notes" id="notes" className="new-input new-notes" />
                            </li>
                            <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                <label htmlFor="distance" className="new-label">Distance:</label>
                                <input type="number" name="distance" id="distance" className="new-input" />
                            </li>
                            <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                <label htmlFor="time" className="new-label">Time:</label>
                                <TimeInput className="new-input" value={time} onChange={setTime} />
                            </li>
                            <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                <label htmlFor="date" className="new-label">Date:</label>
                                <div className="new-input no-padding">
                                    <DatePicker className="w-full h-12" selected={date} onChange={(date: Date) => setDate(date)} />
                                </div>
                            </li>
                            <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                <label htmlFor="shoes" className="new-label">Shoes:</label>
                                <input type="text" name="shoes" id="shoes" className="new-input" />
                            </li>
                            <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                <button type="submit" className="new-input" style={{ width: "100%" }}>Submit</button>
                            </li>

                        </ul>
                    </form>
                </div>
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