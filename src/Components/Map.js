import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, useMap} from 'react-leaflet';
import L from "leaflet";

import 'leaflet/dist/leaflet.css';

import StopComponent from './Stop.js';

const center = [53.211967, 50.177502];

function ResetCenterView({ selectedStop }) {
  const map = useMap();

  const [selectPosition, setSelectPosition] = useState();
 
  useEffect(()=> {
    let position = null;
    console.log(selectedStop);
    if (selectedStop !== null ) {
      position = [parseFloat(selectedStop.latitude), parseFloat(selectedStop.longitude)];
    }
    console.log(position);
    setSelectPosition(position);
    
  }, [selectedStop])

  useEffect(() => {
    if (selectPosition && selectPosition?.length === 2) {
      map.setView(
        new L.latLng(selectPosition[0], selectPosition[1]),
        16,
        {
          animate: true
        }
      )
    }
  }, [selectPosition]);
  
  return null;
}


const MapComponent = ( { stops, handleStopSelect, selectedStop, addFavouriteStop } ) => {

  return (
      <MapContainer 
        center={center} 
        zoom={12} 
        
        style={{ height: '95vh', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          { stops.map(stop => (
          < StopComponent key={stop.KS_ID} 
                          stop={stop}
                          handleStopSelect = {handleStopSelect}
                          addFavouriteStop = {addFavouriteStop}/>
          )) }

        <ResetCenterView selectedStop={selectedStop}/>

      </MapContainer> 
  );
};


export default MapComponent;