import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { LinkContainer } from "react-router-bootstrap";


import MapComponent from "./MapComponent"
import SearchComponent from "./SearchComponent";
import InfoComponent from "./InfoComponent";
import FavouriteStopsComponent from "./FavouriteStopsComponent";

import axios from 'axios';


export default function App() {

  const [loading, setLoading] = useState(true);
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  
  const [favouriteStops, setFavouriteStops] = useState(() => {
    const saved = localStorage.getItem("favouriteStops");
    const initialValue = JSON.parse(saved);
    console.log("initialValue" + initialValue);
    return initialValue || [];
  });

  useEffect(() => { async function loadData() {
    const response = await axios("http://localhost:8000/getStopsCoord");
    const data = await response.data;
    setStops(data.stops);
    setLoading(false);
  }   
  loadData();
  }, []);


  const handleStopSelect = (stop) => { setSelectedStop(stop)};

  
  const addFavouriteStop = (stop) => { 
    let current = favouriteStops;
    current.push(stop);
    setFavouriteStops(current);
    console.log(favouriteStops);
    localStorage.setItem("favouriteStops", JSON.stringify(favouriteStops));
  }

  const removeFavouriteStop = (stop) => {
    let filtered = favouriteStops.filter(favStop => favStop["KS_ID"] !== stop["KS_ID"]);
    setFavouriteStops(filtered);
    localStorage.setItem("favouriteStops", JSON.stringify(filtered));
};


  if (loading) return <div>Please wait</div>;
  
  return (
    <>  

      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold text-muted">Transport forecast</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
            <LinkContainer to="/map">
              <Nav.Link>Map</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/search">
              <Nav.Link>Search</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/favourite">
              <Nav.Link>Favorites</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>

        <Route path="/" element= { < MapComponent stops={stops}
                                                  favouriteStops={favouriteStops}
                                                  handleStopSelect={handleStopSelect}
                                                  addFavouriteStop={addFavouriteStop}
                                                  selectedStop={selectedStop}/>}/>
                                                  
        <Route path="/map" element= { < MapComponent stops={stops}
                                                  favouriteStops={favouriteStops}
                                                  handleStopSelect={handleStopSelect}
                                                  addFavouriteStop={addFavouriteStop}
                                                  selectedStop={selectedStop}/>} />
            
        
        <Route path="/search" element= {  <SearchComponent stops={stops} 
                                                          favouriteStops={favouriteStops}
                                                          handleStopSelect={handleStopSelect}/>}/>
        
        <Route path="/info" element= { <InfoComponent selectedStop={selectedStop}/>}/>
        
        <Route path="/favourite" element = {< FavouriteStopsComponent favouriteStops={favouriteStops}
                                                                      removeFavouriteStop={removeFavouriteStop}
                                                                      handleStopSelect={handleStopSelect}/>}/>
        
      </Routes>
    </>
  );
}
