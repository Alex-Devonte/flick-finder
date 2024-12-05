import { useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const MediaResult = ({ result }) => (
    <div className="flex flex-col">
      <div className="">
        <Link
          to={`/details/media/${result.id}`}
          state={{ mediaType: result.media_type }}
        >
          <img
            src={
              result.poster_path
                ? `${import.meta.env.VITE_IMAGE_BASE_URL}w500${result.poster_path}`
                : import.meta.env.VITE_PLACEHOLDER_URL
            }
            alt={`${result.title || result.name} Poster`}
            className="h-[280px] rounded-[15px] md:h-[340px] lg:h-[500px]"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-center p-2 text-left">
        <Link
          className="font-bold"
          to={`/details/media/${result.id}`}
          state={{ mediaType: result.media_type }}
        >
          {result.name || result.title}
          <p className="mb-4 text-left font-normal italic">
            {result.release_date
              ? result.release_date.slice(0, 4)
              : result.first_air_date?.slice(0, 4)}
          </p>
        </Link>
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
        first_air_date
        overview
        known_for {
          id
          title
          media_type
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
    <div className="flex-grow text-charcoal">
      {(groupedResults.movie || groupedResults.tv) && (
        <div>
          <h1 className="mb-14 p-5 text-6xl font-bold text-charcoal">
            Movies & TV
          </h1>
          <ul className="grid grid-cols-2 items-start gap-3 p-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-0 xl:grid-cols-7">
            {(groupedResults.movie || []).map((result) => (
              <li
                key={result.id}
                className="flex items-center pb-5 md:flex-col md:justify-center lg:items-start lg:gap-0 lg:p-5"
              >
                <MediaResult result={result} />
              </li>
            ))}
            {(groupedResults.tv || []).map((result) => (
              <li
                key={result.id}
                className="flex items-center pb-5 md:flex-col md:justify-center lg:items-start lg:gap-0 lg:p-5"
              >
                <MediaResult result={result} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {groupedResults.person && (
        <div className="my-10">
          <h1 className="mb-14 p-5 text-6xl font-bold text-charcoal">People</h1>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {groupedResults.person.map((person) => (
              <li key={person.id}>
                <div className="flex w-full items-center gap-10 p-3 pb-0 md:h-44 md:gap-4 lg:justify-start lg:p-5">
                  <Link to={`/details/people/${person.id}`}>
                    <img
                      src={
                        person.profile_path
                          ? `${import.meta.env.VITE_IMAGE_BASE_URL}w185${person.profile_path}`
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
                              <Link
                                to={`/details/media/${media.id}`}
                                state={{ mediaType: media.media_type }}
                              >
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
