import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Results from './Pages/Results';
import Browse from './Pages/Browse';
import Checkout from './Pages/Checkout';
import './App.css';

function App() {
  return (
    <Router basename="/movieflix">
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results/:searchTerm" element={<Results />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/checkout/:movieId" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
