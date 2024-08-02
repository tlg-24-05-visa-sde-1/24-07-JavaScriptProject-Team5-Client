import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NBAPlayerCard from "./NBAPlayerCard";
import halfCourtImage from '../assets/half-court.png';
import { useNavigate } from "react-router-dom";
import { useUser } from '../UserContext';
import './TeamGenerator.css';

const Home = () => {
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [duplicates, setDuplicates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useUser();

  const positionStyles = {
    PG: { bottom: '10%', left: '50%' },
    SG: { bottom: '30%', left: '20%' },
    SF: { bottom: '30%', right: '20%' },
    PF: { top: '30%', left: '30%' },
    C: { top: '20%', left: '50%' }
  };

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      console.log("Current userId:", userId);
      if (!userId) {
        console.log("No userId found, redirecting to login");
        navigate('/login');
        return;
      }

      try {
        console.log("Fetching team data for userId:", userId);
        const teamResponse = await axios.get(`http://localhost:3000/teams/myTeam?userId=${userId}`);
        const team = teamResponse.data;
        setTeam(team);
        console.log("Team data:", team);

        const playerIds = team.players.map(playerId => playerId.toString());
        const allPlayersResponse = await axios.get('http://localhost:3000/players/allPlayers');
        const allPlayers = allPlayersResponse.data;
        console.log("All players data:", allPlayers);

        const teamPlayers = allPlayers.filter(player => playerIds.includes(player._id));


        const newDuplicates = {};
        const uniquePlayers = [];
        teamPlayers.forEach(player => {
          if (uniquePlayers.find(p => p.position === player.position)) {
            if (!newDuplicates[player.position]) {
              newDuplicates[player.position] = [];
            }
            newDuplicates[player.position].push(player);
          } else {
            uniquePlayers.push(player);
          }
        });

        setPlayers(uniquePlayers);
        setDuplicates(newDuplicates);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No team found, showing create team button");
          setTeam(null); 
        } else {
          console.error('Error fetching data:', error);
          setError(`Failed to load team data. ${error.message}`);
        }
        setLoading(false);
      }
    };

    fetchTeamAndPlayers();
  }, [userId, navigate]);

  const handleManageOrCreateTeam = () => {
    if (team) {
      navigate('/manage-team', { state: { userId } });
    } else {
      navigate('/teamGenerator', { state: { userId } });
    }
  };

  if (loading) {
    return <div>Loading your team...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/">
              <button className="nav-button">Home</button>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/teamGenerator">
              <button className="nav-button">Team Generator</button>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="full-screen-container">
        <div className="half-court-container">
          <img src={halfCourtImage} alt="Basketball Half Court" className="half-court-image" />
          {team && (
            <div className="absolute top-4 left-4 bg-white p-2 rounded shadow text-black">
              <h2 className="text-xl font-bold">Team {team.teamName}</h2>
            </div>
          )}
          {players.map((player) => (
            <div key={player._id} className="absolute player-card" style={positionStyles[player.position]}>
              <NBAPlayerCard player={player} />
            </div>
          ))}
          {Object.entries(duplicates).map(([position, dups]) => (
  dups.map((player, index) => (
    <div
      key={player._id}
      className="absolute player-card"
      style={{
        right: '-15%',
        top: `${10 + (index * 20)}%`,
        transform: 'none'
      }}
    >
      <NBAPlayerCard player={player} />
    </div>
  ))
))}
        </div>
        <div className="info-container">
          <div className="button-container">
            <button className="manage-create-button" onClick={handleManageOrCreateTeam}>
              {team ? "Manage Team" : "Create Team"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
