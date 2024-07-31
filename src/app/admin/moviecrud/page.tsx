"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./MovieCrud.module.css";
import MovieModal from "../../../components/MovieModal";

interface Movie {
  _id?: string;
  title: string;
  genre: string;
  releasedate: string;
  duration: string;
}

function MovieCrud() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const getAllMovies = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/movies/getmovie");
      setMovies(res.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSaveMovie = async (movie: Movie) => {
    try {
      if (currentMovie && currentMovie._id) {
        await axios.put(`http://localhost:8000/api/movies/updatemovie/${currentMovie._id}`, movie);
      } else {
        await axios.post("http://localhost:8000/api/movies/createmovie", movie);
      }
      getAllMovies();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/movies/deletemovie/${id}`);
      getAllMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  useEffect(() => {
    getAllMovies();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.h3}>Movies CRUD Application</h3>
        <div className={styles.input_search}>
          <input className={styles.input} type="search" />
          <a href="#" className={`btn btn-primary ${styles.whiteLink}`} onClick={() => {
            setCurrentMovie(null);
            setShowModal(true);
          }}>Add Record</a>
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Id</th>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Genre</th>
              <th className={styles.th}>Release Date</th>
              <th className={styles.th}>Duration</th>
              <th className={styles.th}>Edit</th>
              <th className={styles.th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr className={styles.tr} key={movie._id}>
                <td className={styles.td}>{movie._id}</td>
                <td className={styles.td}>{movie.title}</td>
                <td className={styles.td}>{movie.genre}</td>
                <td className={styles.td}>{movie.releasedate}</td>
                <td className={styles.td}>{movie.duration}</td>
                <td className={styles.td}>
                  <a href="#" className={`btn btn-primary ${styles.whiteLink}`} onClick={() => {
                    setCurrentMovie(movie);
                    setShowModal(true);
                  }}>Edit</a>
                </td>
                <td className={styles.td}>
                  <button className={styles.btn2} onClick={() => handleDeleteMovie(movie._id!)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MovieModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveMovie}
        initialData={currentMovie}
      />
    </>
  );
}

export default MovieCrud;
