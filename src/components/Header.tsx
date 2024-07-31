"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";
import logo from "../assets/logo.png";
import { UserButton, useUser } from '@clerk/nextjs';

const Header = () => {
  const { isSignedIn } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src={logo} alt="Logo" width={200} height={150} />
        </Link>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className={styles.searchInput}
        />
      </div>
      <div>
        {isSignedIn ? (
          <div>
            <UserButton />
          </div>
        ) : (
          <div className={styles.signInContainer}>
            <button className={styles.signInButton}>
              <Link href="/sign-in" className="btn btn-primary">Sign in</Link>
            </button>
            <button className={styles.signInButton}>
              <Link href="/sign-up" className="btn btn-primary">Sign up</Link>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
