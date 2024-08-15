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
        poster_path
        release_date
      }
    }
  `;

  const TV_QUERY = gql`
    query TV($id: Int!) {
      tv(id: $id) {
        id
        name
        overview
        backdrop_path
      }
    }
  `;

  const { loading, error, data } = useQuery(
    mediaType === "movie" ? MOVIE_QUERY : TV_QUERY,
    {
      variables: { id: movieID },
    },
  );

  console.log(data);

  if (loading) return <p>Loading . . . </p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <p>Viewing detail for: {id}</p>
      <p>{data.movie?.title || data.tv?.name}</p>
    </>
  );
}

export default MediaDetail;
