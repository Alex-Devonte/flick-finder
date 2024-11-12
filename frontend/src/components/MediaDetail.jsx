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
        rating
        tagline
        runtime
        genres {
          id
          name
        }
        credits {
          cast {
            id
            name
            profile_path
            character
          }
          crew {
            id
            name
            role
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
        rating
        created_by {
          id
          name
        }
        genres {
          id
          name
        }
        credits {
          cast {
            id
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

  //Format media data into a more manageable object to make it easier to display properties
  const formatMediaData = (data, mediaType) => {
    if (!data) return null;

    if (mediaType === "movie") {
      //Destructure credits and movie data
      const { credits, ...movie } = data.movie;

      const groupedCrew = {};
      credits.crew.forEach((person) => {
        if (!groupedCrew[person.role]) {
          groupedCrew[person.role] = [];
        }
        groupedCrew[person.role].push(person);
      });

      console.log(groupedCrew);

      const mediaData = {
        ...movie,
        credits: {
          cast: credits.cast,
          crew: groupedCrew,
        },
      };

      console.log(mediaData);

      return mediaData;
    } else {
      return {
        title: data.tv.name,
        poster_path: data.tv.poster_path,
        backdrop_path: data.tv.backdrop_path,
        overview: data.tv.overview,
        release_date: data.tv.first_air_date,
        rating: data.tv.rating,
        genres: data.tv.genres,
        credits: data.tv.credits,
        created_by: data.tv.created_by,
      };
    }
  };

  const convertRuntime = (runtime) => {
    if (!runtime) {
      return null;
    }
    const hours = Math.floor(runtime / 60);
    const remainingMinutes = runtime % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const mediaData = formatMediaData(data, mediaType);

  console.log(mediaData);

  const displayCrew = (mediaData) => {
    const crew = mediaData.credits.crew;
    console.log(crew);

    //Remove duplicates by using a Map to filter by unique `id`
    const uniqueDirectors = crew.Director
      ? Array.from(
          new Map(crew.Director.map((member) => [member.id, member])).values(),
        ).filter((member) => member.role === "Director")
      : [];

    const uniqueWriters = crew.Writer
      ? Array.from(
          new Map(crew.Writer.map((member) => [member.id, member])).values(),
        ).filter((member) => member.role === "Writer")
      : [];

    return (
      <div>
        <ul className="">
          {uniqueDirectors.length > 0 && (
            <li>
              <span className="font-bold">
                Director{uniqueDirectors.length > 1 ? "s" : ""}:{" "}
              </span>
              <ul className="inline p-2">
                {uniqueDirectors.map((director) => (
                  <li className="inline" key={director.id}>
                    {director.name}
                  </li>
                ))}
              </ul>
            </li>
          )}
          {uniqueWriters.length > 0 && (
            <li>
              <span className="font-bold">
                Writer{uniqueWriters.length > 1 ? "s" : ""}:{" "}
              </span>
              <ul className="inline p-2">
                {uniqueWriters.map((writer) => (
                  <li className="inline p-1" key={writer.id}>
                    {writer.name}
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
    );
  };
  

  const displayCreators = (mediaData) => {
    const creators = mediaData.created_by || []; // Ensure creators is defined
    console.log(creators);
    return (
      <div>
        {creators.length > 0 && (
          <>
            <p>Creators: </p>
            <ul className="inline p-2">
              {creators.map((creator) => (
                <li className="inline p-1" key={creator.id}>
                  {creator.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  if (loading) return <p>Loading . . . </p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="relative text-left">
      {/* Background Backdrop */}
      <div
        className="absolute inset-0 z-0 flex h-[300px] w-full bg-cover bg-top bg-no-repeat lg:h-[700px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${import.meta.env.VITE_IMAGE_BASE_URL}original${mediaData.backdrop_path})`,
        }}
      ></div>

      {/* Poster & Movie Details */}
      <div className="relative z-10 flex flex-col lg:h-[700px] lg:flex-row">
        <div className="h-[300px] p-3 lg:h-full lg:w-1/3">
          <img
            className="h-full w-full object-contain"
            src={`${import.meta.env.VITE_IMAGE_BASE_URL}original${mediaData.poster_path}`}
            alt={`${mediaData.title} Poster`}
          />
        </div>

        <div className="p-5 lg:w-2/3">
          <h1 className="text-3xl font-bold">
            {mediaData.title}
            <span> ({mediaData.release_date.slice(0, 4)})</span>
          </h1>
          <p className="border">{mediaData.rating}</p>
          <p>{convertRuntime(mediaData.runtime)}</p>
          <ul>
            {mediaData.genres.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
          <p className="text-black">{mediaData.tagline}</p>
          <p className="text-left text-lg text-black">{mediaData.overview}</p>
          {/* Render Creators if present */}
          {mediaData?.created_by && <>{displayCreators(mediaData)}</>}
          {mediaData?.credits?.crew && (
            <>
              {/* Crew */}
              {displayCrew(mediaData)}
            </>
          )}
        </div>
      </div>

      {/* Cast */}
      <div className="relative z-20 m-2 bg-white p-4">
        <h2 className="text-xl font-semibold">Top Billed Cast</h2>
        <div className="flex gap-10 overflow-x-scroll">
          {mediaData.credits.cast.map((cast) => (
            <div key={cast.id}>
              <img
                className="h-60 w-60"
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}original${cast.profile_path}`}
              />
              <p>{cast.name}</p>
              <p>{cast.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MediaDetail;
