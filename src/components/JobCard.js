import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Divider, Paper, IconButton, CircularProgress, useMediaQuery } from "@mui/material";

import Icon from '@mdi/react';
import { mdiCheck, mdiClockOutline } from '@mdi/js';


export default function JobCard(props) {
  const matchesMedium = useMediaQuery("(max-width:1050px)");

  return (
      <>
        <div style={{ marginLeft: 15, display: 'flex', flexDirection: matchesMedium ? 'column' : 'row' , alignItems: 'flex-start', justifyContent: 'space-around', padding: 5, marginTop: -20}}>
          <Typography variant="overline">
            Pending: {props.jobsPending}
          </Typography>
          { !matchesMedium && <Divider orientation="vertical" /> }
          <Typography variant="overline">
            In Progress: {props.jobsInProgress}
          </Typography>
          { !matchesMedium && <Divider orientation="vertical" /> }
          <Typography variant="overline">
            Finished: {props.jobsFinished}
          </Typography>
        </div>
        <div style={{overflowY: 'auto', paddingTop: 20, paddingBottom: 100, paddingLeft: 15}}>
          {props.jobs.map((item, i) => (
          <Paper elevation={3} key={i} style={{ width: '90%',  }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Typography sx={{ fontSize: 14, marginRight: 2, marginLeft: 1, marginTop: 2, marginBottom: 2 }} color="text.secondary">
                {i + 1}
              </Typography>
              <Typography sx={{ fontSize: 14, marginRight: 2, marginTop: 2, marginBottom: 2, flexGrow: 1 }} color="text.secondary">
                {item.type == 'job5' && item.radius ? 'Circle' : item.type == 'job5' ? 'Polygon' : item.address}
              </Typography>
              <CircularProgress size={27} style={{display: item.status == 'inProgress' ? 'flex' : 'none'}}/>
              <IconButton 
              size="small"
              disabled
              style={{ color: 'green', display: item.status == 'finished' ? 'flex' : 'none'}}
              >
              <Icon path={mdiCheck} size={1.3} />
              </IconButton>
              <IconButton
                size="small"
                style={{ display: item.status == 'pending' ? 'flex' : 'none', boxShadow: 'none', cursor: 'default'}}
              >
              <Icon path={mdiClockOutline} size={1.4} 
              style={{ backgroundColor: 'white', borderRadius: '50%'}} />
              </IconButton>
            </div>
          </Paper>))}
        </div>
    </>
  );
}