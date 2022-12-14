import Link from 'next/link';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import LoginElement from '../../components/LoginElement';
import PageWrapper from '../../components/PageWrapper'
import { server } from '../../config';
import LoginData from '../../scripts/loginData';
import { outTime } from '../../scripts/scripts';

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

  useEffect(() => {
    console.log(LoginData.user.runs, pid);
    const newRun = LoginData.user.runs.find((run: any) => run.id === pid) || {} as Run;
    setRun(newRun);
  }, [LoginData.user.runs, pid]);

  const deleteRun = async () => {

    if (LoginData.user.username === "default") return alert("You cannot change the default user's information.");

    LoginData.user.runs = LoginData.user.runs.filter((run: any) => run.id !== pid);
    await fetch(`${server}${props.host}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(LoginData.user)
    })
    
    router.push('/runs')
  }

  const refreshData = () => {
    router.replace(router.asPath);
  }


  return (
    <PageWrapper>
      {LoginData.isLoggedIn ?
        <>
          <h1 className="title m-12">Run Data</h1>
          <div className="flex flex-row justify-around content-center gap-4 px-4 small-screen-switch-flex-col w-full">
            <ul className="run-data p-8 w-full">
              {run.name ? <>
                <li className="list-title mx-auto">{run.name}:</li>
                <li>Date: {new Date(run.date).toLocaleString()}</li>
                <li>Distance: {run.distance / 1609.34} miles</li>
                <li>Time: {outTime(run.time / 60)}</li>
                <li>Shoes: {run.shoes}</li>
                <li>Notes: {run.notes}</li>
              </>
                : <li className="list-title mx-auto">No run data found</li>}
            </ul>
          </div>
          {run.name ?
            <div className="flex flex-row justify-center content-center width-clamp gap-8 mt-8 [&>*]:w-1/2">
              <Link href={`../edit/${pid}`}><button className="btn btn-primary w-full format py-4">Edit</button></Link>
              <button className="btn btn-primary format py-4" onClick={deleteRun}>Delete</button>
            </div>
            :
            <div className="flex flex-row justify-center content-center width-clamp gap-8 mt-8 [&>*]:w-full">
              <Link href="/runs"><button className="btn btn-primary w-full format py-4">Back</button></Link>
            </div>
          }
        </> :
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

