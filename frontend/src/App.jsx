import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Homepage from "./components/Homepage";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Homepage />
      <Footer />
    </div>
  );
}

export default App;
