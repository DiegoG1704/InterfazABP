import styles from "./headerAffiliates.module.css"; // Asegúrate de que el archivo CSS exista y tenga este nombre
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"

const HeaderAffiliates = ({ cntAfiliados, cntActive, cntInactive }) => {
    return (
        <header className={styles.header}>
            <h3 className={styles.title}>Panel de Control ABP</h3>
            <p className={styles.moduleDescription}>Gestiona y supervisa todos los afiliados de manera eficiente desde tu centro de control</p>
            <div className={styles.divContainerCards}>
                <div className={styles.cardItem}>

                    <div>
                        <h4 className={styles.cardTitle}>Total de Afiliados</h4>
                        <p className={`${styles.cardValue} ${styles.CardValueAf}`}>{cntAfiliados}</p>
                    </div>
                    <div>
                        <div>
                            <Users className={`${styles.iconCard} ${styles.iconCardTotalAf}`} />
                            {/* <TrendingUp className={`${styles.iconCard} ${styles.iconCardTotalAf}`} /> */}
                        </div>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <div>
                        <h4 className={styles.cardTitle}>Afiliados Activos</h4>
                        <p className={`${styles.cardValue} ${styles.CardValueActive}`}>{cntActive}</p>
                    </div>
                    <div>
                        <div>
                            <UserCheck className={`${styles.iconCard} ${styles.iconCardActive}`} />
                        </div>
                    </div>

                </div>
                <div className={styles.cardItem}>
                    <div>
                        <h4 className={styles.cardTitle}>Afiliados Inactivos</h4>

                        <p className={`${styles.cardValue} ${styles.CardValueInactive}`}>{cntInactive}</p>
                    </div>
                    <div>
                        <div>
                            <UserX className={`${styles.iconCard} ${styles.iconCardInactive}`} />
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default HeaderAffiliates;
