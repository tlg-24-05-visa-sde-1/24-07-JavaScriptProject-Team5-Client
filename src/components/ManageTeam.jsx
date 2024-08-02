import React, { useState, useEffect } from "react";
import axios from "axios";
import halfCourtImage from "../assets/half-court.png";
import NBAPlayerCard from "./NBAPlayerCard";
import { useNavigate, useLocation } from "react-router-dom";
import "./TeamGenerator.css";
import Search from "./Search";

const ManageTeam = () => {
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [duplicates, setDuplicates] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const positionStyles = {
    PG: { bottom: "10%", left: "50%" },
    SG: { bottom: "30%", left: "20%" },
    SF: { bottom: "30%", right: "20%" },
    PF: { top: "30%", left: "30%" },
    C: { top: "20%", left: "50%" },
  };

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const teamResponse = await axios.get(
          `http://localhost:3000/teams/myTeam?userId=${userId}`
        );
        const team = teamResponse.data;
        setTeam(team);

        const playerIds = team.players.map((playerId) => playerId.toString());
        const allPlayersResponse = await axios.get(
          "http://localhost:3000/players/allPlayers"
        );
        const allPlayers = allPlayersResponse.data;

        const teamPlayers = allPlayers.filter((player) =>
          playerIds.includes(player._id)
        );

        // Handle duplicate positions
        const newDuplicates = {};
        const uniquePlayers = [];
        teamPlayers.forEach((player) => {
          if (uniquePlayers.find((p) => p.position === player.position)) {
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
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to load team data. ${error.message}`);
      }
    };

    fetchTeamAndPlayers();
  }, [userId, navigate]);

  const handleAddPlayer = async (player) => {
    if (!team) {
      setError("Team not found.");
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

  const handleRemovePlayer = async (player) => {
    try {
      await axios.delete("http://localhost:3000/players/removePlayer", {
        data: {
          playerId: player._id,
          userId,
        },
      });

      const newPlayers = players.filter((p) => p._id !== player._id);
      const newDuplicates = { ...duplicates };
      if (
        newDuplicates[player.position] &&
        newDuplicates[player.position].length > 0
      ) {
        const replacementPlayer = newDuplicates[player.position].pop();
        newPlayers.push(replacementPlayer);
        if (newDuplicates[player.position].length === 0) {
          delete newDuplicates[player.position];
        }
      }
      setPlayers(newPlayers);
      setDuplicates(newDuplicates);
    } catch (error) {
      console.error("Error removing player from team:", error);
      setError(`Failed to remove player. ${error.message}`);
    }
  };

  const handleSave = () => {
    navigate("/home", { state: { userId } });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="full-screen-container">
      <div className="half-court-container">
        <img
          src={halfCourtImage}
          alt="Basketball Half Court"
          className="half-court-image"
        />
        {players.map((player) => (
          <div
            key={player._id}
            className="absolute player-card"
            style={positionStyles[player.position]}
          >
            <NBAPlayerCard
              player={player}
              showRemoveButton={true}
              onRemove={() => handleRemovePlayer(player)}
            />
          </div>
        ))}
        {Object.entries(duplicates).map(([position, dups]) =>
          dups.map((player, index) => (
            <div
              key={player._id}
              className="absolute player-card"
              style={{
                right: "-15%",
                top: `${10 + index * 20}%`,
                transform: "none",
              }}
            >
              <NBAPlayerCard
                player={player}
                showRemoveButton={true}
                onRemove={() => handleRemovePlayer(player)}
              />
            </div>
          ))
        )}
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
