import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

function Homepage() {
  return (
    <div className="relative flex-grow bg-[url('/cinemabackdropcropped.jpg')] bg-cover bg-center p-5 sm:bg-[url('/cinemabackdropcropped.jpg')] md:bg-[url('/cinemabackdrop.jpg')]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-80"></div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 className="my-20 text-6xl font-bold text-cream lg:text-8xl">
          Welcome to Flick Finder
        </h1>
        <div className="flex w-full rounded-lg outline-dark-cream focus-within:outline md:w-[80%] lg:w-[45%]">
          <input
            type="search"
            placeholder="Search for a movie or actor. . ."
            className="flex-1 rounded-l-lg border-none p-3 text-charcoal outline-none"
          />
          <button
            type="button"
            className="rounded-r-lg bg-dark-cream p-3 hover:bg-light-cream"
          >
            <Icon path={mdiMagnify} size={1} className="text-charcoal" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
