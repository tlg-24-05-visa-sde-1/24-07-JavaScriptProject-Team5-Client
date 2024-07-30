import React from 'react'
import Search from './Search'
import './TeamGenerator.css'

function TeamGenerator() {

  const handleSelectedPosition = (position) => {
    console.log("selected position", position)
  }
  return (
    <div className='team-generator-background'>
      <Search onPositionChange={handleSelectedPosition}/>
      </div>
  )
}

export default TeamGenerator