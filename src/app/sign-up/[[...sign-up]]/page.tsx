import { SignUp } from "@clerk/nextjs";
import styles from './SignUp.module.css';

export default function Page() {
  return (
    <div className={styles.signup}>
      <h1 className={styles.h1}>Register</h1>
      <SignUp />
      <div className={styles.sp}></div>
    </div>
  );
}