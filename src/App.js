import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from "./Components/SignUpPage";
import LoginPage from "./Components/LoginPage"
import HomePage from "./Components/HomePage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path = "/login" element = {<LoginPage/>}/>
        <Route path = "/" element = {<HomePage/>} />
      </Routes>
    </Router>
  );
}

export default App;
