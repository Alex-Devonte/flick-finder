import SearchBar from "./SearchBar";

function Homepage() {
  return (
    <div className="relative flex-grow bg-[url('/cinemabackdropcropped.jpg')] bg-cover bg-center p-5 sm:bg-[url('/cinemabackdropcropped.jpg')] md:bg-[url('/cinemabackdrop.jpg')]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-80"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="my-20 text-6xl font-bold text-cream lg:text-8xl">
          Welcome to Flick Finder
        </h1>
        <SearchBar />
      </div>
    </div>
  );
}

export default Homepage;
