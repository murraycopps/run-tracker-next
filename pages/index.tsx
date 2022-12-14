import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { outTime } from "../scripts/scripts";
import PageWrapper from "../components/PageWrapper";
import { server } from "../config";
import LoginData from "../scripts/loginData";
import LoginElement from "../components/LoginElement";


interface Run {
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


export default function Home(props: { users: user[], host: string }) {
  const [runs, setRuns] = useState([] as Run[]);
  const [name, setName] = useState("");
  const [filteredRuns, setFilteredRuns] = useState([] as Run[]);
  const [weekRuns, setWeekRuns] = useState([] as Run[]);


  useEffect(() => {
    const sortedRuns = LoginData.user.runs.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })

    sortedRuns.forEach((run: any) => {
      run.date = new Date(run.date).toLocaleString();
    })

    const week = LoginData.user.runs.filter((run: any) => {
      const date = new Date(run.date);
      const today = new Date();
      const diff = today.getTime() - date.getTime();
      const days = diff / (1000 * 3600 * 24);
      return days < 7;
    })
    setWeekRuns(week);
    setRuns(sortedRuns);

  }, [LoginData.user.runs]);



  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }


  useEffect(() => {
    let i = 0
    const newFilteredRuns = runs.filter((run: any) => run.name.toLowerCase().includes(name.toLowerCase()) && i++ < 10)
    setFilteredRuns(newFilteredRuns);
  }, [name, runs]);


  return (
    <PageWrapper>
      {LoginData.isLoggedIn ? <>
        <h1 className="title m-12">Run Data</h1>
        <div className="flex flex-row justify-around content-center  gap-4 px-4 small-screen-switch-flex-col w-full">
          <ul className="run-data p-8 my-4">
            <li className="list-title mx-auto">Total:</li>
            {runs.length === 0 ? <li>No Runs</li> : <>
              <li>Runs: {runs.length}</li>
              <li>Total Milage: {runs.reduce((acc: any, run: any) => acc += run.distance, 0) / 1609.34} miles</li>
              <li>Total Time: {outTime(runs.reduce((acc: any, run: any) => acc += run.time, 0))}</li>
              <li>Pace: {outTime(runs.reduce((acc: any, run: any) => acc += run.time, 0) / runs.reduce((acc: any, run: any) => acc += run.distance, 0) * 1609.34)} min/mi</li>
              <li>Longest Run: {Math.max(...runs.map(a => a.distance)) / 1609.34} miles</li>
            </>}
          </ul>
          <ul className="run-data p-8 my-4">
            <li className="list-title">Weekly:</li>
            {weekRuns.length === 0 ? <li>No Runs This Week</li> : <>
              <li>Weekly Runs: {weekRuns.length}</li>
              <li>Weekly Milage: {weekRuns.reduce((acc: any, run: any) => acc += run.distance, 0) / 1609.34} miles</li>
              <li>Weekly Time: {outTime(weekRuns.reduce((acc: any, run: any) => acc += run.time, 0))}</li>
              <li>Weekly Pace: {outTime(weekRuns.reduce((acc: any, run: any) => acc += run.time, 0) / weekRuns.reduce((acc: any, run: any) => acc += run.distance, 0) * 1609.34)} min/mi</li>
              <li>Longest Run: {Math.max(...weekRuns.map(a => a.distance)) / 1609.34} miles</li>
            </>}
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
                        <li>Date: {run.date}</li>
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
      </>
        :
        <LoginElement onLogin={refreshData} users={props.users} />
      }

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
