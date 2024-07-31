"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./MovieDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface MovieDetails {
  backdrop_path: string;
  poster_path: string;
  original_title: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  release_date: string;
  genres: { id: number; name: string }[];
  overview: string;
  homepage: string;
  imdb_id: string;
  production_companies: { logo_path: string; name: string }[];
}

const MovieDetails: React.FC = () => {
  const [currentMovieDetail, setMovie] = useState<MovieDetails | null>(null);
  const { id } = useParams();

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
  }, [id]);

  const getData = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=fc575ea163f0128176ca77150fd7c76b`
    );
    const data = await response.json();
    setMovie(data);
  };

  return (
    <div className={styles.movie}>
      <div className={styles.movie__intro}>
        <img
          className={styles.movie__backdrop}
          src={`https://image.tmdb.org/t/p/original${
            currentMovieDetail?.backdrop_path ?? ""
          }`}
          alt="Backdrop"
        />
      </div>
      <div className={styles.movie__detail}>
        <div className={styles.movie__detailLeft}>
          <div className={styles.movie__posterBox}>
            <img
              className={styles.movie__poster}
              src={`https://image.tmdb.org/t/p/original${
                currentMovieDetail?.poster_path ?? ""
              }`}
              alt="Poster"
            />
          </div>
        </div>
        <div className={styles.movie__detailRight}>
          <div className={styles.movie__detailRightTop}>
            <div className={styles.movie__name}>
              {currentMovieDetail?.original_title ?? ""}
            </div>
            <div className={styles.movie__tagline}>
              {currentMovieDetail?.tagline ?? ""}
            </div>
            <div className={styles.movie__rating}>
              {currentMovieDetail?.vote_average ?? ""}{" "}
              <FontAwesomeIcon icon={faStar} />
              <span className={styles.movie__voteCount}>
                {currentMovieDetail
                  ? `(${currentMovieDetail.vote_count} votes)`
                  : ""}
              </span>
            </div>
            <div className={styles.movie__runtime}>
              {currentMovieDetail ? `${currentMovieDetail.runtime} mins` : ""}
            </div>
            <div className={styles.movie__releaseDate}>
              {currentMovieDetail
                ? `Release date: ${currentMovieDetail.release_date}`
                : ""}
            </div>
            <div className={styles.movie__genres}>
              {currentMovieDetail?.genres?.map((genre) => (
                <span
                  className={styles.movie__genre}
                  key={genre.id}
                  id={String(genre.id)}
                >
                  {genre.name}
                </span>
              )) ?? ""}
            </div>
          </div>
          <div className={styles.movie__detailRightBottom}>
            <div className={styles.synopsisText}>Synopsis</div>
            <div>{currentMovieDetail?.overview ?? ""}</div>
            <button className={styles.bookTicketsButton}>
              <Link href={`/tickets?tmdbId=${id}`} className="text-decoration-none text-white">
                Book Tickets
              </Link>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.pro}>
        <div className={styles.movie__heading}>Production companies</div>
        <div className={styles.movie__production}>
          {currentMovieDetail?.production_companies?.map((company) =>
            company.logo_path ? (
              <span
                className={styles.productionCompanyImage}
                key={company.name}
              >
                <img
                  className={styles.movie__productionComapany}
                  src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                  alt={company.name}
                />
                <span>{company.name}</span>
              </span>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
