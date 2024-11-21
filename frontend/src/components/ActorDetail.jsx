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
  const actor = data?.actor;

  if (loading) return <p>Loading . . .</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex-grow bg-pink-50">
      <p>Viewing detail for: {id}</p>
      <p>{actor.name}</p>
      <p>{actor.gender === 1 ? "Male" : "Female"}</p>

      <p>{actor.place_of_birth}</p>
      <img
        src={
          actor.profile_path
            ? `${import.meta.env.VITE_IMAGE_BASE_URL}w500${actor.profile_path}`
            : import.meta.env.VITE_PLACEHOLDER_URL
        }
        alt={`${actor.name} Photo`}
      />
    </div>
  );
}

export default ActorDetail;
