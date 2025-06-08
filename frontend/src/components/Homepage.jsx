import SearchBar from "./SearchBar";

function Homepage() {
  return (
    <div className="flex flex-grow flex-col bg-pink-50 bg-[url(/cinemabackdrop.jpg)] bg-cover bg-center p-5">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-90"></div>

      <div className="-z-1 relative text-center">
        <h1 className="mb-8 mt-16 text-5xl font-bold text-dark-cream md:text-7xl lg:text-8xl">
          Flick Finder
        </h1>
        <h3 className="mb-20 text-xl font-semibold italic text-light-cream md:text-2xl lg:text-3xl">
          Discover your next favorite movie or TV show
        </h3>
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
