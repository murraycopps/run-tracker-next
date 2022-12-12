import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import PageWrapper from '../../components/PageWrapper'
import TimeInput from '../../components/TimeInput';
import { server } from '../../config';
import { outTime } from '../../scripts/scripts';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import Link from 'next/link';


interface Run {
    _id: string;
    name: string;
    distance: number;
    date: Date;
    time: number;
    notes: string;
    shoes: string;
}

export default function Post(props: { allRuns: Run[] }) {
    const router = useRouter()
    const { pid } = router.query

    const [run, setRun] = useState({} as Run);

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(0);

    useEffect(() => {
        const newRun = props.allRuns.find((run: any) => run._id === pid) || {} as Run;
        setRun(newRun);
        setDate(new Date(newRun.date));
        setTime(newRun.time);
    }, [props.allRuns, pid]);


    const handleSubmit = (e: any) => {
        e.preventDefault();
        const newRun = {
            _id : run._id,
            name: e.target.name.value,
            distance: e.target.distance.value * 1609.34,
            date: date,
            time: time,
            notes: e.target.notes.value,
            shoes: e.target.shoes.value
        }
        
        fetch(`${server}/api/runs`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRun)
        })
        router.push(`/runs/${pid}`)
    }

    return (
        <PageWrapper>
            <h1 className="title m-12">Run Data</h1>
            <form onSubmit={handleSubmit} className="flex flex-col justify-between items-center w-full">
                <ul className="run-data new-run-data">
                    <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                        <label htmlFor="name" className="new-label">Name:</label>
                        <input type="text" name="name" id="name" defaultValue={run.name} className="new-input" />
                    </li>
                    <li className="flex flex-row justify-between gapx-16 items-top w-full medium-screen-switch-flex-col">
                        <label htmlFor="notes" className="new-label new-notes-label">Notes:</label>
                        <textarea name="notes" id="notes" className="new-input new-notes" defaultValue={run.notes}/>
                    </li>
                    <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                        <label htmlFor="distance" className="new-label">Distance:</label>
                        <input type="number" name="distance" id="distance" defaultValue={run.distance / 1609.34} className="new-input" />
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

                </ul>
            </form>
            <Link className='format width-clamp mt-12 p-4 text-center' href={`/runs/${pid}`}> Cancel </Link>

        </PageWrapper>
    )
}

export async function getServerSideProps(context: any) {
    let res = await fetch(server + "/api/runs", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let runs = await res.json();
    let allRuns = runs.data;
    return {
        props: { allRuns },
    };
}

