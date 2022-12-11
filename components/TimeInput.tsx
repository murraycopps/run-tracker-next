import { useEffect, useState } from "react"
import styles from '../styles/TimeInput.module.css'
export default function TimeInput({ value, onChange, className = "" }: { value: number, onChange: (value: number) => void, className?: string }) {
    const [hour, setHour] = useState(Math.floor(value / 3600))
    const [min, setMin] = useState(Math.floor(value / 60 % 60))
    const [sec, setSec] = useState(value % 60)
    useEffect(() => {
        onChange(hour * 3600 + min * 60 + sec)
    }, [hour, min, sec])

    useEffect(() => {
        setHour(Math.floor(value / 3600))
        setMin(Math.floor(value / 60 % 60))
        setSec(value % 60)
    }, [value])
    
    return (
        <div className={`${className} ${styles.timeInputField}`}>
            <input type="number" placeholder="Hour" name="hour" id="hour" className={styles.timeInput} value={hour ? hour : ""} onChange={(event) => { if (event.target.value != "") setHour(parseFloat(event.target.value)); else setHour(0) }} />
            <span className={styles.timeInputSeparator}>:</span>
            <input type="number" placeholder="Min" name="min" id="min" className={styles.timeInput} value={min ? min : ""} onChange={(event) => { if (event.target.value != "") setMin(parseFloat(event.target.value)); else setMin(0) }} />
            <span className={styles.timeInputSeparator}>:</span>
            <input type="number" placeholder="Sec" name="sec" id="sec" className={styles.timeInput} value={sec ? sec : ""} onChange={(event) => { if (event.target.value != "") setSec(parseFloat(event.target.value)); else setSec(0) }} />
        </div>
    )
}