import React, { useState, useEffect } from "react";
import axios from "axios";
import NBAPlayerCard from "./NBAPlayerCard";
import halfCourtImage from '../assets/half-court.png';
import { useNavigate } from "react-router-dom";
import { useUser } from '../UserContext';
import './TeamGenerator.css'; 

const Home = () => {
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useUser();

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
        setPlayers(teamPlayers);
        console.log("Team players:", teamPlayers);

        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No team found, showing create team button");
          setTeam(null); // No team found
        } else {
          console.error('Error fetching data:', error);
          setError(`Failed to load team data. ${error.message}`);
        }
        setLoading(false);
      }
    };

    fetchTeamAndPlayers();
  }, [userId, navigate]);

  const positionStyles = [
    { top: '60%', left: '50%', transform: 'translate(-50%, -50%)' },  // Point Guard
    { top: '60%', left: '30%', transform: 'translate(-50%, -50%)' },  // Shooting Guard
    { top: '60%', left: '70%', transform: 'translate(-50%, -50%)' },  // Small Forward
    { top: '40%', left: '40%', transform: 'translate(-50%, -50%)' },  // Power Forward
    { top: '40%', left: '60%', transform: 'translate(-50%, -50%)' }   // Center
  ];

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

  return (
    <div className="full-screen-container">
      <div className="half-court-container">
        <img src={halfCourtImage} alt="Basketball Half Court" className="half-court-image" />

        {team && (
          <div className="absolute top-4 left-4 bg-white p-2 rounded shadow text-black">
            <h2 className="text-xl font-bold">{team.teamName}</h2>
          </div>
        )}

        {team ? (
          players.length > 0 ? players.map((player, index) => (
            <div key={player._id} className="absolute player-card" style={positionStyles[index]}>
              <NBAPlayerCard player={player} />
            </div>
          )) : <div className="text-white">No players found</div>
        ) : null}
      </div>
      <div className="button-container">
        <button className="manage-create-button" onClick={handleManageOrCreateTeam}>
          {team ? "Manage Team" : "Create Team"}
        </button>
      </div>
    </div>
  );
};

export default Home;
