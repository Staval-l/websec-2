import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';


const PredictionForTransport = ({onHide, show, transport_id}) => {

    const [predictions, setPredictions] = useState([]);

    const loadPredictionForTransport = async(hullNo) => {
        if (hullNo) {
           axios("http://localhost:8000/getTransportPosition", {params: {hullNo: hullNo}} ).then(response => {
              setPredictions(response.data["nextStops"]);
           }); 
        }
    }

    useEffect(() => {
        loadPredictionForTransport(transport_id);
        console.log("loaded" + predictions);
    }, [transport_id]);


    return (
      <Modal
        onHide={onHide}
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Forecast for selected transportation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
          
              {predictions && predictions.map(prediction => {
                return (
                  <ListGroup.Item key={parseInt(prediction["KS_ID"])}>
                    <p>Stop's name: {prediction["title"]} </p>
                    <p>Time to arrival: 
                    {parseInt(prediction["time"]) / 60 > 0 ? " " + parseInt(prediction["time"] / 60) + " min " : " "}
                    {parseInt(prediction["time"] % 60) + " sec" }</p>
                  </ListGroup.Item>
                )
              })}
            
          </ListGroup>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  export default PredictionForTransport;