import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Code Genie</h1>
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
