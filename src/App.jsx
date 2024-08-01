import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TeamGenerator from "./components/TeamGenerator";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <nav className="navbar navbar-expand-sm navbar-light">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/teamGenerator">Team Generator</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/teamGenerator" element={<TeamGenerator />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
