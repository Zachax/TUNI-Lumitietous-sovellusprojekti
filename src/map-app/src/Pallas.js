import * as React from "react";
import { useEffect } from 'react';
import './App.css';
import './style.css';
import Map from './Map';
import Info from './Info';
import Login from './Login';
import Logout from './Logout';
import { useMediaQuery } from 'react-responsive';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


function App() {

  // Use state hooks
  const [token, setToken] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  const [segments, setSegments] = React.useState([]);
  const [shownSegment, setShownSegment] = React.useState(null);

  //imported hooks
  const isMobile = useMediaQuery({query: '(max-width:760px)'});


  // after rendering segment data is fetched - should this be in some other way?
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('api/segments');
      const data = await response.json();
      setSegments(data);
      setLoaded(true);
    };
    fetchData();
  }, []);

  // Event handler function for updating shown segment
  function chooseSegment(choice) {
    setShownSegment(choice);
  }

  function updateToken(token) {
    setToken(token);
  }

  return (
    <div className="App">
        <div className="top_bar">
          <Typography variant="h6">
            Pallaksen lumet {(isMobile ? "mobiili" : "desktop")}
          </Typography>
          <div className="admin">
            {(token === null || token === undefined ? <div /> : <Button color="inherit">Hallitse</Button>)}
          </div>
          <div id="loginlink">
            {(token === null || token === undefined ? <Login updateToken={updateToken} /> : <Logout updateToken={updateToken} />)}
          </div>     
        </div>
        <div id="map">
          <Map segments={segments} onClick={chooseSegment} loaded={loaded} isMobile={isMobile} />
        </div>
        <div className="guide"></div>
        <div className="segment_info">
          <Info segmentdata={segments[shownSegment-1]} token={token} />
        </div>
    </div>
  );
}

export default App;