import React, {useState} from 'react'
import Select from 'react-select'
import './Search.css'


function Search() {
    const [selectedPosition, setSelectedPosition] = useState(null)

    const position = [
      {value: 'PG', label:'PG'},
      {value: 'SG', label:'SG'},
      {value: 'SF', label:'SF'},
      {value: 'PF', label:'PF'},
      {value: 'C', label:'C'},
    ];
  
    const handleSelectedPosition = (position) => {
      setSelectedPosition(position);
      onPositionChange(position);
    }

   
  return (
    <div className='team-generator-background'>
        <h1>Search Player by name or select by position</h1>
      <div className='player-search-container'>
        <Select
        placeholder="Search By Name"
        className='search-bar'
        />  
      </div>
      <div className='position-buttons-container'>
      {position.map((pos)=>
      <button
      key={pos.value}
      className={`position-button ${selectedPosition === pos.value ? 'active' : ''}`}
      onClick={() => handleSelectedPosition(pos.value)}
      >
        {pos.label}
      </button>
      )}
      </div>
    </div>
  )
}

export default Search