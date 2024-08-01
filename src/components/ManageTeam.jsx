import React, { useState, useEffect } from 'react';
import axios from 'axios';
import halfCourtImage from '../assets/half-court.png';
import NBAPlayerCard from './NBAPlayerCard';
import { useNavigate, useLocation } from 'react-router-dom';
import './TeamGenerator.css';
import Search from './Search';

const ManageTeam = () => {
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([null, null, null, null, null]);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const teamResponse = await axios.get(`http://localhost:3000/teams/myTeam?userId=${userId}`);
        const team = teamResponse.data;
        setTeam(team);

        const playerIds = team.players.map(playerId => playerId.toString());
        const allPlayersResponse = await axios.get('http://localhost:3000/players/allPlayers');
        const allPlayers = allPlayersResponse.data;

        const teamPlayers = allPlayers.filter(player => playerIds.includes(player._id));
        setPlayers(teamPlayers);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const handleAddPlayer = async (player, position) => {
    if (!team) {
      alert("Team not found.");
      return;
    }

    try {
      await axios.put('http://localhost:3000/players/addPlayer', {
        playerId: player._id,
        userId
      });

      const newPlayers = [...players];
      newPlayers[position] = player;
      setPlayers(newPlayers);
    } catch (error) {
      console.error('Error adding player to team:', error);
    }
  };

  const handleRemovePlayer = async (player) => {
    try {
      await axios.delete('http://localhost:3000/players/removePlayer', {
        data: {
          playerId: player._id,
          userId
        }
      });

      const newPlayers = players.map((p, index) => (p && p._id === player._id ? null : p));
      setPlayers(newPlayers);
    } catch (error) {
      console.error('Error removing player from team:', error);
    }
  };

  const handleSave = () => {
    navigate('/home', { state: { userId } });
  };

  return (
    <div className="full-screen-container">
      <div className="half-court-container">
        <img src={halfCourtImage} alt="Basketball Half Court" className="half-court-image" />
        {players.map((player, index) => player && (
          <div key={player._id} className="absolute player-card" style={positionStyles[index]}>
            <NBAPlayerCard player={player} showRemoveButton={true} onRemove={() => handleRemovePlayer(player)} />
          </div>
        ))}
      </div>
      <div className="search-container">
        <Search onAddPlayer={handleAddPlayer} />
        <button className="finish-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ManageTeam;
