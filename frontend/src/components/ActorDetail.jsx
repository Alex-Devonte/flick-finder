import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

function ActorDetail() {
  //Extract actor id from the URL
  const { id } = useParams();
  const actorID = parseInt(id, 10);

  const ACTOR_QUERY = gql`
    query Actor($id: Int!) {
      actor(id: $id) {
        id
        biography
        birthday
        deathday
        gender
        known_for_department
        name
        place_of_birth
        profile_path
      }
    }
  `;

  const { loading, error, data } = useQuery(ACTOR_QUERY, {
    variables: { id: actorID },
  });

  console.log(data);

  if (loading) return <p>Loading . . .</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>Viewing detail for: {id}</p>;
}

export default ActorDetail;
