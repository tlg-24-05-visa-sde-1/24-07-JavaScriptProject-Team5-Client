import React from 'react'
import Search from './Search'
import './TeamGenerator.css'
import halfCourtPicture from '../assets/half-court.png'

function TeamGenerator() {

  const handleSelectedPosition = (position) => {
    console.log("selected position", position)
  }
  return (
    <div className='team-generator-background'>
      <Search onPositionChange={handleSelectedPosition}/>
      <img src={halfCourtPicture} alt ="half court" className='half-court-image'/>
      </div>
  )
}

export default TeamGenerator