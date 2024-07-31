import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './SideNav.module.css';

const SideNav = () => {
  return (
    <div className={` ${styles.sidenav}`}>
      <h3>Dashboard</h3>
      <ul className="nav nav-pills flex-column">
        <li className="nav-item">
          <Link href="/admin/admincrud" className="nav-link">
            Admin CRUD
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/ticketcrud" className="nav-link">
            Ticket CRUD
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/theatercrud" className="nav-link">
            Theater CRUD
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/moviecrud" className="nav-link">
            Movie CRUD
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/theatermoviescrud" className="nav-link">
            Theater Movies CRUD
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
