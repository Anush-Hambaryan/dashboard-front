import React, {useRef, useEffect} from 'react'
import GoogleMapReact from "google-map-react";
import { mdiMapMarkerOutline, mdiGoogleMaps} from '@mdi/js';
import Icon from '@mdi/react';
import {Paper, Typography } from "@mui/material";
import ReportDialog from './ReportDialog';

function mapOptionsCreator(map) {
  return  { 
    fullscreenControl: false, 
    zoomControlOptions: { 
      position: map.ControlPosition.LEFT_BOTTOM,
    } 
  }
}

const shapeOptions = {
    draggable: true,
    strokeWeight: 2,
    clickable: true,
    editable: true,
    strokeColor: "#606060",
  }

function Map({ drawingManager, mapsRef, circleButton, polygonButton, setRadius, setCoords, standardJobReports, job5Running, job5Reports }) {

    const polygonVertices = useRef(null);
    const currentShape = useRef(null);
    const currentMap = useRef(null);
    const job5ReportsShapes = useRef([]);
  
    const getPolygonCoordinates = () => {
      let polygonCoords = [];
      for (let i = 0; i < polygonVertices.current.getLength(); i++) {
        const xy = polygonVertices.current.getAt(i);
        polygonCoords.push({
          "lat": xy.lat().toFixed(6),
          "lng": xy.lng().toFixed(6),
        })
      }
      setCoords(polygonCoords);
    }

    const handleApiLoaded = (map, maps) => {
      mapsRef.current = maps;
      currentMap.current = map;
      drawingManager.current = new maps.drawing.DrawingManager({
        drawingControl: false,
        circleOptions: shapeOptions,
        polygonOptions: shapeOptions,
      })
      drawingManager.current.setMap(map);
  
      mapsRef.current.event.addListener(drawingManager.current, 'overlaycomplete', function(shape) {
        
        if (shape.type == 'circle') {
          currentShape.current = shape.overlay;
          circleButton.current.click();
          const radius = shape.overlay.getRadius().toFixed(6);
          const center = shape.overlay.getCenter();
          setRadius(radius);
          setCoords([{
            lat: center.lat().toFixed(6),
            lng: center.lng().toFixed(6),
          }]);

          mapsRef.current.event.addListener(currentShape.current,'radius_changed',function(){
            const radius = shape.overlay.getRadius().toFixed(6);
            setRadius(radius);
          })
          mapsRef.current.event.addListener(currentShape.current,'dragend',function(){
            const center = shape.overlay.getCenter();
            setCoords([{
              lat: center.lat().toFixed(6),
              lng: center.lng().toFixed(6),
            }]);
          })
        }
      if (shape.type == 'polygon') {
        currentShape.current = shape.overlay;
        polygonButton.current.click();

        polygonVertices.current = shape.overlay.getPath();
        getPolygonCoordinates();

        mapsRef.current.event.addListener(polygonVertices.current, "insert_at", function(){
          getPolygonCoordinates();
        })

        mapsRef.current.event.addListener(polygonVertices.current, "set_at", function(){
          getPolygonCoordinates();
        })

        mapsRef.current.event.addListener(polygonVertices.current, "remove_at", function(){
          getPolygonCoordinates();
        })
      }
      });
    }

    useEffect(() => {
      job5ReportsShapes.current.forEach(item => {
        item.setMap(null);
      })
      job5ReportsShapes.current = [];
        job5Reports.forEach(report => {
          if (report.shape == 'polygon') {
            const coords = report.coords.map(item => ({
              lat: parseFloat(item.lat), 
              lng: parseFloat(item.lng)
            }));
            const polygon = new mapsRef.current.Polygon({paths: coords, options: {strokeColor: "#606060", strokeWeight: 2,}})
            mapsRef.current.event.addListener(polygon, 'click', () => handleClickOpen(report));
            polygon.setMap(currentMap.current)
            job5ReportsShapes.current.push(polygon)
          } else {
            const coords = {
              lat: parseFloat(report.coords[0].lat),
              lng: parseFloat(report.coords[0].lng)
            }
            const circle = new mapsRef.current.Circle({center: coords, radius: parseFloat(report.radius), options: {strokeColor: "#606060", strokeWeight: 2,}})
            mapsRef.current.event.addListener(circle, 'click', () => handleClickOpen(report));
            circle.setMap(currentMap.current)
            job5ReportsShapes.current.push(circle)
          }
        })
    }, [job5Reports])

    useEffect(() => {
      currentShape.current && currentShape.current.setMap(null);
    }, [job5Running])


    const [openReportDialog, setReportDialog] = React.useState(false);
    const [jobInDialog, setJobInDialog] = React.useState({});

    const handleClickOpen = (job) => {
      setReportDialog(true);
      setJobInDialog(job);
    };
  

    return (
      <>
        <GoogleMapReact 
        style={{height: '100%',}}
        bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY, libraries: ['drawing'].join(','), }}
        defaultCenter={{lat: 40.1872,lng: 44.5152}}
        defaultZoom={12}
        hoverDistance={20}
        yesIWantToUseGoogleMapApiInternals //this is important!
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        options={mapOptionsCreator}
        > 
        {standardJobReports.map(
          report =>  (
            <div key={report.id} lat={report.coords[0]?.lat} lng={report.coords[0]?.lng} 
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'absolute', transform: 'translate(-50%, -100%)'}}>
            <Paper onClick={() => handleClickOpen(report)} style={{ cursor: 'pointer', backgroundColor: 'white', paddingLeft: 5, paddingRight: 5, display: 'flex', flexDirection: 'row', alignItems: 'center'}} elevation={6}>
              <Typography variant="overline" color={report.status == 'sold' ? 'secondary' : 'green'} style={{fontSize: 10 , fontWeight: 'bold'}}>{report.status} </Typography>
            </Paper>
            <Icon path={mdiGoogleMaps} size={1.3} color="#606060"/>
            </div>)
        )}
      </GoogleMapReact>
      <ReportDialog 
        openReportDialog={openReportDialog} 
        setReportDialog={setReportDialog}
        jobInDialog={jobInDialog}
      />
      </>
    )
}

export default React.memo(Map);
