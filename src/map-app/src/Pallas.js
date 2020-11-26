/**
Pää javascript react appiin

Luonut: Markku Nirkkonen

Päivityshistoria

Markku Nirkkonen 26.11.2020
Hallintanäkymän komponentti lisätty

Arttu Lakkala 15.11 Lisätty päivityksen lisäys segmenttiin.

**/

import * as React from "react";
import { useEffect } from 'react';
import './App.css';
import './style.css';
import Map from './NewMap';
import Manage from './Manage';
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
  const [segments, setSegments] = React.useState([]);
  //const [updates, setUpdates] = React.useState([]);
  const [shownSegment, setShownSegment] = React.useState(null);
  const [viewManagement, setViewManagement] = React.useState(false);

  //imported hooks
  const isMobile = useMediaQuery({query: '(max-width:760px)'});
  const manageOrMap = (viewManagement ? "Kartta" : "Hallitse");

  const styledClasses = useStyles();

  // after rendering segment data is fetched - should this be in some other way?
  useEffect(() => {
    const fetchData = async () => {
      const updates = await fetch('api/segments/update');
      const updateData = await updates.json();
      //console.log(updateData);
      //setUpdates(updateData);
      const response = await fetch('api/segments');
      const data = await response.json();
      data.forEach(segment => {
        segment.update = null;
        updateData.forEach(update => {
          if (update.Segmentti === segment.ID) {
            segment.update = update;
          }
        });
      });
      console.log(data)
      updateSegments(data);
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

  function updateSegments(data) {
    setSegments(data);
  }

  function updateView() {
    setViewManagement(!viewManagement);
  }

  // TODO: Styles of each component
  // TODO: Guide for segment colours
  return (
    <div className="App">
        <div className="top_bar">
          <TopBar 
            isMobile={isMobile} 
            token={token} 
            updateToken={updateToken} 
            updateView={updateView} 
            manageOrMap={manageOrMap} 
          />   
        </div>
        <div id="map">
          <div className={styledClasses.toolbar} />
            {
              (
                viewManagement 
                ?
                <Manage 
                  segments={segments}
                  token={token}
                  onUpdate={chooseSegment}
                  updateSegments={updateSegments}
                />
                :
                <Map 
                  shownSegment={shownSegment}
                  segments={segments} 
                  onClick={chooseSegment} 
                  isMobile={isMobile} 
                />
              )
            }
        </div>
        <div className="guide"></div>
        <div className="segment_info">
          <div className={styledClasses.toolbar} />
          {(shownSegment !== null && !viewManagement ? 
            <Info
              //segments={segments}
              segmentdata={shownSegment} 
              token={token}
              updateSegments={updateSegments}
              onUpdate={chooseSegment}
              onClose={chooseSegment}
            />
            :
            <div />
          )} 
        </div>
    </div>
  );
}

export default App;