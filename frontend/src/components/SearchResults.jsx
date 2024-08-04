import { useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const MediaResult = ({ result }) => (
    <>
      <div className="flex-shrink-0">
        <img
          src={
            result.poster_path
              ? `${import.meta.env.VITE_IMAGE_BASE_URL}${result.poster_path}`
              : import.meta.env.VITE_PLACEHOLDER_URL
          }
          alt={`${result.title || result.name} Poster`}
          className="mr-5 h-40 object-cover"
        />
      </div>
      <div>
        <Link className="font-bold">{result.name || result.title}</Link>
        <p className="mb-4 text-left italic">{result.release_date}</p>
      </div>
    </>
  );

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
    <div className="p-5">
      {(groupedResults.movie || groupedResults.tv) && (
        <div>
          <h1 className="mb-6 text-7xl">Movies & TV</h1>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(groupedResults.movie || []).map((result) => (
              <li
                key={result.id}
                className="flex items-center border-b p-4 md:flex-col md:justify-center"
              >
                <MediaResult result={result} />
              </li>
            ))}
            {(groupedResults.tv || []).map((result) => (
              <li key={result.id} className="flex items-center border-b p-4">
                <MediaResult result={result} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {groupedResults.person && (
        <div>
          <h1 className="mb-6 text-7xl">People</h1>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupedResults.person.map((result) => (
              <li key={result.id} className="flex items-center border-b p-4">
                <div>
                  <img
                    src={
                      result.profile_path
                        ? `${import.meta.env.VITE_IMAGE_BASE_URL}${result.profile_path}`
                        : import.meta.env.VITE_PLACEHOLDER_URL
                    }
                    alt={`${result.name} Photo`}
                    className="mr-5 h-20 w-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <Link className="text-2xl font-bold">{result.name}</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
