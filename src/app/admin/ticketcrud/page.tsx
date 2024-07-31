"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./TicketCrud.module.css";
import TicketModal from "../../../components/TicketModal";

interface Ticket {
  _id?: string;
  theatername: string;
  price: number;
  date: string;
  time: string;
  movie: string;
  seats: number;
  seatnames: string[];
  movieId: string;
  theaterId: string;
}

function TicketCrud() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);

  const getAllTickets = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/ticket/getticket");
      setTickets(res.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleSaveTicket = async (ticket: Ticket) => {
    try {
      if (currentTicket && currentTicket._id) {
        await axios.put(`http://localhost:8000/api/ticket/updateticket/${currentTicket._id}`, ticket);
      } else {
        await axios.post("http://localhost:8000/api/ticket/createticket", ticket);
      }
      getAllTickets();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving ticket:", error);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/ticket/deleteticket/${id}`);
      getAllTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  useEffect(() => {
    getAllTickets();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.h3}>Tickets CRUD Application</h3>
        <div className={styles.input_search}>
          <input className={styles.input} type="search" />
          <a
            href="#"
            className={`btn btn-primary ${styles.whiteLink}`}
            onClick={() => {
              setCurrentTicket(null);
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
              <th className={styles.th}>Theater Name</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Time</th>
              <th className={styles.th}>Movie</th>
              <th className={styles.th}>Seats</th>
              <th className={styles.th}>Seat Names</th>
              <th className={styles.th}>Movie ID</th>
              <th className={styles.th}>Theater ID</th>
              <th className={styles.th}>Edit</th>
              <th className={styles.th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr className={styles.tr} key={ticket._id}>
                <td className={styles.td}>{ticket._id}</td>
                <td className={styles.td}>{ticket.theatername}</td>
                <td className={styles.td}>{ticket.price}</td>
                <td className={styles.td}>{ticket.date}</td>
                <td className={styles.td}>{ticket.time}</td>
                <td className={styles.td}>{ticket.movie}</td>
                <td className={styles.td}>{ticket.seats}</td>
                <td className={styles.td}>{ticket.seatnames.join(", ")}</td>
                <td className={styles.td}>{ticket.movieId}</td>
                <td className={styles.td}>{ticket.theaterId}</td>
                <td className={styles.td}>
                  <button
                    className={`btn btn-primary ${styles.whiteLink}`}
                    onClick={() => {
                      setCurrentTicket(ticket);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
                <td className={styles.td}>
                  <button
                    className={`btn btn-danger ${styles.whiteLink}`}
                    onClick={() => handleDeleteTicket(ticket._id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TicketModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveTicket}
        initialData={currentTicket}
      />
    </>
  );
}

export default TicketCrud;
