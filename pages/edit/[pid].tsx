import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import PageWrapper from '../../components/PageWrapper'
import TimeInput from '../../components/TimeInput';
import { server } from '../../config';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import Link from 'next/link';
import LoginData from '../../scripts/loginData';
import LoginElement from '../../components/LoginElement';


interface Run {
    id: string;
    name: string;
    distance: number;
    date: Date;
    time: number;
    notes: string;
    shoes: string;
}

interface user {
    _id: string;
    username: string;
    password: string;
    runs: string[];
}

export default function Post(props: { users: user[], host: string }) {
    const router = useRouter()
    const { pid } = router.query

    const [run, setRun] = useState({} as Run);

    const [date, setDate] = useState(undefined as unknown as Date);
    const [time, setTime] = useState(0);
    const [distance, setDistance] = useState(0);


    useEffect(() => {
        const newRun = LoginData.user.runs.find((run: any) => run.id === pid) || {} as Run;
        setDistance(newRun.distance / 1609.34);
        setRun(newRun);
        setDate(new Date(newRun.date));
        setTime(newRun.time);
    }, [LoginData.user.runs, pid]);


    const handleSubmit = (e: any) => {
        e.preventDefault();
        const newRun = {
            id: run.id,
            name: e.target.name.value,
            distance: e.target.distance.value * 1609.34,
            date: date,
            time: time,
            notes: e.target.notes.value,
            shoes: e.target.shoes.value
        }
        LoginData.editUserRun(newRun);

        let res = fetch(`${server}${props.host}/api/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(LoginData.user)
        })

        router.push(`/runs/${pid}`)
    }

    const refreshData = () => {
        router.replace(router.asPath);
    }

    return (
        <PageWrapper>
            {LoginData.isLoggedIn ?
                <>
                    <h1 className="title m-12">Run Data</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col justify-between items-center w-full">
                        <ul className="run-data new-run-data">
                            {run.id ? <>
                                <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                    <label htmlFor="name" className="new-label">Name:</label>
                                    <input type="text" name="name" id="name" defaultValue={run.name} className="new-input" />
                                </li>
                                <li className="flex flex-row justify-between gapx-16 items-top w-full medium-screen-switch-flex-col">
                                    <label htmlFor="notes" className="new-label new-notes-label">Notes:</label>
                                    <textarea name="notes" id="notes" className="new-input new-notes" defaultValue={run.notes} />
                                </li>
                                <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                    <label htmlFor="distance" className="new-label">Distance:</label>
                                    <input type="number" name="distance" id="distance" value={distance} className="new-input" onChange={(e) => setDistance(parseFloat(e.target.value))} />
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
                                    <input type="text" name="shoes" id="shoes" defaultValue={run.shoes} className="new-input" />
                                </li>
                                <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                    <button type="submit" className="new-input" style={{ width: "100%" }}>Submit</button>
                                </li>
                            </> :
                                <div className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                                    <p className="new-label">Run not found</p>
                                    <Link href="/runs">Go to runs</Link>
                                </div>
                            }

                        </ul>
                    </form>
                    <Link className='format width-clamp mt-12 p-4 text-center' href={`/runs/${pid}`}> Cancel </Link>
                </> :
                <LoginElement onLogin={refreshData} users={props.users} />}
        </PageWrapper>
    )
}

export async function getServerSideProps(context: any) {
    let host = context.req.headers.host;
    let res = await fetch(`${server}${host}/api/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let allUsers = await res.json();
    let users = allUsers.data;
    return {
        props: { users, host },
    };
}

