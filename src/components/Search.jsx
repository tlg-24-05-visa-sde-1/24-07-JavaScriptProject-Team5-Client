import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './Search.css';


function Search() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [search, setSearch] = useState('');
 // const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [allPlayers, setAllPlayers] =useState([]);

  const positions = [
    { value: 'PG', label: 'PG' },
    { value: 'SG', label: 'SG' },
    { value: 'SF', label: 'SF' },
    { value: 'PF', label: 'PF' },
    { value: 'C', label: 'C' },
  ];

  useEffect(() => {
    fetch('http://localhost:3000/players/allPlayers')
    .then(response => response.json())
    .then(data => {
      setAllPlayers(data);
      setFilteredPlayers(data);
    })
    .catch(error => console.error('Error fetching players:', error));
  }, [])

  useEffect(() => {
    let results = allPlayers;
    // Filter by position if selected
    if (selectedPosition) {
      results = results.filter(player => player.position === selectedPosition);
    }
    // Filter by search term
    results = results.filter(player =>
      player.playerName.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredPlayers(results);
  }, [search, selectedPosition, allPlayers]);

  const handleSearchChange = (selectedOption) => {
    setSearch(selectedOption ? selectedOption.label : '');
  };

  const handlePositionChange = (position) => {
    if (selectedPosition === position) {
      setSelectedPosition(null);
    } else {
      setSelectedPosition(position);
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
            onClick={() => handlePositionChange(pos.value)}
          >
            {pos.label}
          </button>
        ))}
      </section>
      <section className='player-list'>
        <div className='display-box'>
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <div key={player._id} className='player-item'>
                <p>{player.playerName} - {player.position}</p>
                <button className='add-button'>Add</button>
              </div>
            ))
          ) : (
            <p>No players selected</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Search;

