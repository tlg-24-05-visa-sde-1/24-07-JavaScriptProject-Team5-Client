import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TeamGenerator from "./components/TeamGenerator";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import { UserProvider } from './UserContext';
import ManageTeam from "./components/ManageTeam";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/manage-team" element={<ManageTeam />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/teamGenerator" element={<TeamGenerator />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
