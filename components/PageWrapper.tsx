import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import NavBar from "./NavBar";
import styles from "../styles/PageWrapper.module.css"

export default function PageWrapper(props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }) {

    return (
        <div className={styles.page}>
            <NavBar />
            {props.children}
        </div>
    )
}