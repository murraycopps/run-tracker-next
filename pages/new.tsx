import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import TimeInput from "../components/TimeInput";

export default function New() {
    const [date, setDate] = useState(new Date());
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


        let res = await fetch("http://localhost:3000/api/runs", {
            method: "POST",
            body: JSON.stringify({
                name,
                distance,
                time,
                date,
                notes,
                shoes,
            }),
        });
    }

    return (
        <PageWrapper>
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
                                <DatePicker className="w-full h-12" selected={date} onChange={(date : Date) => setDate(date)} />
                            </div>
                        </li>
                        <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                            <label htmlFor="shoes" className="new-label">Shoes:</label>
                            <input type="text" name="shoes" id="shoes" className="new-input" />
                        </li>
                        <li className="flex flex-row justify-between gapx-16 items-center w-full medium-screen-switch-flex-col">
                            <button type="submit" className="new-input w-full">Submit</button>
                        </li>
                        
                    </ul>
                </form>
            </div>
        </PageWrapper>
    )
}