import { useEffect } from 'react';
import './App.css';
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";

import Dashboard from './components/Dashboard'
import SignUp from './components/accounts/SignUp'
import SignIn from './components/accounts/SignIn'
import Profile from './components/accounts/Profile';


const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? (
    children
  ) : (
    <Navigate to="/signin" />
  )
}


function App() {
  let head = document.getElementsByTagName("head")[0];
  let insertBefore = head.insertBefore;
  head.insertBefore = function (newElement, referenceElement) {
    if (newElement.href && newElement.href.indexOf("//fonts.googleapis.com/css?family=Roboto") > -1) {
     return;
    }
    insertBefore.call(head, newElement, referenceElement);
  };

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <BrowserRouter>
        <Routes>
            <Route path="/" exact element={<PrivateRoute> <Dashboard/> </PrivateRoute>}/>
            <Route path="/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>}/>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<PrivateRoute> <Dashboard/> </PrivateRoute>}/>
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;
