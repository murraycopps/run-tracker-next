import Link from "next/link";
import styles from "../styles/NavBar.module.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'



export default function NavBar() {
    const path = useRouter().asPath;
    const isBreakpoint = useMediaQuery(768);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen && isBreakpoint) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen])
    
    useEffect(() => {
        setIsOpen(false);
    }, [path, isBreakpoint])


    return (
        <>
            <div className={styles.navbarDropdown} onClick={() => setIsOpen(!isOpen)}>
                <span className={isOpen ? 'bg-black' : 'bg-white'}></span>
                <span className={isOpen ? 'bg-black' : 'bg-white'}></span>
                <span className={isOpen ? 'bg-black' : 'bg-white'}></span>
            </div>
            {isOpen || !isBreakpoint ? <div className={styles.navbar}>
                <span className={styles.navbarBorder} />
                <Link className={`${styles.navbarElement}  ${path == '/' ? styles.current : ''}`} href="/">
                    {!isBreakpoint ? <FontAwesomeIcon icon={faHome} /> : null}
                    <div>Home</div>
                </Link>
                {!isBreakpoint ? <span className="flex-grow"></span> : null}
                <span className={styles.navbarBorder} />
                <Link className={`${styles.navbarElement}  ${path == '/runs' ? styles.current : ''}`} href="/runs">
                    <div>All Runs</div>
                </Link>
                <span className={styles.navbarBorder} />
                <Link className={`${styles.navbarElement}  ${path == '/new' ? styles.current : ''}`} href="/new">
                    <div>New Run</div>
                </Link>
                <span className={styles.navbarBorder} />
            </div> : null}
        </>
    )
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
    }, []);

    return targetReached;
};