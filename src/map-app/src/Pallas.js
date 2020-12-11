/**
Pää javascript react appiin

Luonut: Markku Nirkkonen

Päivityshistoria
11.12. Lisättiin lumilaadun ja alasegmentin tiedot hakujen parsimiseen

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
  toolbar: theme.mixins.toolbar,
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
      const snow = await fetch('api/lumilaadut');
      const snowdata = await snow.json();
      const updates = await fetch('api/segments/update');
      const updateData = await updates.json();
      const response = await fetch('api/segments');
      const data = await response.json();
      
      await updateData.forEach(update => {
        snowdata.forEach(snow => {
          if(snow.ID === update.Lumilaatu){
            update.Lumi = snow;
          }
        });
      });
      
      data.forEach(segment => {
        segment.update = null;
        updateData.forEach(update => {
          if (update.Segmentti === segment.ID) {
            segment.update = update;
          }
        });
        if(segment.On_Alasegmentti != null)
        {
          data.forEach(mahd_yla_segmentti => {
            if(mahd_yla_segmentti.ID === segment.On_Alasegmentti){
              segment.On_Alasegmentti = mahd_yla_segmentti.Nimi;
            }
          });
        }
      });
      console.log(data);
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
    <div className="app">
        <div className="top_bar">
          <TopBar 
            isMobile={isMobile} 
            token={token} 
            updateToken={updateToken} 
            updateView={updateView}
            viewManagement={viewManagement} 
            manageOrMap={manageOrMap} 
          />   
        </div>
        <div className="map_container">
          {/* <div className={styledClasses.toolbar} /> */}
            {
              (
                viewManagement 
                ?
                <Manage 
                  segments={segments}
                  token={token}
                  onUpdate={chooseSegment}
                  updateSegments={updateSegments}
                  shownSegment={shownSegment}
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
          {/* <div className={styledClasses.toolbar} /> */}
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