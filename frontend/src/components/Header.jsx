import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="bg-black p-5 text-left font-bold uppercase text-cream">
      <Link className="cursor-pointer text-2xl" to="/">
        Flick Finder
      </Link>
    </div>
  );
}

export default Header;
