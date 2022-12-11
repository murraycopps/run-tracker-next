import Link from "next/link";
import styles from "../styles/NavBar.module.css";
import { useRouter } from "next/router";



export default function NavBar() {
    const path = useRouter().asPath;

    return (
        <div className={styles.navbar}>
            {/* <span className={styles.navbarBorder} /> */}
            <Link className={`${styles.navbarElement}  ${path == '/' ? styles.current : ''}`} href="/">
                <div>Home</div>
            </Link>
            {/* <span className={styles.navbarBorder} /> */}
            <Link className={`${styles.navbarElement}  ${path == '/new' ? styles.current : ''}`} href="/new">
                <div>New Run</div>
            </Link>
            {/* <span className={styles.navbarBorder} /> */}
        </div>
    )
}