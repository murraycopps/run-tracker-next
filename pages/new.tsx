import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";

export default function New() {
    const [name, setName] = useState("");
    const [distance, setDistance] = useState(0);
    const [time, setTime] = useState(0);
    const [pace, setPace] = useState(0);
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [shoes, setShoes] = useState("");

    useEffect(() => {
        if(distance === 0 && time === 0) return
        setTime(distance * pace);
    }, [pace]);

    useEffect(() => {
        if(time === 0 && distance === 0) return
        setPace(time / distance);
    }, [time, distance]);

    let submitForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        let res = await fetch("http://localhost:3000/api/runs", {
            method: "POST",
            body: JSON.stringify({
                name,
                distance,
                time,
                pace,
                date,
                notes,
                shoes,
            }),
        });
        res = await res.json();
        setName("");
        setDistance(0);
        setTime(0);
        setPace(0);
        setDate("");
        setNotes("");
        setShoes("");
    };


    return (
        <PageWrapper>
            <h1>New Run</h1>
            <form onSubmit={submitForm}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="distance">Distance</label>
                <input type="number" id="distance" value={distance} onChange={(e) => setDistance(parseFloat(e.target.value))} />
                <label htmlFor="time">Time</label>
                <input type="number" id="time" value={time} onChange={(e) => setTime(parseFloat(e.target.value))} />
                <label htmlFor="pace">Pace</label>
                <input type="number" id="pace" value={pace} onChange={(e) => setPace(parseFloat(e.target.value))} />
                <label htmlFor="date">Date</label>
                <input type="text" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <label htmlFor="notes">Notes</label>
                <input type="text" id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                <label htmlFor="shoes">Shoes</label>
                <input type="text" id="shoes" value={shoes} onChange={(e) => setShoes(e.target.value)} />
                <button type="submit">Submit</button>
            </form>

        </PageWrapper>
    )
}