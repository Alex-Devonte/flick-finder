import { useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const SEARCH_QUERY = gql`
    query Search($query: String!) {
      search(query: $query) {
        id
        name
        title
        poster_path
        profile_path
        media_type
        release_date
      }
    }
  `;

  const { loading, error, data } = useQuery(SEARCH_QUERY, {
    variables: { query },
  });

  if (loading) return <p>Loading . . . </p>;
  if (error) return <p>Error: {error.message}</p>;

  //Create an object with the results grouped my media type
  const groupedResults = data.search.reduce((acc, result) => {
    //Create array for key if it doesn't exist
    if (!acc[result.media_type]) {
      acc[result.media_type] = [];
    }
    acc[result.media_type].push(result);
    return acc;
  }, {});

  console.log(groupedResults);

  return (
    <>
      {(groupedResults.movie || groupedResults.tv) && (
        <div>
          <h1 className="text-7xl">Movies & TV</h1>
          {(groupedResults.movie || []).map((result) => (
            <div key={result.id} className="border-2 border-dark-red bg-cream">
              <p>Title: {result.title}</p>
              <p>Poster Path: {result.poster_path}</p>
              <p>Release Date: {result.release_date}</p>
              <p>Media Type: {result.media_type}</p>
            </div>
          ))}
          {(groupedResults.tv || []).map((result) => (
            <div key={result.id} className="border-2 border-dark-red bg-cream">
              <p>Name: {result.name}</p>
              <p>Poster Path: {result.poster_path}</p>
              <p>Release Date: {result.release_date}</p>
              <p>Media Type: {result.media_type}</p>
            </div>
          ))}
        </div>
      )}

      {groupedResults.person && (
        <div>
          <h1 className="text-7xl">People</h1>
          {groupedResults.person.map((result) => (
            <div key={result.id} className="border-2 border-dark-red bg-cream">
              <p>Name: {result.name}</p>
              <p>Profile Path: {result.profile_path}</p>
              <p>Media Type: {result.media_type}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SearchResults;
