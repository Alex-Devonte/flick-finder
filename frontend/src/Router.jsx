import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Homepage from "./components/Homepage";
import SearchResults from "./components/SearchResults";
import MediaDetail from "./components/MediaDetail";
import ActorDetail from "./components/ActorDetail";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="results" element={<SearchResults />} />
          <Route path="/details/media/:id" element={<MediaDetail />} />
          <Route path="/details/people/:id" element={<ActorDetail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
