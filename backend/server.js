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
    known_for: [KnownFor]
  }

  type Movie {
    id: Int
    title: String
    overview: String
    backdrop_path: String
    poster_path: String
    release_date: String
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
    genres: [Genre]
    credits: Credits
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
  }

  type KnownFor {
    id: Int
    title: String
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

  type Role {
    credit_id: String
    character: String
    episode_count: Int
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
        release_date: result.release_date,
        known_for: result.known_for //Only retrieve id & title from array if available
          ? result.known_for.map((item) => ({
              id: item.id,
              title: item.title || item.name,
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
      url: `${process.env.TMDB_BASE_URL}/movie/${id}`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMBD_API_Token}`,
      },
    };

    //Fetch credits for the movie
    const creditsOptions = {
      ...options,
      url: `${process.env.TMDB_BASE_URL}/movie/${id}/credits`,
    };

    try {
      console.log(`Getting data from movie with ID: ${id}`);
      const response = await axios.request(options);
      const creditsResponse = await axios.request(creditsOptions);

      const movie = response.data;
      console.log(movie);

      const cast = creditsResponse.data.cast.map((person) => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profile_path: person.profile_path,
      }));

      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        genres: movie.genres,
        credits: { cast },
      };
    } catch (error) {
      console.error("Error fetching data from TMDB:", error);
      throw new Error("Failed to fetch data from TMDB");
    }
  },
  tv: async ({ id }) => {
    const options = {
      method: "GET",
      url: `${process.env.TMDB_BASE_URL}/tv/${id}`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMBD_API_Token}`,
      },
    };

    //Fetch credits for the TV Series
    const creditsOptions = {
      ...options,
      url: `${process.env.TMDB_BASE_URL}/tv/${id}/aggregate_credits`,
    };

    try {
      console.log(`Getting data from show with ID: ${id}`);
      const response = await axios.request(options);
      const creditsResponse = await axios.request(creditsOptions);

      const show = response.data;
      console.log(show);

      const cast = creditsResponse.data.cast.map((person) => ({
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
        genres: show.genres,
        credits: { cast },
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
app.use(cors());

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
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");