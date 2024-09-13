import { useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const MediaResult = ({ result }) => (
    <div className="flex w-full rounded-md border-2">
      <div className="h-48 flex-shrink-0">
        <Link
          to={`/details/media/${result.id}`}
          state={{ mediaType: result.media_type }}
        >
          <img
            src={
              result.poster_path
                ? `${import.meta.env.VITE_IMAGE_BASE_URL}${result.poster_path}`
                : import.meta.env.VITE_PLACEHOLDER_URL
            }
            alt={`${result.title || result.name} Poster`}
            className="h-full w-32 rounded-bl-md rounded-tl-md border-r-4 object-cover lg:mr-5"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-center p-3 text-left">
        <Link
          className="font-bold"
          to={`/details/media/${result.id}`}
          state={{ mediaType: result.media_type }}
        >
          {result.name || result.title}
        </Link>
        <p className="mb-4 text-left text-sm italic">{result.release_date}</p>
        <p className="line-clamp-2 text-sm lg:line-clamp-3">
          {result.overview}
        </p>
      </div>
    </div>
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
        overview
        known_for {
          id
          title
        }
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
    <div>
      {(groupedResults.movie || groupedResults.tv) && (
        <div>
          <h1 className="mb-6 text-7xl">Movies & TV</h1>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(groupedResults.movie || []).map((result) => (
              <li
                key={result.id}
                className="flex items-center border-b p-4 md:flex-col md:justify-center"
              >
                <MediaResult result={result} />
              </li>
            ))}
            {(groupedResults.tv || []).map((result) => (
              <li
                key={result.id}
                className="flex items-center border-b p-4 md:flex-col md:justify-center"
              >
                <MediaResult result={result} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {groupedResults.person && (
        <div className="p-2">
          <h1 className="mb-6 text-7xl">People</h1>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupedResults.person.map((person) => (
              <li key={person.id}>
                <div className="flex w-full items-center gap-10 rounded-md border-2 p-5 md:h-44 md:gap-4 lg:justify-evenly">
                  <Link to={`/details/people/${person.id}`}>
                    <img
                      src={
                        person.profile_path
                          ? `${import.meta.env.VITE_IMAGE_BASE_URL}${person.profile_path}`
                          : import.meta.env.VITE_PLACEHOLDER_URL
                      }
                      alt={`${person.name} Photo`}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  </Link>

                  <div className="flex max-w-xs flex-grow flex-col">
                    <Link
                      className="flex-1 text-left text-2xl font-bold"
                      to={`/details/people/${person.id}`}
                    >
                      {person.name}
                    </Link>
                    <div className="text-left">
                      {person.known_for &&
                        person.known_for.length > 0 &&
                        person.known_for.map((media) => (
                          <ul key={media.id}>
                            <li className="pt-2">
                              <Link to={`/details/media/${media.id}`}>
                                {media.title}
                              </Link>
                            </li>
                          </ul>
                        ))}
                    </div>
                  </div>
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
