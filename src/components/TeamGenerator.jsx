import React, { useState, useEffect } from 'react';
import axios from 'axios';
import halfCourtImage from '../assets/half-court.png';
import NBAPlayerCard from './NBAPlayerCard';
import { useNavigate, useLocation } from 'react-router-dom';
import './TeamGenerator.css';
import Search from './Search';

const TeamGenerator = () => {
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState(null);
  const [players, setPlayers] = useState([null, null, null, null, null]);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const positionStyles = [
    { top: '60%', left: '50%', transform: 'translate(-50%, -50%)' },  // Point Guard
    { top: '60%', left: '30%', transform: 'translate(-50%, -50%)' },  // Shooting Guard
    { top: '60%', left: '70%', transform: 'translate(-50%, -50%)' },  // Small Forward
    { top: '40%', left: '40%', transform: 'translate(-50%, -50%)' },  // Power Forward
    { top: '40%', left: '60%', transform: 'translate(-50%, -50%)' }   // Center
  ];

  const handleAddPlayer = async (player, position) => {
    if (!teamId) {
      alert("Please create a team first.");
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

  const handleCreateTeam = async () => {
    try {
      const response = await axios.post('http://localhost:3000/teams/createTeam', {
        teamName,
        userId
      });
      const team = response.data;
      console.log('Team created:', team);
      setTeamId(team._id);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleFinish = () => {
    navigate('/home', { state: { userId } });
  };

  return (
    <div className="full-screen-container">
      <div className="half-court-container">
        <img src={halfCourtImage} alt="Basketball Half Court" className="half-court-image" />
        {players.map((player, index) => player && (
          <div key={player._id} className="absolute player-card" style={positionStyles[index]}>
            <NBAPlayerCard player={player} />
          </div>
        ))}
      </div>
      <div className="search-container">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="team-name-input"
          disabled={teamId !== null}
        />
        <button
          className="create-team-button"
          onClick={handleCreateTeam}
          disabled={teamId !== null}
        >
          {teamId ? "Team Created" : "Create Team"}
        </button>
        <Search onAddPlayer={handleAddPlayer} />
        <button className="finish-button" onClick={handleFinish}>
          Finish
        </button>
      </div>
    </div>
  );
};

export default TeamGenerator;
