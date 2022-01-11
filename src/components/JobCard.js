import React, {useState, useEffect} from 'react';
import Typography from '@mui/material/Typography';
import { Divider, Paper, IconButton, CircularProgress, useMediaQuery } from "@mui/material";

import Icon from '@mdi/react';
import { mdiCheck, mdiClockOutline } from '@mdi/js';
import ReportDialog from './ReportDialog';


function JobCard({jobs, jobsFinished, jobsInProgress, jobsPending, standardJobReports, job5Reports, reportsToggle}) {
  const matchesMedium = useMediaQuery("(max-width:1050px)");
  const matchesSmall = useMediaQuery("(min-width: 800px)");

  const [openReportDialog, setReportDialog] = useState(false);
  const [jobInDialog, setJobInDialog] = useState({});

  const handleClickOpen = (item) => {
    const job = item.type == "job5" ? job5Reports.find(job => job.id == item.dbID) : standardJobReports.find(job => job.id == item.dbID);
    setJobInDialog(job);
    setReportDialog(true);
  };

  return (
      <>
        <Paper square elevation={3} style={{  borderBottom: '1px solid #B8B8B8', display: 'flex', flexDirection: matchesMedium && matchesSmall ? 'column' : 'row' , alignItems: 'flex-start', justifyContent: 'space-around', padding: 5,}}>
          <span>
          <Typography variant="overline" color="primary" style={{marginRight: 5}}>
            Pending:
          </Typography>
          <Typography variant="overline">
           {jobsPending}
          </Typography>
          </span>
          { (!matchesMedium || !matchesSmall) && <Divider orientation="vertical" /> }
          <span>
          <Typography variant="overline" color="primary" style={{marginRight: 5}}>
            In Progress:
          </Typography>
          <Typography variant="overline">
           {jobsInProgress}
          </Typography>
          </span>
          { (!matchesMedium || !matchesSmall) && <Divider orientation="vertical" /> }
          <span>
          <Typography variant="overline" color="primary" style={{marginRight: 5}}>
            Finished:
          </Typography>
          <Typography variant="overline">
            {jobsFinished}
          </Typography>
          </span>
        </Paper>
        <div style={{overflowY: 'auto', paddingTop: 20, paddingBottom: 100, paddingLeft: 15}}>
          {jobs.map((item, i) => (
          <Paper elevation={3} key={i} style={{ width: '95%', marginBottom: 10, }}>
            <div style={{display: 'flex', alignItems: 'center' }}>
 
              <Typography sx={{ fontWeight: 'bold', fontSize: 14, marginRight: 1, marginLeft: 2, marginTop: 2, marginBottom: 2 }} color="text.secondary">
                {`${i + 1}.`}
              </Typography>
              <Typography color="black" sx={{ minWidth: 45, fontSize: 14, marginRight: 1, marginTop: 2, marginBottom: 2 }}>
                {`${item.type.slice(0,3).toUpperCase()} ${item.type[3]}`}
              </Typography>
  
              <Typography sx={{ fontSize: 14, marginRight: 2, marginTop: 2, marginBottom: 2, flexGrow: 1 }} color="text.secondary">
                {item.type == 'job5' && item.radius ? 'Circle' : item.type == 'job5' ? 'Polygon' : item.address}
              </Typography>
              <CircularProgress size={27} style={{display: item.status == 'inProgress' ? 'flex' : 'none', marginRight: 17}}/>
              <IconButton 
              disabled={!reportsToggle}
              onClick={() => handleClickOpen(item)}
              size="small"
              style={{ color: 'green', display: item.status == 'finished' ? 'flex' : 'none', marginRight: 10}}
              >
              <Icon path={mdiCheck} size={1.3} />
              </IconButton>
              <IconButton
                size="small"
                style={{ display: item.status == 'pending' ? 'flex' : 'none', boxShadow: 'none', cursor: 'default', marginRight: 10}}
              >
              <Icon path={mdiClockOutline} size={1.4} 
              style={{ backgroundColor: 'white', borderRadius: '50%'}} />
              </IconButton>
            </div>
          </Paper>))}
        </div>
        <ReportDialog 
        openReportDialog={openReportDialog} 
        setReportDialog={setReportDialog}
        jobInDialog={jobInDialog}
      />
    </>
  );
}

export default React.memo(JobCard);