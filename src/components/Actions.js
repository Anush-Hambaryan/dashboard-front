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
      second: props.user?.level == "level_1" ? 2 : props.user?.level == "level_2" || props.user?.level == "level_3" ? 4 : null,
      third: props.user?.level == "level_3" ? 5 : null
    })
  }, [props.user])


  const [active, setState] = useState();

  const drawingManager = useRef();
  const mapsRef = useRef();

  const circleButton = useRef(null);
  const polygonButton = useRef(null);

  const [jobCount, setJobCount] = useState([])
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(null);
  const [coords, setCoords] = useState(null);
  const [textFileAddresses, setTextFileAddresses] = useState([]);
  const [fileUploadMessage, setFileUploadMessage] = useState(false);
  const [job5Running, setjob5Running] = useState(false);

    
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
    if (value != 'third') {
      if (textFileAddresses.length) {
        for (let i = 0; i < textFileAddresses.length; i++) {
          setTimeout(() => {
          setJobCount(prev => [...prev, {address: textFileAddresses[i],  value : value }]);
          }, i*100);
        }
        setTextFileAddresses([]);
      }
      if (address) {
        setJobCount(prev => [...prev, {value : value}]);
      }
    } else {
      setJobCount(prev => [...prev, {value : value}]);
    }
  }

  useEffect(() => {
    const data = jobCount[jobCount.length - 1]
    if (data) {
      const value = data.value;
      const job = accessToJobs[value];
      const duration = job == 1 ? 20000 : job == 2 ? 40000 : job == 3 ? 100000 : job == 4 ? 150000 : job == 5 ? 30000 : null;
      if (job != 5) {
        props.handleJob(`job${accessToJobs[value]}`, duration, {address: data.address ? data.address : address }, jobCount.length - 1);
      } else {
        setjob5Running(prev => !prev);
        props.handleJob(`job${accessToJobs[value]}`, duration, {radius : radius, coords: coords}, jobCount.length - 1);
        setCoords(null);
        setRadius(null);
      }
    }
    setAddress('');

  }, [jobCount])

  const [openedPopover, setOpenedPopover] = useState(false);

  document.onclick = () => {
    setOpenedPopover(false);
  }
    
    return (
        <>
        <Paper elevation={4} style={{ borderRadius: 0, position: 'absolute', left: 0, zIndex: 10, top: 0, width: '100%'}}> 
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
                <Button variant="outlined" onClick={() => handleRunJobClick('third')}>
                Job 5
                </Button>
                </>}
            </Grid>
          </Grid>
          <>

          {/* Mobile view */}
          
          <Button 
          variant="contained" 
          style={{marginLeft: 0, width: 143, display: matchesMedium ? 'block' : 'none'}} 
          aria-owns={openedPopover ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onClick={(e) =>  {e.stopPropagation(); setOpenedPopover(prev => !prev);}}
          >Actions</Button>
            <Paper
              onClick={(e) =>  {e.stopPropagation();}}
              elevation={12}
              style={{ width: '65%', zIndex: 23, position: 'absolute', top: 60, left: 10, display: openedPopover && matchesMedium ? 'flex' : 'none', flexDirection: 'column', padding: 15}}>
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
                    <Button variant="outlined" onClick={() => handleRunJobClick('third')}>
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
          job5Running={job5Running}
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
