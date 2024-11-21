import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import SearchResults from "./components/SearchResults";
import MediaDetail from "./components/MediaDetail";
import ActorDetail from "./components/ActorDetail";
import Layout from "./components/Layout";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
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
