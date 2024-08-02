import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './Search.css';

function Search({ onAddPlayer }) {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState('');

  const positions = [
    { value: 'PG', label: 'PG' },
    { value: 'SG', label: 'SG' },
    { value: 'SF', label: 'SF' },
    { value: 'PF', label: 'PF' },
    { value: 'C', label: 'C' },
  ];

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/players/allPlayers')
      .then(response => response.json())
      .then(data => {
        setAllPlayers(data);
        setFilteredPlayers(data);
      })
      .catch(error => console.error('Error fetching players:', error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let results = allPlayers;
    
    if (selectedPosition) {
      results = results.filter(player => player.position === selectedPosition);
    }

    results = results.filter(player =>
      player.playerName.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredPlayers(results);
  }, [search, selectedPosition, allPlayers]);

  useEffect(() => {
    let dotCount = 0;
    if (loading) {
      const interval = setInterval(() => {
        setDots(prev => {
          const newDots = '.'.repeat((dotCount % 3) + 1);
          dotCount++;
          return newDots;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setDots('');
    }
  }, [loading]);

  const handleSearchChange = (selectedOption) => {
    setSearch(selectedOption ? selectedOption.label : '');
  };

  const handlePositionChange = (position) => {
    if (selectedPosition === position.value) {
      setSelectedPosition(null);
    } else {
      setSelectedPosition(position.value);
    }
  };

  const handleAddPlayerClick = (player) => {
    if (onAddPlayer) {
      const positionIndex = positions.findIndex(pos => pos.value === selectedPosition);
      if (positionIndex !== -1) {
        onAddPlayer(player, positionIndex);
      } else {
        alert("Please select a position first.");
      }
    }
  };

  return (
    <div>
      <h1>Search Player by name or select by position</h1>
      <div className='player-search-container'>
        <Select
          placeholder="Search By Name"
          className='search-bar'
          options={allPlayers.map(player => ({
            value: player._id,
            label: player.playerName,
          }))}
          onChange={handleSearchChange}
          isClearable
        />
      </div>
      <section className='position-buttons-container'>
        {positions.map((pos) => (
          <button
            key={pos.value}
            className={`position-button ${selectedPosition === pos.value ? 'active' : ''}`}
            onClick={() => handlePositionChange(pos)}
          >
            {pos.label}
          </button>
        ))}
      </section>
      <section className='player-list'>
        <div className='display-box'>
          {loading ? (
            <p>Loading Players{dots}</p>
          ) : filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <div key={player._id} className='player-item'>
                <p>{player.playerName} - {player.position}</p>
                <button className='add-button' onClick={() => handleAddPlayerClick(player)}>Add</button>
              </div>
            ))
          ) : (
            <p>No players found</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Search;
