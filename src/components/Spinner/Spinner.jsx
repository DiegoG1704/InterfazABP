
import styles from "./spinner.module.css"
const Spinner = ({ isVisible }) => {
    if (!isVisible) return null
    return (
        <div className={styles.overlay}>
            <div className={styles.spinner}></div>
        </div>
    )
}

export default Spinner
