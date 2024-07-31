"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import TheaterMovieModal from "../../../components/TheaterMovieModal";
import styles from "./TheaterMoviesCrud.module.css";

export interface Movie {
  _id: string;
  tmdbId: string;
  title: string;
  releasedate: string;
  genre: string;
  duration: string;
}

export interface Theater {
  _id: string;
  name: string;
  location: string;
}

export interface TheaterMovie {
  _id: string;
  movieId: string;
  theaterId: string;
  showtime: string;
}

const TheaterMoviesCrud = () => {
  const [theaterMovies, setTheaterMovies] = useState<TheaterMovie[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTheaterMovie, setCurrentTheaterMovie] = useState<
    Partial<TheaterMovie> | undefined
  >(undefined);

  useEffect(() => {
    fetchTheaterMovies();
  }, []);

  const fetchTheaterMovies = async () => {
    try {
      const response = await axios.get<TheaterMovie[]>(
        "http://localhost:8000/api/theatermovies/gettheatermovies"
      );
      setTheaterMovies(response.data);
    } catch (error) {
      console.error("Error fetching theater movies:", error);
    }
  };

  const handleSaveTheaterMovie = async (
    theaterMovie: Partial<TheaterMovie>
  ) => {
    try {
      const payload = {
        ...theaterMovie,
        movieId: theaterMovie.movieId,
        theaterId: theaterMovie.theaterId,
      };

      if (currentTheaterMovie?._id) {
        await axios.put(
          `http://localhost:8000/api/theatermovies/updatetheatermovies/${currentTheaterMovie._id}`,
          payload
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/theatermovies/createtheatermovies",
          payload
        );
      }
      fetchTheaterMovies();
      setShowModal(false);
      setCurrentTheaterMovie(undefined);
    } catch (error) {
      console.error("Error saving theater movie:", error);
    }
  };

  const handleDeleteTheaterMovie = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/theatermovies/deletetheatermovies/${id}`
      );
      fetchTheaterMovies();
    } catch (error) {
      console.error("Error deleting theater movie:", error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.h3}>TheaterMovies Crud Application</h3>
        <div className={styles.input_search}>
          <input className={styles.input} type="search" />
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Theater Movie
          </button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Movie ID</th>
              <th className={styles.th}>Theater ID</th>
              <th className={styles.th}>Showtime</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {theaterMovies.map((theaterMovie) => (
              <tr className={styles.tr} key={theaterMovie._id}>
                <td className={styles.td}>{theaterMovie.movieId}</td>
                <td className={styles.td}>{theaterMovie.theaterId}</td>
                <td className={styles.td}>{theaterMovie.showtime}</td>
                <td className={styles.td}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setCurrentTheaterMovie(theaterMovie);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
                <td className={styles.td}>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteTheaterMovie(theaterMovie._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TheaterMovieModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveTheaterMovie}
        initialData={currentTheaterMovie}
      />
    </>
  );
};

export default TheaterMoviesCrud;
