import './App.css';
import { io } from 'socket.io-client'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard';
import { useState, createContext, useDeferredValue } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export const AppContext = createContext(null)

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(io('http://localhost:3000'))

  if (!user) {
    return (
      <AppContext.Provider value={{ user, setUser, socket, setSocket }}>
        <Router>
          <Routes>
            <Route path='/' element={<Signup />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </Router>
      </AppContext.Provider>
    )
  }

  return (
    <AppContext.Provider value={{ user, setUser, socket, setSocket }}>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />} />
        </Routes>
      </Router>
    </AppContext.Provider >
  );
}

export default App;
