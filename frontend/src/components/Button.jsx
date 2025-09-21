import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "primary",
  onClick,
  disabled,
  className = "",
  type = "button",
  title,
  ...props
}) => {
  const isDark = document.documentElement.classList.contains("dark");

  const buttonClass = `${styles.button} ${styles[variant]} ${
    isDark && variant === "secondary" ? styles.dark : ""
  } ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
