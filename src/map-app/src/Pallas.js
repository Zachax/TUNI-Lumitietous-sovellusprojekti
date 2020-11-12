import * as React from "react";
import { useEffect } from 'react';
import './App.css';
import './style.css';
import Map from './NewMap';
import Info from './Info';
import TopBar from './TopBar';
import { useMediaQuery } from 'react-responsive';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar
}));

function App() {

  // Use state hooks
  const [token, setToken] = React.useState(null);
  //const [loaded, setLoaded] = React.useState(false);
  const [segments, setSegments] = React.useState([]);
  const [updates, setUpdates] = React.useState([]);
  const [shownSegment, setShownSegment] = React.useState(null);

  //imported hooks
  const isMobile = useMediaQuery({query: '(max-width:760px)'});

  const styledClasses = useStyles();

  // after rendering segment data is fetched - should this be in some other way?
  useEffect(() => {
    const fetchData = async () => {
      const updates = await fetch('api/segments/update');
      const updateData = await updates.json();
      console.log(updateData);
      setUpdates(updateData);
      const response = await fetch('api/segments');
      const data = await response.json();
      setSegments(data);
      //setLoaded(true);
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
          <TopBar isMobile={isMobile} token={token} updateToken={updateToken} />   
        </div>
        <div id="map">
          <div className={styledClasses.toolbar} />

            <Map 
              segments={segments} 
              onClick={chooseSegment} 
              //loaded={loaded} 
              isMobile={isMobile} 
            />

        </div>
        <div className="guide"></div>
        <div className="segment_info">
          <div className={styledClasses.toolbar} />
          {(shownSegment !== null ? 
            <Info
              updates={updates}
              segmentdata={shownSegment} 
              token={token} 
            />
            :
            <div />
          )}
          
        </div>
    </div>
  );
}

export default App;