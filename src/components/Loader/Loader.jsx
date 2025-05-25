"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../../assets/auth/sign-in/Logo-ABP.png";
import styles from "./Loader.module.css";

export default function Loader({ isLoading = true }) {
  const [showLoader, setShowLoader] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let timeoutId;

    if (isLoading) {
      setShowLoader(true);
      setStartTime(Date.now());
    } else if (startTime) {
      const elapsed = Date.now() - startTime;
      const remaining = 3000 - elapsed;

      timeoutId = setTimeout(() => {
        setShowLoader(false);
        setStartTime(null);
      }, remaining > 0 ? remaining : 0);
    } else {
      setShowLoader(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  if (!showLoader) return null;

  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderContainer}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className={styles.logoContainer}
        >
          <img
            src={logo}
            alt="ABP Bodega Logo"
            width={120}
            height={120}
            className={styles.logo}
          />
        </motion.div>

        <motion.div
          className={styles.spinnerContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.spinnerBase} />
          <div className={styles.spinnerRotating} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={styles.loadingText}
        >
          Cargando...
        </motion.p>

        <motion.div
          className={styles.dotsContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </motion.div>
      </div>
    </div>
  );
}
