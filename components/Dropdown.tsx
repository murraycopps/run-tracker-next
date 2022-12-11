import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Dropdown.module.css'

interface types {
    items: { label?: string, value: any }[],
    className?: string,
    placeholder?: string,
    index?: number,
    value?: any,
    setIndex?: (index: number) => void,
    setValue?: (value: any) => void
}

export default function Dropdown({ items, className = '', placeholder = '', index = -1, value, setIndex = () => { }, setValue = () => { } }: types) {
    if (index === -1 && value !== undefined) {
        setIndex(items.findIndex(item => item.value === value))
    }
    items.forEach((item, i) => {
        if (item.label === undefined) {
            items[i].label = item.value
        }
        else {
            items[i].label = item.label
        }
    })

    const [thisIndex, setThisIndex] = useState(index)
    const [open, setOpen] = useState(false)

    const ref = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    const contentRefs = useRef<HTMLDivElement[]>([])

    useEffect(() => {
        const radius = getComputedStyle(ref.current!).borderRadius
        const border = getComputedStyle(ref.current!).border
        const borderWidth = getComputedStyle(ref.current!).borderWidth

        contentWrapperRef.current!.style.borderRadius = `0 0 ${radius} ${radius}`

        contentRefs.current.length = items.length
        contentRefs.current.forEach((contentRef, i) => {
            contentRef.style.borderLeft = border
            contentRef.style.borderRight = border
            contentRef.style.width = `calc(100% + ${borderWidth} * 2)`
            contentRef.style.left = `-${borderWidth}`
            if (i === items.length - 1) {
                contentRef.style.borderBottom = border
            }
        })

    }, [ref, contentWrapperRef, contentRefs, items])

    useEffect(() => {
        const border = getComputedStyle(ref.current!).border
        buttonRef.current!.style.borderBottom = open ? border : 'none'

    }, [open, ref, buttonRef])


    useEffect(() => {
        setIndex(thisIndex)
    }, [thisIndex, setIndex])

    useEffect(() => {
        if(value)
        setThisIndex(items.findIndex(item => item.value === value))
    }, [value, items])


    return (
        <div
            tabIndex={0}
            onBlur={() => setOpen(false)}
            className={`${styles.dropdown} ${className} ${open ? styles.open : ''}`}
            onClick={() => setOpen(!open)}
            ref={ref}>
            <div ref={buttonRef} className={styles.dropdownButton} >
                {thisIndex === -1 ? placeholder : items[thisIndex].label}
                <span className={styles.arrow} />
            </div>
            <div ref={contentWrapperRef} className={`${styles.dropdownContent} ${open ? '' : styles.hidden}`}>
                {items.map((item, currentIndex) => {
                    return (
                        <div key={item.value} ref={(element) => contentRefs.current.push(element!)} className={styles.dropdownItem} onClick={() => {
                            setThisIndex(currentIndex)
                            setValue(item.value)
                        }}>
                            {item.label}
                        </div>
                    )
                }
                )}
            </div>
        </div>
    )
}
