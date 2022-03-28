import './App.css';
import {Route, Routes} from 'react-router-dom';
//may also need to add in Outlet as we progress
import NavMenu from './components/NavMenu';
import ResultsPage from './components/ResultsPage';
import SavedHaikus from "./components/SavedHaikus"
import Home from "./components/Home";


function App() {

  return (
    <div className='appContainer'>
      <NavMenu />

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/haiku" element={<Home />} />
        <Route path="/haiku/:userWord" element={<ResultsPage />} />
        <Route path="/savedHaikus" element= {<SavedHaikus />}/>
      </Routes>

    </div>
  );
}

export default App;


