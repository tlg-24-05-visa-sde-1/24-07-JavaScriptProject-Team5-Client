import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import TeamGenerator from './components/TeamGenerator'


function Home(){
  return <h1>Home</h1>
}

function App() {
  return (
    
    <Router>
      <nav className='navbar navbar-expand-sm navbar-light'>
        <ul>
          <Link to="/">Home</Link>
        </ul>
        <ul>
          <li>
            <Link to="/teamGenerator">Team Generator</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="teamGenerator" element={<TeamGenerator/>}/>
      </Routes>
    </Router>
  )
}

export default App
