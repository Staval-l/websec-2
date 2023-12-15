import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';

import PredictionForTransport from './Prediction';


const InfoComponent = ({selectedStop}) => {
   const [stopInfo, setStopInfo] = useState();
   const [predictionForStop, setPredictionForStop] = useState();
   const [predictionShow, setPredictionShow] = useState(false);
   const [selectedTransport, setSelectedTransport] = useState("");


   const loadDataByID = async(stop) => {
      if (stop) {
         let ks_id = stop["KS_ID"];
         const response = await axios("http://localhost:8000/getStopById", {params: {KS_ID: ks_id}} );
         const data = await response.data;
         return data;
      }
    };

   const loadFirstArrivalToStop = async(stop) => {
      if (stop) {
         let ks_id = stop["KS_ID"];
         const response = await axios("http://localhost:8000/getFirstArrivalToStop", {params: {KS_ID: ks_id}} );
         const data = await response.data;
         return data; 
      }
   }

   useEffect(() => {
      loadDataByID(selectedStop).then(result => {setStopInfo(result)});
   }, [selectedStop]);
   
   
   useEffect(()=> {
      loadFirstArrivalToStop(selectedStop).then(result => {setPredictionForStop(result)});
   }, [selectedStop]);
   

   if (!stopInfo) return (<div>...</div>)

   return (
      <>

         <Container>
            <Row>
               <Col>
                  <h2>Info about stop</h2>

                  {stopInfo["title"] && <p>Title: {stopInfo["title"]}</p>}
                  {stopInfo["adjacentStreet"] && <p>Street: {stopInfo["adjacentStreet"]}</p>}
                  {stopInfo["direction"] && <p>Direction: {stopInfo["direction"]}</p>}
                  {stopInfo["busesMunicipal"] && <p>Municipal buses: {stopInfo["busesMunicipal"]}</p>}
                  {stopInfo["busesCommercial"] && <p>Commercial buses: {stopInfo["busesCommercial"]}</p>}
                  {stopInfo["busesPrigorod"] && <p>Prigorod buses: {stopInfo["busesPrigorod"]}</p>}
                  {stopInfo["busesSeason"] && <p>Season buses: {stopInfo["busesSeason"]}</p>}
                  {stopInfo["busesSpecial"] && <p>Special buses: {stopInfo["busesSpecial"]}</p>}
                  {stopInfo["busesIntercity"] && <p>Intercity buses: {stopInfo["busesIntercity"]}</p>}
                  {stopInfo["trams"] && <p>Trams: {stopInfo["trams"]}</p>}
                  {stopInfo["trolleybuses"] && <p>Trolleybuses: {stopInfo["trolleybuses"]}</p>}
                  {stopInfo["metros"] && <p>Metro: {stopInfo["metros"]}</p>}
                  {stopInfo["electricTrains"] && <p>Trains: {stopInfo["electricTrains"]}</p>}
                  {stopInfo["riverTransports"] && <p>River transport: {stopInfo["riverTransports"]}</p>}
               </Col>
               <Col>
                  <h2>Forecast</h2>
                  <ListGroup> 
                     {predictionForStop && predictionForStop.result.map(prediction => (
                        < ListGroup.Item 
                              action
                              key={parseInt(prediction["hullNo"])} 
                              onClick={() => {
                                 setSelectedTransport(prediction["hullNo"]);
                                 console.log(prediction["hullNo"]);
                                 setPredictionShow(true);
                                 }}>
                           <p>Transport type: {prediction["type"]}</p>
                           <p>Route number: {prediction["number"]}</p>
                           <p>Serving time: {
                              parseInt(prediction["time"] / 60) > 0 ? 
                              parseInt(prediction["time"] / 60) + " h " : "" } 
                              {parseInt(prediction["time"] % 60) + " min"}
                           </p>
                        </ListGroup.Item>
                     ))}
                  </ListGroup> 
               </Col>
            </Row>
            
         </Container>
      

         <PredictionForTransport
            show={predictionShow}
            onHide={() => setPredictionShow(false)}
            transport_id={selectedTransport}
         />

      </>
   );
};

export default InfoComponent;