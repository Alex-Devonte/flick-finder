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

  const formatDate = (date) => {
    if (!date) return "";
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthDate, deathDate = null) => {
    if (!birthDate) return "";

    const birthday = new Date(birthDate);
    const endDate = deathDate ? new Date(deathDate) : new Date();

    let age = endDate.getFullYear() - birthday.getFullYear();
    const month = endDate.getMonth() - birthday.getMonth();

    //Adjust age if birthday hasn't happened yet
    if (month < 0 || (month === 0 && endDate.getDate() < birthday.getDate())) {
      age--;
    }

    return age;
  };

  if (loading) return <p>Loading . . .</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col p-4 lg:mx-auto lg:w-1/2 lg:flex-row lg:justify-center">
      <div className="mt-5 lg:flex-[6]">
        <img
          className="mx-auto rounded-md lg:mx-0"
          src={
            actor.profile_path
              ? `${import.meta.env.VITE_IMAGE_BASE_URL}w300${actor.profile_path}`
              : import.meta.env.VITE_PLACEHOLDER_URL
          }
          alt={`${actor.name} Photo`}
        />
        <p className="mb-10 mt-5 self-center text-center text-5xl font-bold lg:text-left">
          {actor.name}
        </p>
        <p className="">{actor.biography}</p>
      </div>

      <section className="mt-10 lg:flex-[4]">
        <h3 className="mb-5 text-2xl font-semibold">Personal Info</h3>

        <p className="mb-1 text-lg font-bold">Known For</p>
        <p className="mb-5">{actor.known_for_department}</p>

        <p className="mb-1 text-lg font-bold">Gender</p>
        <p className="mb-5">{actor.gender === 1 ? "Male" : "Female"}</p>

        <p className="mb-1 text-lg font-bold">Place of Birth</p>
        <p className="mb-5">{actor.place_of_birth}</p>

        <p className="mb-1 text-lg font-bold">Birthday</p>
        <p className="mb-5">
          {formatDate(actor.birthday)}
          {actor.deathday
            ? "" // If actor deathday exists, don't render anything extra
            : ` (${calculateAge(actor.birthday)} years old)`}
        </p>

        {actor.deathday && (
          <>
            <p className="mb-1 text-lg font-bold">Day of Death</p>
            <p className="mb-5">
              {formatDate(actor.deathday)} (
              {calculateAge(actor.birthday, actor.deathday)} years old)
            </p>
          </>
        )}
      </section>
    </div>
  );
}

export default ActorDetail;
