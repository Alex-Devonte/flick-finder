import { useParams } from "react-router-dom";

function ActorDetail() {
  //Extract actor id from the URL
  const { id } = useParams();
  return <p>Viewing detail for: {id}</p>;
}

export default ActorDetail;
