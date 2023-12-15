import React from "react";
import { useNavigate } from 'react-router-dom';

import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';


const myIcon = new Icon({
  iconUrl: require('./location.png'),
  iconSize: [30, 30], 
});


export default function StopComponent({stop, handleStopSelect, addFavouriteStop}) {

  const  navigate = useNavigate();
    
  return (
      <Marker key={stop.KS_ID} 
              position={[parseFloat(stop.latitude), parseFloat(stop.longitude)]}
              icon={myIcon}>
        <Popup>

        <Stack gap={3}>
        
              <h5>
                {stop.title}
              </h5>

              <Button size="sm"
                        onClick={() => {
                          handleStopSelect(stop);
                          navigate("/info");
                        }}>
                  More
              </Button>

              <Button size="sm"
                        onClick={()=> addFavouriteStop(stop)}>
                Add to favorite
              </Button>
        </Stack>
        </Popup>

      </Marker>

      
  );
}
