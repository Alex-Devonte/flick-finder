import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Homepage from "./components/Homepage";
import SearchResults from "./components/SearchResults";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="results" element={<SearchResults />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
