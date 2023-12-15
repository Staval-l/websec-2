import React, { useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const FavouriteStopsComponent = ({favouriteStops, removeFavouriteStop, handleStopSelect}) => {
    const  navigate = useNavigate();

    if (favouriteStops.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <h3>
                    Empty
                </h3>
            </div>
        )
    }

    return (
        <ListGroup>
            {favouriteStops && favouriteStops.map(stop => {
                return (
                    <ListGroup.Item 
                        className="d-flex justify-content-center align-items-center"
                        key={stop["KS_ID"]}>
                        {stop["title"]}

                        <Button 
                            variant="info"
                            size="sm"
                            onClick={() => {
                                handleStopSelect(stop);
                                navigate("/info");
                            }}
                            style={{ marginLeft: '20px' }}
                        >
                            Go to
                        </Button>

                        <Button 
                            variant="dark"
                            size="sm"
                            onClick={() => removeFavouriteStop(stop)}
                            style={{ marginLeft: '20px' }}
                        >
                            Remove
                        </Button>
                    </ListGroup.Item>
                )         
            })}
            
        </ListGroup>
     );
}

export default FavouriteStopsComponent