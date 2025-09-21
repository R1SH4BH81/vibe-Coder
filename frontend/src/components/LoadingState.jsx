import { Loader2 } from "lucide-react";
import styles from "./LoadingState.module.css";

const LoadingState = ({ darkMode }) => {
  return (
    <div
      className={`${styles.loadingContainer} ${darkMode ? styles.dark : ""}`}
    >
      <div className={styles.spinner}>
        <Loader2 size={20} className={styles.spinIcon} />
      </div>
      <p className={styles.loadingText}>Generating code...</p>
    </div>
  );
};

export default LoadingState;
