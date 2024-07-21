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
  }

  type Results {
    id: Int
    name: String
    title: String
    poster_path: String
    media_type: String
    release_date: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  search: async ({ query }) => {
    const options = {
      method: "GET",
      url: `${process.env.TMDB_BASE_URL}query=${query}`,
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
        media_type: result.media_type,
        release_date: result.release_date,
      }));
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