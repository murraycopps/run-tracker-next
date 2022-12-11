import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import PageWrapper from '../../components/PageWrapper'
import { outTime } from '../../scripts/scripts';

interface Run {
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

  useEffect(() => {
    const newRun = props.allRuns.find((run: any) => run._id === pid) || {} as Run;
    setRun(newRun);
  }, [props.allRuns]);

  return (
    <PageWrapper>
      <h1 className="title m-12">Run Data</h1>
      <div className="flex flex-row justify-around content-center  gap-4 px-4 small-screen-switch-flex-col w-full">
        <ul className="run-data p-8 w-full">
          <li className="list-title mx-auto">{run.name}:</li>
          <li>Date: {new Date(run.date).toLocaleString()}</li>
          <li>Distance: {run.distance / 1609.34} miles</li>
          <li>Time: {outTime(run.time / 60)}</li>
          <li>Shoes: {run.shoes}</li>
          <li>Notes: {run.notes}</li>
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

