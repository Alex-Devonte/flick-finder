import SearchBar from "./SearchBar";

function Homepage() {
  return (
    <div className="flex flex-grow flex-col bg-pink-50">
      <h1 className="">Welcome to Flick Finder</h1>
      <p className="">Find your next favorite movie or TV show.</p>
      <SearchBar />
    </div>
  );
}

export default Homepage;
