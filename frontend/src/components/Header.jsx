import { Code, Sparkles } from "lucide-react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.iconContainer}>
        <div className={styles.logoIcon}>
          <Code size={48} className={styles.codeIcon} />
          <Sparkles size={24} className={styles.sparklesIcon} />
        </div>
        <h1 className={styles.title}>Code Genie</h1>
      </div>

      <p className={styles.subtitle}>
        Transform your ideas into code with AI assistance
      </p>
      <p className={styles.description}>
        Describe what you want to build and get clean, functional code instantly
      </p>
    </div>
  );
};

export default Header;
