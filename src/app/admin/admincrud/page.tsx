"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./AdminCrud.module.css";
import AdminModal from "../../../components/AdminModal";

interface Admin {
  _id?: string;
  email: string;
  password: string;
}

function AdminCrud() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  const getAllAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin");
      setAdmins(res.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleSaveAdmin = async (admin: Admin) => {
    try {
      if (currentAdmin && currentAdmin._id) {
        await axios.put(`http://localhost:8000/api/admin`, admin);
      } else {
        await axios.post("http://localhost:8000/api/admin", admin);
      }
      getAllAdmins();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin`);
      getAllAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  useEffect(() => {
    getAllAdmins();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.h3}>Admins Crud Application</h3>
        <div className={styles.input_search}>
          <input className={styles.input} type="search" />
          <a
            href="#"
            className={`btn btn-primary ${styles.whiteLink}`}
            onClick={() => {
              setCurrentAdmin(null);
              setShowModal(true);
            }}
          >
            Add Record
          </a>
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Id</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Password</th>
              <th className={styles.th}>Edit</th>
              <th className={styles.th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr className={styles.tr} key={admin._id}>
                <td className={styles.td}>{admin._id}</td>
                <td className={styles.td}>{admin.email}</td>
                <td className={styles.td}>{admin.password}</td>
                <td className={styles.td}>
                  <a
                    href="#"
                    className={`btn btn-primary ${styles.whiteLink}`}
                    onClick={() => {
                      setCurrentAdmin(admin);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </a>
                </td>
                <td className={styles.td}>
                  <button
                    className={styles.btn2}
                    onClick={() => handleDeleteAdmin(admin._id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveAdmin}
        initialData={currentAdmin}
      />
    </>
  );
}

export default AdminCrud;
