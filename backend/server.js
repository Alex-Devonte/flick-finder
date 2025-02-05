import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import { ruruHTML } from "ruru/server";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    search(query: String!): [Results]
    movie(id: Int!): Movie
    tv(id: Int!): Tv
    actor(id: Int!): Actor
  }

  type Results {
    id: Int
    name: String
    title: String
    poster_path: String
    profile_path: String
    media_type: String
    release_date: String
    first_air_date: String
    overview: String
    known_for: [KnownFor]
  }

  type Movie {
    id: Int
    title: String
    overview: String
    backdrop_path: String
    poster_path: String
    release_date: String
    rating: String
    runtime: Int
    tagline: String
    genres: [Genre]
    credits: Credits
  }

  type Tv {
    id: Int
    name: String
    overview: String
    first_air_date: String
    backdrop_path: String
    poster_path: String
    rating: String
    genres: [Genre]
    credits: Credits
    created_by: [Creator]
  }

  type Actor {
      id: Int
      biography: String
      birthday: String
      deathday: String
      gender: Int
      known_for_department: String
      name: String
      place_of_birth: String
      profile_path: String
  }

  type Credits {
    cast: [Cast]
    crew: [Crew]
  }

  type KnownFor {
    id: Int
    title: String
    media_type: String
  }

  type Genre {
    id: Int
    name: String
  }

  type Cast {
    id: Int
    name: String
    profile_path: String
    character: String
    roles: [Role]
  }

  type Crew {
    id: Int
    name: String
    role: String
  }

  type Role {
    credit_id: String
    character: String
    episode_count: Int
  }

  type Creator { 
    id: Int
    name: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  search: async ({ query }) => {
    const options = {
      method: "GET",
      url: `${process.env.TMDB_BASE_URL}/search/multi?query=${query}`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMBD_API_Token}`,
      },
    };

    try {
      console.log(`Searching for movies with query: ${query}`);
      const response = await axios.request(options);
      console.log(response);
      console.log(
        `Response from TMDB: ${JSON.stringify(response.data.results)}`
      );

      return response.data.results.map((result) => ({
        id: result.id,
        title: result.title, //Movies
        name: result.name, //Actors & Tv Shows
        poster_path: result.poster_path,
        profile_path: result.profile_path,
        media_type: result.media_type,
        release_date: result.release_date, //Movies
        first_air_date: result.first_air_date, //TV
        overview: result.overview,
        known_for: result.known_for //Only retrieve id & title from array if available
          ? result.known_for.map((item) => ({
              id: item.id,
              title: item.title || item.name,
              media_type: item.media_type,
            }))
          : [],
      }));
    } catch (error) {
      console.error("Error fetching data from TMDB:", error);
      throw new Error("Failed to fetch data from TMDB");
    }
  },
  movie: async ({ id }) => {
    const options = {
      method: "GET",
      url: `${process.env.TMDB_BASE_URL}/movie/${id}?append_to_response=release_dates,credits`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMBD_API_Token}`,
      },
    };

    try {
      console.log(`Getting data from movie with ID: ${id}`);
      const response = await axios.request(options);

      const movie = response.data;
      console.log(movie);

      //Find US rating for movie
      const releaseDates = movie.release_dates.results;

      const usRelease = releaseDates.find(
        (release) => release.iso_3166_1 === "US"
      );

      let rating = "";

      if (usRelease) {
        //Extract the certification from the first release date for the US
        rating = usRelease.release_dates[0].certification;
      }

      const cast = response.data.credits.cast.slice(0, 10).map((person) => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profile_path: person.profile_path,
      }));

      const crewData = response.data.credits.crew;

      //Get the director
      const director = crewData.find((person) => person.job === "Director");

      //Get the first 3 writers
      const writers = crewData
        .filter((person) => person.department === "Writing")
        .slice(0, 3);

      const crew = [];

      if (director) {
        crew.push({ id: director.id, name: director.name, role: "Director" });
      }

      writers.forEach((person) => {
        crew.push({ id: person.id, name: person.name, role: "Writer" });
      });

      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        rating,
        tagline: movie.tagline,
        runtime: movie.runtime,
        genres: movie.genres,
        credits: { cast, crew },
      };
    } catch (error) {
      console.error("Error fetching data from TMDB:", error);
      throw new Error("Failed to fetch data from TMDB");
    }
  },
  tv: async ({ id }) => {
    const options = {
      method: "GET",
      url: `${process.env.TMDB_BASE_URL}/tv/${id}?append_to_response=content_ratings,aggregate_credits`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMBD_API_Token}`,
      },
    };

    try {
      console.log(`Getting data from show with ID: ${id}`);
      const response = await axios.request(options);

      const show = response.data;
      console.log(show);

      //Grab the creators if there are any
      let creators = [];
      const creatorDetails = show.created_by || [];

      creatorDetails.forEach((creator) => {
        creators.push({
          id: creator.id,
          name: creator.name,
        });
      });

      //Extract US content rating
      const contentRatings = show.content_ratings.results;
      const usContentRating = contentRatings.find(
        (rating) => rating.iso_3166_1 === "US"
      );
      let rating = "";

      if (usContentRating) {
        // Extract the content rating (certification) for the US
        rating = usContentRating.rating;
      }

      const cast = response.data.aggregate_credits.cast
        .slice(0, 10) //Limit to 10 cast members
        .map((person) => ({
          id: person.id,
          name: person.name,
          character: person.character,
          profile_path: person.profile_path,
          roles: person.roles.map((role) => ({
            credit_id: role.credit_id,
            character: role.character,
            episode_count: role.episode_count,
          })),
        }));

      return {
        id: show.id,
        name: show.name,
        overview: show.overview,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        first_air_date: show.first_air_date,
        rating,
        genres: show.genres,
        credits: { cast },
        created_by: creators,
      };
    } catch (error) {
      console.error("Error fetching data from TMDB:", error);
      throw new Error("Failed to fetch data from TMDB");
    }
  },
  actor: async ({ id }) => {
    const options = {
      method: "GET",
      url: `${process.env.TMDB_BASE_URL}/person/${id}`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMBD_API_Token}`,
      },
    };

    try {
      console.log(`Getting data from actor with ID: ${id}`);
      const response = await axios.request(options);

      const actor = response.data;
      console.log(actor);

      return {
        id: actor.id,
        biography: actor.biography,
        birthday: actor.birthday,
        deathday: actor.deathday,
        gender: "Male" ? actor.gender === 2 : "Female",
        known_for_department: actor.known_for_department,
        name: actor.name,
        place_of_birth: actor.place_of_birth,
        profile_path: actor.profile_path,
      };
    } catch (error) {
      console.error("Error fetching data from TMDB:", error);
      throw new Error("Failed to fetch data from TMDB");
    }
  },
};

const app = express();
console.log("Frontend URL:", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);




// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// Start the server at port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `Running a GraphQL API server at http://localhost:${PORT}/graphql`
  );
});
