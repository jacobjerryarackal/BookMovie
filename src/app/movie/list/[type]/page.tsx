"use client";

import React, { useEffect, useState } from "react";
import Cards from "@/components/Card";
import styles from "./MovieList.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";

type Movie = {
  id: string;
  poster_path: string;
  original_title: string;
  release_date: string;
  vote_average: number;
  overview: string;
};

type Genre = {
  id: number;
  name: string;
};

const MovieList: React.FC = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const { type } = useParams();

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    getData();
  }, [type]);

  const fetchGenres = () => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=fc575ea163f0128176ca77150fd7c76b`)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres));
  };

  const getData = (genreId?: number) => {
    let url = `https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=fc575ea163f0128176ca77150fd7c76b`;

     if (type === "top_rated") {
      url = `https://api.themoviedb.org/3/movie/top_rated?api_key=fc575ea163f0128176ca77150fd7c76b`;
    } else if (type === "now_playing") {
      url = `https://api.themoviedb.org/3/movie/now_playing?api_key=fc575ea163f0128176ca77150fd7c76b`;
    } else if (type === "upcoming") {
      url = `https://api.themoviedb.org/3/movie/upcoming?api_key=fc575ea163f0128176ca77150fd7c76b`;
    }

    if (genreId) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=fc575ea163f0128176ca77150fd7c76b&with_genres=${genreId}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {setMovieList(data.results)
        console.log(data.results);
      });
      
      
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = parseInt(e.target.value);
    getData(genreId);
  };

  return (
    <div className={styles.movie}>
      <div className={styles.movie__list}>
        <div className={styles.filter}>
          <h2 className={styles.list__title}>
          {type ? type : "POPULAR".toUpperCase()}
          </h2>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Filter</button>
            <div className={styles.dropdown_content}>
              <Link className={styles.a} href="/movie/list/popular">Popular</Link>
              <Link className={styles.a} href="/movie/list/upcoming">Upcoming</Link>
              <Link className={styles.a} href="/movie/list/top_rated">Top Rated</Link>
              <Link className={styles.a} href="/movie/list/now_playing">Now Playing</Link>
            </div>
          </div>
          <select className={styles.genreDropdown} onChange={handleGenreChange}>
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.list__cards}>
          {movieList.map((movie) => (
            <Cards key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
