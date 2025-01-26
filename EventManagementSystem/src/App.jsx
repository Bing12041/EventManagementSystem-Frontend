import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EventList from './pages/EventList';
import CreateEvent from './pages/CreateEvent';
import ManageLocation from './pages/ManageLocation';
import ManageCategory from './pages/ManageCategory';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/manage-location" element={<ManageLocation />} />
            <Route path="/manage-category" element={<ManageCategory />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;