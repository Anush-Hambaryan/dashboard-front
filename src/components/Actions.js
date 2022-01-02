import React, {useState, useRef, useEffect} from 'react';
import { Typography, useMediaQuery, Alert, Divider, ToggleButtonGroup, ToggleButton, Tooltip, IconButton, Button, Paper, Grid, TextField }from '@mui/material';
import Icon from '@mdi/react';
import { mdiCircleOutline, mdiShapePolygonPlus } from '@mdi/js';
import AccountsPopover from './AccountsPopover'
import { FileUpload } from '@mui/icons-material/';

import Map from './Map';

export default function Actions(props) {
  const matchesMedium = useMediaQuery("(max-width:800px)");

  const [accessToJobs, setAccessToJobs] = useState({});
  useEffect(() => {
    setAccessToJobs({
      first: props.user?.level == "level_1" || props.user?.level == "level_3" ? 1 : props.user?.level == "level_2" ? 3 : null,
      second: props.user?.level == "level_1" ? 2 : props.user?.level == "level_2" || props.user?.level == "level_3" ? 4 : null
    })
  }, [props.user])


  const [active, setState] = useState();

  const drawingManager = useRef();
  const mapsRef = useRef();

  const circleButton = useRef(null);
  const polygonButton = useRef(null);

  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(null);
  const [coords, setCoords] = useState(null);
  const [textFileAddresses, setTextFileAddresses] = useState([]);
  const [fileUploadMessage, setFileUploadMessage] = useState(false);

    
  const handleChange = (e, newValue) =>  {
    setState(newValue);
  }

  const setDrawingOverlayType = (type) => {
    if (drawingManager.current.drawingMode == type.toLowerCase()) {
      drawingManager.current.setDrawingMode(null);
    } else {
      drawingManager.current.setDrawingMode(mapsRef.current.drawing.OverlayType[type]);
    }
  }
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(){
      const lines = this.result.split('\n');
      setTextFileAddresses(lines);
      setFileUploadMessage(true);
      setTimeout(() => {
        setFileUploadMessage(false);
      }, 3000);
    };
    reader.readAsText(file);
  }

  const handleRunJobClick = (value) => {
    const job = accessToJobs[value];
    const duration = job == 1 ? 20000 : job == 2 ? 40000 : job == 3 ? 100000 : job == 4 ? 150000 : null;
    if (textFileAddresses.length) {
      textFileAddresses.forEach((address, i) => {
        setTimeout(() => {
          props.handleJob(`job${accessToJobs[value]}`, duration, {address: address, status: i <= 9 ? 'inProgress' : 'pending' }, i );
        }, i*100);
      })
    }
    props.handleJob(`job${accessToJobs[value]}`, duration, {address: address, status: null});
  }

  const [openedPopover, setOpenedPopover] = useState(false);

  document.onclick = () => {
    setOpenedPopover(false);
  }
    
    return (
        <>
        <Paper elevation={4} style={{ borderRadius: 0, position: 'absolute', left: 0, zIndex: 3, top: 0, width: '100%'}}> 
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',  padding: 10}}>
          <Grid container spacing={2} display={matchesMedium ? 'none' : 'flex'} >
            <Grid item md={4}>
                <TextField
                size='small'
                value={address}
                onChange={(input) => setAddress(input.target.value)}
                placeholder='Enter Address' 
                fullWidth></TextField>
            </Grid>
            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{ marginRight: 10}}>
                <input
                    style={{ display: "none" }}
                    multiple={false}
                    type="file"
                    id="button-file"
                    onChange={handleFileChange}
                />
                <Tooltip  title="Upload text file containing addresses.">
                <IconButton color="primary" component="span" >
                    <label htmlFor="button-file" style={{cursor: 'pointer', height: 24}}>
                      <FileUpload />
                    </label>
                </IconButton>
                </Tooltip>
                </div>
                <Button style={{ marginRight: 10}} variant="outlined" onClick={() => handleRunJobClick('first')}>
                Job {accessToJobs.first}
                </Button>
                <Button  variant="outlined" onClick={() => handleRunJobClick('second')}>
                Job {accessToJobs.second}
                </Button>
            </Grid>
            <Grid item style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {props.user.level == "level_3" && 
              <>
              <Divider orientation="vertical" style={{marginRight: 15}}/>
              <ToggleButtonGroup 
                  size="small"
                  color="primary"
                  value={active}
                  onChange={handleChange}
                  exclusive
                  style={{ marginRight: 10}}
                >
                <ToggleButton
                    ref={circleButton}
                    onClick={() => setDrawingOverlayType('CIRCLE')}
                    value='1'
                >
                    <Icon path={mdiCircleOutline} size={1} />
                </ToggleButton>
                <ToggleButton
                    ref={polygonButton}
                    onClick={() => setDrawingOverlayType('POLYGON')}
                    value='2'
                >
                    <Icon path={mdiShapePolygonPlus} size={1} />
                </ToggleButton>
                </ToggleButtonGroup>
                <Button variant="outlined" onClick={() => props.handleJob("job5", 30000, {radius : radius, coords: coords})}>
                Job 5
                </Button>
                </>}
            </Grid>
          </Grid>
          <>
          <Button 
          variant="contained" 
          style={{marginLeft: 10, width: 133, display: matchesMedium ? 'block' : 'none'}} 
          aria-owns={openedPopover ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onClick={(e) =>  {e.stopPropagation(); setOpenedPopover(prev => !prev);}}
          >Actions</Button>
            <Paper
              onClick={(e) =>  {e.stopPropagation();}}
              elevation={4}
              style={{ position: 'absolute', top: 60, left: 20, display: openedPopover && matchesMedium ? 'flex' : 'none', flexDirection: 'column', padding: 15}}>
              <TextField
                size='small'
                value={address}
                onChange={(input) => setAddress(input.target.value)}
                placeholder='Enter Address' 
                fullWidth>
              </TextField>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: 15}}>
                <div style={{ marginRight: 10}}>
                  <input
                      style={{ display: "none" }}
                      multiple={false}
                      type="file"
                      id="button-file"
                      onChange={handleFileChange}
                  />
                  <Tooltip  title="Upload text file containing addresses.">
                  <IconButton color="primary" component="span" >
                      <label htmlFor="button-file" style={{cursor: 'pointer', height: 24}}>
                        <FileUpload />
                      </label>
                  </IconButton>
                  </Tooltip>
                </div>
                <Button style={{ marginRight: 10}} variant="outlined" onClick={() => handleRunJobClick('first')}>
                Job {accessToJobs.first}
                </Button>
                <Button  variant="outlined" onClick={() => handleRunJobClick('second')}>
                Job {accessToJobs.second}
                </Button>
              </div>
              {props.user.level == "level_3" && 
              <>
                <Divider style={{marginTop: 15}}/>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: 15}}>
                    <ToggleButtonGroup 
                      size="small"
                      color="primary"
                      value={active}
                      onChange={handleChange}
                      exclusive
                      style={{ marginRight: 10}}
                    >
                      <ToggleButton
                          ref={circleButton}
                          onClick={() => setDrawingOverlayType('CIRCLE')}
                          value='1'
                      >
                        <Icon path={mdiCircleOutline} size={1} />
                      </ToggleButton>
                      <ToggleButton
                        ref={polygonButton}
                        onClick={() => setDrawingOverlayType('POLYGON')}
                        value='2'
                      >
                        <Icon path={mdiShapePolygonPlus} size={1} />
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <Button variant="outlined" onClick={() => props.handleJob("job5", 8000, {radius : radius, coords: coords})}>
                    Job 5
                    </Button>
                </div>
              </>}
            </Paper>
          </>

          <div style={{display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2" style={{marginRight: 5}}>{props.user?.first_name} </Typography>
            <AccountsPopover />
          </div>
            
        </div>
            
         </Paper> 

         <Map 
          drawingManager={drawingManager} 
          mapsRef={mapsRef} 
          circleButton={circleButton}
          polygonButton={polygonButton}
          setAddress={props.setAddress}
          jobs={props.jobs}
          setRadius={setRadius}
          setCoords={setCoords}
          standardJobReports={props.standardJobReports}
          job5Reports={props.job5Reports}
          reportsToggle={props.reportsToggle}
          user={props.user}
          />

        <Alert style={{
          position: 'absolute', 
          display: fileUploadMessage ? 'flex' : 'none',
          top: 85, 
          left: 300, 
          backgroundColor: 'white', color: 'green'
        }}
        severity="success">
          File uploaded successfully.
        </Alert>
      </>
    )
}
