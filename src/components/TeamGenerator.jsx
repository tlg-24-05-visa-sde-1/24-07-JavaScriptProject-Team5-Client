import React, { useState } from "react";
import axios from "axios";
import halfCourtImage from "../assets/half-court.png";
import NBAPlayerCard from "./NBAPlayerCard";
import { useNavigate, useLocation } from "react-router-dom";
import "./TeamGenerator.css";
import Search from "./Search";

const TeamGenerator = () => {
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [duplicates, setDuplicates] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const positionStyles = {
    PG: { gridArea: 'pg' },
    SG: { gridArea: 'sg' },
    SF: { gridArea: 'sf' },
    PF: { gridArea: 'pf' },
    C: { gridArea: 'c' }
  };

  const handleAddPlayer = async (player) => {
    if (!teamId) {
      setError("Please create a team first.");
      return;
    }

    try {
      await axios.put("http://localhost:3000/players/addPlayer", {
        playerId: player._id,
        userId,
      });

      const existingPlayer = players.find(
        (p) => p.position === player.position
      );
      if (existingPlayer) {
        const newDuplicates = { ...duplicates };
        if (!newDuplicates[player.position]) {
          newDuplicates[player.position] = [];
        }
        newDuplicates[player.position].push(existingPlayer);
        setDuplicates(newDuplicates);
        setPlayers(
          players.map((p) => (p._id === existingPlayer._id ? player : p))
        );
      } else {
        setPlayers([...players, player]);
      }
    } catch (error) {
      console.error("Error adding player to team:", error);
      setError(`Failed to add player. ${error.message}`);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/teams/createTeam",
        {
          teamName,
          userId,
        }
      );
      const team = response.data;
      console.log("Team created:", team);
      setTeamId(team._id);
      setError(null);
    } catch (error) {
      console.error("Error creating team:", error);
      setError(`Failed to create team. ${error.message}`);
    }
  };

  const handleFinish = () => {
    if (players.length < 5) {
      setError("Please add at least 5 players to your team before finishing.");
      return;
    }
    navigate("/home", { state: { userId } });
  };

  return (
    <div className="full-screen-container">
      <div className="half-court-container">
        <img
          src={halfCourtImage}
          alt="Basketball Half Court"
          className="half-court-image"
        />
        <div className="grid-container">
          {players.map((player) => (
            <div
              key={player._id}
              className="player-card"
              style={positionStyles[player.position]}
            >
              <NBAPlayerCard player={player} />
            </div>
          ))}
          {Object.entries(duplicates).map(([position, dups]) =>
            dups.map((player, index) => (
              <div
                key={player._id}
                className="duplicate-player-card"
                style={{ top: `${10 + index * 20}%` }}
              >
                <NBAPlayerCard player={player} />
              </div>
            ))
          )}
        </div>
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
        {error && <div className="error-message">{error}</div>}
        <Search onAddPlayer={handleAddPlayer} />
        <button
          className="finish-button"
          onClick={handleFinish}
          disabled={players.length < 5 || !teamId}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default TeamGenerator;
