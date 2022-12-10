import Link from "next/link";
import { useEffect, useState } from "react";


export default function Home(props: any) {
  const [runs, setRuns] = useState(props.allRuns.data);
  const [name, setName] = useState("");

  useEffect(() => {
    if(name === "") return setRuns(props.allRuns.data)
    const filteredRuns = props.allRuns.data.filter((run: any) =>  run.name.toLowerCase().includes(name.toLowerCase()))
    setRuns(filteredRuns);
  }, [name]);

  return (
    <div>
      <Link href="/new"> New Run </Link>
      <h1>Posts</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <ul>
        {runs.map((run: any) => (
          <li key={run._id}>
            <div>{run.name}</div>
            <div>{run.distance}</div>
            <div>{run.time}</div>
            <div>{run.pace}</div>
            <div>{run.date}</div>
            <div>{run.notes}</div>
            <div>{run.shoes}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  let res = await fetch("http://localhost:3000/api/runs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let allRuns = await res.json();

  return {
    props: { allRuns },
  };
}
