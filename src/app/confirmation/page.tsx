"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import axios from 'axios';
import QRCode from 'qrcode.react'; 
import styles from './Confirmation.module.css';
import Link from "next/link";

export interface Ticket {
  _id: string;
  theatername: string;
  price: number;
  date: string;
  time: string;
  movie: string;
  seats: number;
  seatnames: string[];
}

const Confirmation: React.FC = () => {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticketId');

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) {
        setError('No ticket ID provided.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/api/ticket/getticket/${ticketId}`);
        setTicket(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching ticket.');
        setLoading(false);
        console.error('Error fetching ticket:', error);
      }
    };

    fetchTicket();
  }, [ticketId]);

  return (
    <div className={styles.confirmationContainer}>
      <h1 className={styles.h1}>Ticket Confirmation</h1>
      {loading ? (
        <div className={styles.alert} role="alert">
          Loading ticket...
        </div>
      ) : error ? (
        <div className={styles.alert} role="alert">{error}</div>
      ) : ticket ? (
        <div className={styles.ticketCard}>
          <div className={styles.cardBody}>
            <div className={styles.successIcon}>
              ✓
            </div>
            <h2 className={styles.cardTitle}>{ticket.movie}</h2>
            <p className={styles.cardText}><strong>Theater:</strong> {ticket.theatername}</p>
            <p className={styles.cardText}><strong>Date:</strong> {ticket.date}</p>
            <p className={styles.cardText}><strong>Time:</strong> {ticket.time}</p>
            <p className={styles.cardText}><strong>Seats:</strong> {ticket.seats}</p>
            <p className={styles.cardText}><strong>Seat Names:</strong> {ticket.seatnames.join(', ')}</p>
            <p className={styles.cardText}><strong>Price:</strong> ₹{ticket.price}</p>
            <div className={styles.qrCodeContainer}>
              <QRCode value={JSON.stringify(ticket)} />
            </div>
            <button className={styles.paymentButton}>
            <Link href="/" className="text-decoration-none text-white">
                Explore More Movies
              </Link>
            </button>
          </div>
        </div>

      ) : (
        <div className={styles.alert} role="alert">
          Ticket not found.
        </div>
      )}
    </div>
  );
};

export default Confirmation;
