import { useParams, useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

function MediaDetail() {
  //Extract movie/show id from the URL
  const { id } = useParams();
  const movieID = parseInt(id, 10);
  const location = useLocation();
  const { mediaType } = location.state || {};

  const MOVIE_QUERY = gql`
    query Movie($id: Int!) {
      movie(id: $id) {
        id
        title
        overview
        backdrop_path
        poster_path
        release_date
        genres {
          id
          name
        }
        credits {
          cast {
            name
            profile_path
            character
          }
        }
      }
    }
  `;

  const TV_QUERY = gql`
    query TV($id: Int!) {
      tv(id: $id) {
        id
        name
        overview
        first_air_date
        backdrop_path
        poster_path
        genres {
          id
          name
        }
        credits {
          cast {
            name
            profile_path
            character
            roles {
              credit_id
              character
              episode_count
            }
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(
    mediaType === "movie" ? MOVIE_QUERY : TV_QUERY,
    {
      variables: { id: movieID },
    },
  );

  console.log("RAW DATA: ", data);

  //Format data into a more manageable object to make it easier to display properties
  const formatData = (data, mediaType) => {
    if (!data) return null;

    if (mediaType === "movie") {
      return {
        title: data.movie.title,
        poster_path: data.movie.poster_path,
        backdrop_path: data.movie.backdrop_path,
        overview: data.movie.overview,
        release_date: data.movie.release_date,
        genres: data.movie.genres,
        credits: data.movie.credits,
      };
    } else {
      return {
        title: data.tv.name,
        poster_path: data.tv.poster_path,
        backdrop_path: data.tv.backdrop_path,
        overview: data.tv.overview,
        release_date: data.tv.first_air_date,
        genres: data.tv.genres,
        credits: data.tv.credits,
      };
    }
  };

  const mediaData = formatData(data, mediaType);
  console.log(mediaData);

  if (loading) return <p>Loading . . . </p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <p>Viewing detail for: {id}</p>
      <img
        src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mediaData.poster_path}`}
        alt={`${mediaData.title} Poster`}
      />
      <img
        src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mediaData.backdrop_path}`}
        alt={`${mediaData.title} Backdrop`}
      />
      <p>{mediaData.title}</p>
      <p>Overview: {mediaData.overview}</p>
      <p>
        {mediaType === "movie" ? "Release Date:" : "First Air Date:"}{" "}
        {mediaData.release_date}
      </p>
      <p>Genres:</p>
      <ul>
        {mediaData.genres?.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>
    </>
  );
}

export default MediaDetail;
