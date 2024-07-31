import SideNav from "@/components/SideNav";
import React from "react";
import styles from "./Admin.module.css";

function Admin() {
  return (
    <>
      {/* <SideNav /> */}
      <div className={styles.welcome}>
        <h1 className={styles.h3}>Welcome to the Admin Dashboard</h1>
      </div>
    </>
  );
}

export default Admin;
