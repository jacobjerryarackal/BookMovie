"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./TheaterCrud.module.css";
import TheaterModal from "../../../components/TheaterModal";

interface Theater {
  _id?: string;
  name: string;
  location: string;
  capacity: number;
}

function TheaterCrud() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTheater, setCurrentTheater] = useState<Theater | null>(null);

  const getAllTheaters = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/theater/gettheater");
      setTheaters(res.data);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    }
  };

  const handleSaveTheater = async (theater: Theater) => {
    try {
      if (currentTheater && currentTheater._id) {
        await axios.put(`http://localhost:8000/api/theater/updatetheater/${currentTheater._id}`, theater);
      } else {
        await axios.post("http://localhost:8000/api/theater/createtheater", theater);
      }
      getAllTheaters();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving theater:", error);
    }
  };

  const handleDeleteTheater = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/theater/deletetheater/${id}`);
      getAllTheaters();
    } catch (error) {
      console.error("Error deleting theater:", error);
    }
  };

  useEffect(() => {
    getAllTheaters();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.h3}>Theaters Crud Application</h3>
        <div className={styles.input_search}>
          <input className={styles.input} type="search" />
          <a
            href="#"
            className={`btn btn-primary ${styles.whiteLink}`}
            onClick={() => {
              setCurrentTheater(null);
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
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Capacity</th>
              <th className={styles.th}>Edit</th>
              <th className={styles.th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map((theater) => (
              <tr className={styles.tr} key={theater._id}>
                <td className={styles.td}>{theater._id}</td>
                <td className={styles.td}>{theater.name}</td>
                <td className={styles.td}>{theater.location}</td>
                <td className={styles.td}>{theater.capacity}</td>
                <td className={styles.td}>
                  <a
                    href="#"
                    className={`btn btn-primary ${styles.whiteLink}`}
                    onClick={() => {
                      setCurrentTheater(theater);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </a>
                </td>
                <td className={styles.td}>
                  <button
                    className={styles.btn2}
                    onClick={() => handleDeleteTheater(theater._id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TheaterModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveTheater}
        initialData={currentTheater}
      />
    </>
  );
}

export default TheaterCrud;
