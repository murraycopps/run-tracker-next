import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Dropdown from "../components/Dropdown";
import PageWrapper from "../components/PageWrapper";
import { outTime } from "../scripts/scripts";

interface Run {
    name: string;
    distance: number;
    date: Date;
    time: number;
    notes: string;
    shoes: string;
}


export default function Runs(props: { allRuns: Run[] }) {
    const [runs, setRuns] = useState(props.allRuns);
    const [constraint, setConstraint] = useState("" as string | number);
    const [constraintType, setConstraintType] = useState("name");
    const [filteredRuns, setFilteredRuns] = useState(props.allRuns.filter((run: any, i: Number) => run[constraintType].toLowerCase().includes(constraint.toString().toLowerCase())));
    const [startingIndex, setStartingIndex] = useState(0);
    const [pageArray, setPageArray] = useState([] as number[]);

    const dropdownOptions = [
        { value: "name", label: "Name" },
        { value: "notes", label: "Notes" },
        { value: "shoes", label: "Shoes" },
    ]



    useEffect(() => {
        pageArray.length = Math.ceil(filteredRuns.length / 10);
        pageArray.fill(0);
    }, [filteredRuns]);

    const searchBarRef = useRef<HTMLDivElement>(null);
    const recentRunsRef = useRef<HTMLUListElement>(null);

    const onScroll = () => {
        const scrollY = window.scrollY;
        const titleHeight = document.querySelector(".title")?.clientHeight;
        if (!titleHeight) return
        if (scrollY > titleHeight + 120) {
            searchBarRef.current?.classList.add("set-fixed");
            if (recentRunsRef.current) recentRunsRef.current.style.marginTop = "152px";
        }
        else {
            searchBarRef.current?.classList.remove("set-fixed");
            if (recentRunsRef.current) recentRunsRef.current.style.marginTop = "20px";
        }
    }

    useEffect(() => {
        const sortedRuns = props.allRuns.sort((a: any, b: any) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        setRuns(sortedRuns);
    }, [props.allRuns]);

    useEffect(() => {
        const newFilteredRuns = runs.filter((run: any, i: Number) => run[constraintType].toLowerCase().includes(constraint.toString().toLowerCase()) && i < 10)
        setFilteredRuns(newFilteredRuns);
    }, [constraint, constraintType, runs]);

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);



    return (
        <PageWrapper>
            {runs ? <div className="flex flex-col justify-center items-center w-full">
                <h1 className="title m-12">Runs</h1>
                <div className="search-bar" ref={searchBarRef}>
                    <input type="text" className="search-input" placeholder="Search" value={constraint} onChange={(e) => setConstraint(e.target.value)} />
                    <Dropdown items={dropdownOptions} value={constraintType} setValue={setConstraintType} className="search-input search-dropdown" />
                    {runs.length > 10 ? <div className="flex justify-center items-center gap-1">
                        {startingIndex > 0 ? <button className="btn" onClick={() => setStartingIndex(startingIndex - 10)}>Previous</button> : null}
                        {pageArray.map((page, i) => {
                            return <button className="btn" onClick={() => setStartingIndex(i * 10)}
                                key={i.toString()}>{i + 1}</button>
                        })}
                        {startingIndex < runs.length - 10 ? <button className="btn" onClick={() => setStartingIndex(startingIndex + 10)}>Next</button> : null}
                    </div> : null}
                </div>
                <ul className="recent-runs w-full" ref={recentRunsRef}>
                    {filteredRuns.map((run: any, i: Number) => {
                        if (i < startingIndex || i > startingIndex + 10) return null;
                        return (
                            <li className="run-data my-4 p-4" key={i.toString()}>
                                <Link className="" href={`/runs/${run._id}`}>
                                    <ul>
                                        <li className="list-title">{run.name}</li>
                                        <li>Distance: {run.distance / 1609.34} miles</li>
                                        <li>Date: {new Date(run.date).toLocaleString()}</li>
                                        <li>Time: {outTime(run.time)}</li>
                                        {run.notes && constraintType === "notes" ? <li>Notes: {run.notes}</li> : null}
                                        {run.shoes && constraintType === "shoes" ? <li>Shoes: {run.shoes}</li> : null}
                                    </ul>

                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div> : <h1>Loading...</h1>
            }
        </PageWrapper >
    )
}

export async function getServerSideProps(context: any) {
    let res = await fetch("http://localhost:3000/api/runs", {
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
