import React from 'react'; // useState -> serve para a criacao de estados

import './App.css'; 

import logo from './assets/logo.svg';

import Routes from './routes';

function App() {
  

  return (
    <div className="container">
      <img src={logo} alt="AirCnC"/>

      <div className="content">
        <Routes />
      </div>
    </div>
  );
}

export default App;
