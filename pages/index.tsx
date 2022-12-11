import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { outTime } from "../scripts/scripts";
import PageWrapper from "../components/PageWrapper";


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
  const [weekRuns, setWeekRuns] = useState([] as Run[]);



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
    if (name === "") return setRuns(props.allRuns)
    const filteredRuns = props.allRuns.filter((run: any) => run.name.toLowerCase().includes(name.toLowerCase()))
    setRuns(filteredRuns);
  }, [name]);

  
  return (
    <PageWrapper>
      <h1 className="title">Run Data</h1>
      {/* <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> */}
      <div className="flex flex-row justify-around content-center flex-wrap gap-4 px-4 small-screen-switch-flex-col">
        <ul className="run-data p-8">
          <li className="list-title mx-auto">Total:</li>
          <li>Runs: {runs.length}</li>
          <li>Total Milage: {runs.reduce((acc: any, run: any) => acc += run.distance, 0) / 1609.34}</li>
          <li>Total Time: {outTime(runs.reduce((acc: any, run: any) => acc += run.time, 0))}</li>
          <li>Pace: {outTime(runs.reduce((acc: any, run: any) => acc += run.time, 0) / runs.reduce((acc: any, run: any) => acc += run.distance, 0) * 1609.34)}</li>
          <li>Longest Run: {Math.max(...runs.map(a => a.distance)) / 1609.34}</li>
        </ul>
        <ul className="run-data p-8">
          <li className="list-title">Weekly:</li>
          <li>Weekly Runs: {weekRuns.length}</li>
          <li>Weekly Milage: {weekRuns.reduce((acc: any, run: any) => acc += run.distance, 0) / 1609.34} miles</li>
          <li>Weekly Time: {outTime(weekRuns.reduce((acc: any, run: any) => acc += run.time, 0) / 60)}</li>
          <li>Weekly Pace: {outTime(weekRuns.reduce((acc: any, run: any) => acc += run.time, 0) / weekRuns.reduce((acc: any, run: any) => acc += run.distance, 0) * 1609.34)}</li>
        </ul>
      </div>

    </PageWrapper>
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
