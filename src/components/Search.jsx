import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import './Search.css'


const playerList = [
    { id: 1, name: 'LeBron James', position: 'SF', team: 'Los Angeles Lakers' },
    { id: 2, name: 'Kevin Durant', position: 'PF', team: 'Phoenix Suns' },
    { id: 3, name: 'Stephen Curry', position: 'PG', team: 'Golden State Warriors' },
    { id: 4, name: 'James Harden', position: 'SG', team: 'Los Angeles Clippers' },
    { id: 5, name: 'Joel Embiid', position: 'C', team: 'Philadelphia 76ers' },
    { id: 6, name: 'Kawhi Leonard', position: 'SF', team: 'Los Angeles Clippers' },
    { id: 7, name: 'Giannis Antetokounmpo', position: 'PF', team: 'Milwaukee Bucks' },
    { id: 8, name: 'Luka Dončić', position: 'PG', team: 'Dallas Mavericks' },
    { id: 9, name: 'Damian Lillard', position: 'PG', team: 'Portland Trail Blazers' },
    { id: 10, name: 'Nikola Jokić', position: 'C', team: 'Denver Nuggets' },
    { id: 11, name: 'Zion Williamson', position: 'PF', team: 'New Orleans Pelicans' },
    { id: 12, name: 'Anthony Davis', position: 'PF', team: 'Los Angeles Lakers' },
    { id: 13, name: 'Jayson Tatum', position: 'SF', team: 'Boston Celtics' },
    { id: 14, name: 'Trae Young', position: 'PG', team: 'Atlanta Hawks' },
    { id: 15, name: 'Jimmy Butler', position: 'SF', team: 'Miami Heat' },
    { id: 16, name: 'Devin Booker', position: 'SG', team: 'Phoenix Suns' },
    { id: 17, name: 'Ja Morant', position: 'PG', team: 'Memphis Grizzlies' },
    { id: 18, name: 'Karl-Anthony Towns', position: 'C', team: 'Minnesota Timberwolves' },
    { id: 19, name: 'Paul George', position: 'SF', team: 'Philadelphia 76ers' },
    { id: 20, name: 'Cade Cunningham', position: 'PG', team: 'Detroit Pistons' },
    { id: 21, name: 'Shai Gilgeous-Alexander', position: 'SG', team: 'Oklahoma City Thunder' },
    { id: 22, name: 'Evan Mobley', position: 'PF', team: 'Cleveland Cavaliers' },
    { id: 23, name: 'Pascal Siakam', position: 'PF', team: 'Toronto Raptors' },
    { id: 24, name: 'Rudy Gobert', position: 'C', team: 'Minnesota Timberwolves' },
    { id: 25, name: 'Jalen Green', position: 'SG', team: 'Houston Rockets' }
];




function Search() {
    const [selectedPosition, setSelectedPosition] = useState(null)
    const [filteredPlayers, setFilteredPlayers] = useState(playerList)
    const [search, setSearch] = useState('')
    const [selectedPlayers, setSelectedPlayers] =useState([])

    const position = [
      {value: 'PG', label:'PG'},
      {value: 'SG', label:'SG'},
      {value: 'SF', label:'SF'},
      {value: 'PF', label:'PF'},
      {value: 'C', label:'C'},
    ];

    useEffect(() => {
        let results = playerList;
        // Filter by position if selected
        if (selectedPosition) {
            results = results.filter(player => player.position === selectedPosition);
        }
        // Filter by search term
        results = results.filter(player =>
            player.name.toLowerCase().includes(search.toLowerCase())
        );

        setFilteredPlayers(results);
    }, [search, selectedPosition]);

    const handleSearchChange = (selectedOption) => {
        setSearch(selectedOption ? selectedOption.label : '');
    };

    const handlePositionChange = (position) => {
        if(selectedPosition === position){
            setSelectedPosition(null)
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
            options={playerList.map(player => ({
                value: player.id,
                label: player.name
            }))}
            onChange={handleSearchChange}
            isClearable
        />
    </div>
      <section className='position-buttons-container'>
      {position.map((pos)=>
      <button
      key={pos.value}
      className={`position-button ${selectedPosition === pos.value ? 'active' : ''}`}
      onClick={() => handlePositionChange(pos.value)}
      >
        {pos.label}
      </button>
      
      )}
      </section>
      <section className='player-list'>
        <div className='display-box'>
        {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <div key={player.id} className='player-item'>
                <p>{player.name} - {player.position} </p>
                <button className='add-button'>Add</button>
              </div>
            ))
          ) : (
            <p>No players selected</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Search