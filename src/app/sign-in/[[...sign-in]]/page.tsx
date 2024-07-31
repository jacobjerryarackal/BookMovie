import { SignIn } from "@clerk/nextjs";
import styles from './SignIn.module.css';

export default function Page() {
  return (
    <div className={styles.signin}>
      <h1 className={styles.h1}>Welcome Back !! to BookMovie</h1>
      <SignIn />
    </div>
  );
}