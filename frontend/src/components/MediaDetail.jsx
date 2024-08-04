import { useParams } from "react-router-dom";

function MediaDetail() {
  //Extract movie id from the URL
  const { id } = useParams();
  return <p>Viewing detail for: {id}</p>;
}

export default MediaDetail;
