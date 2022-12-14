import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import Dropdown from "../components/Dropdown";
import LoginElement from "../components/LoginElement";
import PageWrapper from "../components/PageWrapper";
import { server } from "../config";
import LoginData from "../scripts/loginData";
import { outTime } from "../scripts/scripts";

interface Run {
    id: string,
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


export default function Runs(props: { users: user[], host: string }) {
    const [runs, setRuns] = useState([] as Run[]);
    const [constraint, setConstraint] = useState("" as string | number);
    const [constraintType, setConstraintType] = useState("name");
    const [filteredRuns, setFilteredRuns] = useState([] as Run[]);
    const [startingIndex, setStartingIndex] = useState(0);
    const [pageArray, setPageArray] = useState([] as number[]);
    const [sortType, setSortType] = useState("date");

    const isBreakpoint = useMediaQuery(768)

    const dropdownOptions = [
        { value: "name", label: "Name" },
        { value: "notes", label: "Notes" },
        { value: "shoes", label: "Shoes" },
    ]

    const sortDropdownOptions = [
        { value: "date", label: "Date" },
        { value: "distance", label: "Distance" },
        { value: "time", label: "Time" },
    ]

    useEffect(() => {
        const length = Math.ceil(filteredRuns.length / 10);
        if (length > 5) {
            const currentPage = Math.floor(startingIndex / 10);
            if (currentPage < 2) {
                setPageArray([0, 1, 2, 3, length - 1]);
            }
            else if (currentPage > length - 3) {
                setPageArray([0, length - 4, length - 3, length - 2, length - 1]);
            }
            else {
                setPageArray([0, currentPage - 1, currentPage, currentPage + 1, length - 1]);
            }
        }
        else {
            const newPageArray = [];
            for (let i = 0; i < length; i++) {
                newPageArray.push(i);
            }
            setPageArray(newPageArray);
        }
    }, [filteredRuns, startingIndex]);

    const searchBarRef = useRef<HTMLDivElement>(null);
    const recentRunsRef = useRef<HTMLUListElement>(null);

    const onScroll = () => {
        const scrollY = window.scrollY;
        const titleHeight = document.querySelector(".title")?.clientHeight;
        if (!titleHeight) return
        if (!isBreakpoint) {
            if (scrollY > titleHeight + 128) {
                searchBarRef.current?.classList.add("set-fixed");
                if (recentRunsRef.current) recentRunsRef.current.style.marginTop = `${titleHeight + 40}px`;
            }
            else {
                searchBarRef.current?.classList.remove("set-fixed");
                if (recentRunsRef.current) recentRunsRef.current.style.marginTop = "20px";
            }
        }
        else {
            if (scrollY > titleHeight + 32) {
                searchBarRef.current?.classList.add("set-fixed-short");
                if (recentRunsRef.current) recentRunsRef.current.style.marginTop = `${searchBarRef.current?.clientHeight! - 60}px`;
            }
            else {
                searchBarRef.current?.classList.remove("set-fixed-short");
                if (recentRunsRef.current) recentRunsRef.current.style.marginTop = "20px";
            }
        }
    }

    useEffect(() => {
        const sortedRuns = LoginData.user.runs.sort((a: any, b: any) => {
            if (sortType === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
            else if (sortType === "distance") return b.distance - a.distance;
            else if (sortType === "time") return b.time - a.time;
            else return 0;
        })

        sortedRuns.forEach((run: any, i: Number) => {
            run.date = new Date(run.date).toLocaleDateString();
        })

        setRuns(sortedRuns);
    }, [LoginData.user.runs, sortType, runs]);

    useEffect(() => {
        const newFilteredRuns = runs.filter((run: any, i: Number) => run[constraintType].toLowerCase().includes(constraint.toString().toLowerCase()))
        newFilteredRuns.sort((a: any, b: any) => {
            if (sortType === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
            else if (sortType === "distance") return b.distance - a.distance;
            else if (sortType === "time") return b.time - a.time;
            else return 0;
        })
        setFilteredRuns(newFilteredRuns);
    }, [constraint, constraintType, runs, sortType]);

    useEffect(() => {
        window.scrollTo(0, 0);
        searchBarRef.current?.classList.remove("set-fixed-short");
        searchBarRef.current?.classList.remove("set-fixed");
        if (recentRunsRef.current) recentRunsRef.current.style.marginTop = "20px";
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isBreakpoint, onScroll]);


    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }


    return (
        <PageWrapper>
            {LoginData.isLoggedIn ? <div className="flex flex-col justify-center items-center w-full">
                <h1 className="title m-12">Runs</h1>
                <div className="search-bar" ref={searchBarRef}>
                    {!isBreakpoint ?
                        <div className="search-input no-padding">
                            <input type="text" className="search-input-field" placeholder="Search" value={constraint} onChange={(e) => setConstraint(e.target.value)} />
                            <Dropdown items={dropdownOptions} value={constraintType} setValue={setConstraintType} className="search-dropdown-field" />
                        </div> : <>
                            <input type="text" className="search-input" placeholder="Search" value={constraint} onChange={(e) => setConstraint(e.target.value)} />
                            <Dropdown items={dropdownOptions} value={constraintType} setValue={setConstraintType} className="search-dropdown" />
                        </>
                    }
                    <div className="flex justify-center items-center gap-4 text-3xl"> Sort by: </div>
                    <Dropdown items={sortDropdownOptions} value={sortType} setValue={setSortType} className="search-input search-dropdown" />
                    {runs.length > 10 ? <div className="flex justify-center items-center mt-2 gap-4 width-clamp">
                        <button style={{ textAlign: "left" }} className={"page-btn " + ((startingIndex > 0 ? "" : "transparent"))} onClick={() => { if (startingIndex > 0) setStartingIndex(startingIndex - 10) }}>{'<'}</button>
                        {pageArray.map((page, i) => {
                            return <button className="page-btn" onClick={() => setStartingIndex(page * 10)}
                                key={i.toString()}>{page + 1}</button>
                        })}
                        <button style={{ textAlign: "right" }} className={"page-btn " + (startingIndex < filteredRuns.length - 10 ? "" : "transparent")} onClick={() => { if (startingIndex < filteredRuns.length - 10) setStartingIndex(startingIndex + 10) }}>{'>'}</button>
                    </div> : null}
                </div>
                <ul className="recent-runs w-full" ref={recentRunsRef}>
                    {filteredRuns.length ?
                        filteredRuns.map((run: any, i: Number) => {
                            if (i < startingIndex || i > startingIndex + 10) return null;
                            return (
                                <li className="run-data my-4 p-4" key={i.toString()}>
                                    <Link className="" href={`/runs/${run.id}`}>
                                        <ul>
                                            <li className="list-title">{run.name}</li>
                                            <li>Distance: {run.distance / 1609.34} miles</li>
                                            <li>Date: {run.date}</li>
                                            <li>Time: {outTime(run.time)}</li>
                                            {run.notes && constraintType === "notes" ? <li>Notes: {run.notes}</li> : null}
                                            {run.shoes && constraintType === "shoes" ? <li>Shoes: {run.shoes}</li> : null}
                                        </ul>

                                    </Link>
                                </li>
                            )
                        })
                        : <li className="run-data my-4 p-4">
                            <ul>
                                <li className="list-title">No runs found</li>
                            </ul>
                        </li>
                    }
                </ul>
            </div> :
                <LoginElement onLogin={refreshData} users={props.users} />
            }
        </PageWrapper >
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


const useMediaQuery = (width: any) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = useCallback((e: { matches: any; }) => {
        if (e.matches) {
            setTargetReached(true);
        } else {
            setTargetReached(false);
        }
    }, []);

    useEffect(() => {
        const media = window.matchMedia(`(max-width: ${width}px)`);
        media.addListener(updateTarget);

        // Check on mount (callback is not called until a change occurs)
        if (media.matches) {
            setTargetReached(true);
        }

        return () => media.removeListener(updateTarget);
    }, [updateTarget, width]);

    return targetReached;
};