import { useEffect } from "react"

export default function Home(){
    useEffect(() => {
        window.location.href = "/home"
    }, [])
    
    return (
        <div>
        <h1>Loading...</h1>
        </div>
    )
}