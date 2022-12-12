import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { outTime } from "../scripts/scripts";
import PageWrapper from "../components/PageWrapper";
import {server} from "../config";


interface Run {
  name: string;
  distance: number;
  date: Date;
  time: number;
  notes: string;
  shoes: string;
}


export default function Home(props: { allRuns: Run[] }) {
  const [runs, setRuns] = useState(props.allRuns);
  const [name, setName] = useState("");
  const [filteredRuns, setFilteredRuns] = useState(props.allRuns.filter((run: any, i: Number) => run.name.toLowerCase().includes(name.toLowerCase()) && i < 10));
  const [weekRuns, setWeekRuns] = useState([] as Run[]);


  useEffect(() => {
    const sortedRuns = props.allRuns.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    setRuns(sortedRuns);
  }, [props.allRuns]);



  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }


  useEffect(() => {
    setRuns(props.allRuns);
    const week = props.allRuns.filter((run: any) => {
      const date = new Date(run.date);
      const today = new Date();
      const diff = today.getTime() - date.getTime();
      const days = diff / (1000 * 3600 * 24);
      return days < 7;
    })
    setWeekRuns(week);
  }, [props.allRuns]);



  useEffect(() => {
    let i = 0
    const newFilteredRuns = runs.filter((run: any) => run.name.toLowerCase().includes(name.toLowerCase()) && i++ < 10)
    setFilteredRuns(newFilteredRuns);
  }, [name, runs]);


  return (
    <PageWrapper>
      <h1 className="title m-12">Run Data</h1>
      <div className="flex flex-row justify-around content-center  gap-4 px-4 small-screen-switch-flex-col w-full">
        <ul className="run-data p-8 my-4">
          <li className="list-title mx-auto">Total:</li>
          <li>Runs: {runs.length}</li>
          <li>Total Milage: {runs.reduce((acc: any, run: any) => acc += run.distance, 0) / 1609.34} miles</li>
          <li>Total Time: {outTime(runs.reduce((acc: any, run: any) => acc += run.time, 0))}</li>
          <li>Pace: {outTime(runs.reduce((acc: any, run: any) => acc += run.time, 0) / runs.reduce((acc: any, run: any) => acc += run.distance, 0) * 1609.34)} min/mi</li>
          <li>Longest Run: {Math.max(...runs.map(a => a.distance)) / 1609.34} miles</li>
        </ul>
        <ul className="run-data p-8 my-4">
          <li className="list-title">Weekly:</li>
          <li>Weekly Runs: {weekRuns.length}</li>
          <li>Weekly Milage: {weekRuns.reduce((acc: any, run: any) => acc += run.distance, 0) / 1609.34} miles</li>
          <li>Weekly Time: {outTime(weekRuns.reduce((acc: any, run: any) => acc += run.time, 0) / 60)}</li>
          <li>Weekly Pace: {outTime(weekRuns.reduce((acc: any, run: any) => acc += run.time, 0) / weekRuns.reduce((acc: any, run: any) => acc += run.distance, 0) * 1609.34)} min/mi</li>
        </ul>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <h2 className="title m-12 mt-24">Recent Runs</h2>
        <div className="flex flex-col justify-center items-center w-full">
          <input type="text" className="search-input" placeholder="Search" value={name} onChange={(e) => setName(e.target.value)} />
          <ul className="recent-runs w-full">
            {filteredRuns.map((run: any, i: Number) => {
              return (
                <li className="run-data my-4 p-4" key={i.toString()}>
                  <Link className="" href={`/runs/${run._id}`}>
                    <ul>
                      <li className="list-title">{run.name}</li>
                      <li>Distance: {run.distance / 1609.34} miles</li>
                      <li>Date: {new Date(run.date).toLocaleString()}</li>
                      <li>Time: {outTime(run.time)}</li>
                    </ul>
                  </Link>
                </li>
              )
            })}
            {filteredRuns.length === 0 && <li className="run-data my-4 p-4">No Runs Found</li>}
            {runs.length > 10 &&
              <li className="run-data my-4 p-4">
                <Link href="/runs">
                  <button className="w-full">See More</button>
                </Link>
              </li>}
          </ul>
        </div>
      </div>

    </PageWrapper>
  )
}

export async function getServerSideProps(context: any) {
  let res = await fetch(process.env.VERCEL_URL+ "/api/runs", {
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
