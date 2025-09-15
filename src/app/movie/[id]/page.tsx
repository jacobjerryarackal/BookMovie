"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./MovieDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface ShowDetails {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  premiered: string;
  ended: string | null;
  officialSite: string | null;
  rating: { average: number | null };
  image: { medium: string; original: string } | null;
  summary: string | null;
  network: { name: string; country: { name: string } } | null;
  webChannel: { name: string } | null;
}

export default function MovieDetails() {
  const [currentShowDetail, setShow] = useState<ShowDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    if (id) {
      getData();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.tvmaze.com/shows/${id}`
      );
      const data = await response.json();
      setShow(data);
    } catch (error) {
      console.error("Failed to fetch show details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading show details...</div>;
  }

  if (!currentShowDetail) {
    return <div className={styles.error}>Show details not available.</div>;
  }

  const backdropUrl = currentShowDetail.image
    ? currentShowDetail.image.original
    : "/images/default_backdrop.jpg";

  const posterUrl = currentShowDetail.image
    ? currentShowDetail.image.medium
    : "/images/default_poster.jpg";

  // Remove HTML tags from summary
  const cleanSummary = currentShowDetail.summary
    ? currentShowDetail.summary.replace(/<[^>]+>/g, "")
    : "No summary available.";

  // Get the network/channel name
  const networkName = currentShowDetail.network
    ? currentShowDetail.network.name
    : currentShowDetail.webChannel
    ? currentShowDetail.webChannel.name
    : "Unknown";

  return (
    <div className={styles.movie}>
      <div className={styles.movie__intro}>
        <img className={styles.movie__backdrop} src={backdropUrl} alt="Backdrop" />
        <button className={styles.backButton} onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to List
        </button>
      </div>

      <div className={styles.movie__detail}>
        <div className={styles.movie__detailLeft}>
          <div className={styles.movie__posterBox}>
            <img className={styles.movie__poster} src={posterUrl} alt="Poster" />
          </div>
        </div>

        <div className={styles.movie__detailRight}>
          <div className={styles.movie__detailRightTop}>
            <div className={styles.movie__name}>{currentShowDetail.name}</div>
            <div className={styles.movie__tagline}>
              {currentShowDetail.type} • {networkName}
            </div>
            <div className={styles.movie__rating}>
              {currentShowDetail.rating.average || "N/A"} <FontAwesomeIcon icon={faStar} />
            </div>
            {currentShowDetail.runtime && (
              <div className={styles.movie__runtime}>{currentShowDetail.runtime} mins</div>
            )}
            <div className={styles.movie__releaseDate}>
              Premiered: {currentShowDetail.premiered}
            </div>
            {currentShowDetail.ended && (
              <div className={styles.movie__releaseDate}>
                Ended: {currentShowDetail.ended}
              </div>
            )}
            <div className={styles.movie__genres}>
              {currentShowDetail.genres.map((genre, index) => (
                <span className={styles.movie__genre} key={index}>
                  {genre}
                </span>
              ))}
            </div>
            <div className={styles.movie__status}>
              Status: {currentShowDetail.status}
            </div>
            <div className={styles.movie__language}>
              Language: {currentShowDetail.language}
            </div>
          </div>

          <div className={styles.movie__detailRightBottom}>
            <div className={styles.synopsisText}>Summary</div>
            <div>{cleanSummary}</div>
            <button className={styles.bookTicketsButton}>
              <Link
                href={`/tickets?tvmazeId=${id}`}
                className="text-decoration-none text-white"
              >
                Book Tickets
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}