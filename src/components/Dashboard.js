import React, {useState, useEffect, useRef } from "react";
import { useMediaQuery, Badge, Typography, Switch, Paper, Drawer, IconButton, Fab } from "@mui/material";
import Actions from "./Actions";
import { styled, useTheme } from '@mui/material/styles';
import { ChevronLeft, ChevronRight, } from "@mui/icons-material"
import JobCard from "./JobCard";

import { JobQueue } from '../helpers/queue';
import Geocode from "react-geocode";
import apiService from '../services/apiService';
import AuthService from '../services/authService';


Geocode.setApiKey(process.env.REACT_APP_API_KEY);


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));


export default function Dashboard() {
  const matchesMedium = useMediaQuery("(max-width:800px)");

  const [user, setUser] = useState({})
  const [jobTypes, setJobTypes] = useState([])

  useEffect(() => {
    AuthService.getUserData()
    .then(resp => {
      if (resp.data.level == "level_1") {
        setJobTypes([1, 2]);
      } else if (resp.data.level == "level_2") {
        setJobTypes([3, 4]);
      } else {
        setJobTypes([1, 4, 5]);
      }
      setUser(resp.data);
    })

  }, [])

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const jobQueue = useRef(new JobQueue())

  const [jobs, setJob] = useState([])
  const [jobsInProgress, setJobsInProgress] = useState(0)
  const [jobsPending, setJobsPending] = useState(0)
  const [jobsFinished, setJobsFinished] = useState(0)
  const [standardJobReports, setStandardJobReports] = useState([])
  const [job5Reports, setJob5Reports] = useState([])
  const [reportsToggle, setReportsToggle] = useState(false)
  const [searchParams, setSearchParams] = useState({owner: null, job_type: null })

  const handleJob = (jobType, duration, data, id) => {
    if ((jobType != 'job5' && data.address == '') || (jobType == 'job5' && data.coords == null)) {
      return;
    }
    const job = {
      id: id ? id : jobs.length, 
      type: jobType, 
      status: data.status ? data.status : jobsInProgress <= 9 ? "inProgress" : "pending", 
      duration: duration, 
      address: data.address || null, 
      coords: data.coords || null,
      radius: data.radius || null,
    }
    setJob(prevState => [...prevState, job])
    if (job.status == "inProgress") {
      processJob(job)
    } else {
      jobQueue.current.enqueue(job)
      setJobsPending(prevState => prevState + 1);
    }
  }

  async function processJob (job) {
    setJobsInProgress(prevState => prevState + 1);
    if (job.status == "pending") {
      setJobsPending(prevState => prevState - 1);
      setJob(prevState => {
        const newState = [...prevState];
        newState[job.id].status = "inProgress";
        return newState;
      })
    }
    let coords;
    const status = Math.random() < 0.5 ? "sold" : "available"
    const jobType = parseInt(job.type[job.type.length-1])

    if (job.type != "job5") {
      await Geocode.fromAddress(job.address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          coords = {
            "lat": lat.toFixed(6),
            "lng": lng.toFixed(6),
          }
        },
        (error) => {
        });

      // post to backend
      apiService.postJobReport("standardJobs", {job_type: jobType, address: job.address, status: status, coords: [coords]})
    } else {
      apiService.postJobReport("jobs5", { shape: job.radius ? 'circle' : 'polygon',  coords: job.coords, radius: job.radius, })
    }
      
    setTimeout(() => {
      setJob(prevState => {
        const newState = [...prevState];
        newState[job.id].status = "finished";
        if (newState[job.id].type != "job5") {
          newState[job.id].coords = coords;
        }
        return newState;
      })

      if (job.type != "job5") {
        reportsToggle && setStandardJobReports(prev => [...prev, {owner: {first_name: user.first_name, last_name: user.last_name}, job_type: jobType, address: job.address, status: status, coords: [coords], created: new Date()}])
      } else {
        reportsToggle && setJob5Reports(prev => [...prev, {owner: {first_name: user.first_name, last_name: user.last_name}, shape: job.radius ? 'circle' : 'polygon',  coords: job.coords, radius: job.radius, created: new Date() }])
      }
      
      setJobsFinished(prevState => prevState + 1);
      setJobsInProgress(prevState => prevState - 1);
      const nextJob = jobQueue.current.dequeue();
      nextJob && processJob(nextJob);

    }, job.duration);
  }

  useEffect(() => {
    if (reportsToggle) {
      if (searchParams.job_type == null) {
        apiService.getJobReports('standardJobs', {owner: searchParams.owner})
        .then(resp => {
          setStandardJobReports(resp.data)
          console.log(resp.data)
        })
        user.level == "level_3" && apiService.getJobReports('jobs5', {owner: searchParams.owner })
        .then(resp => {
          setJob5Reports(resp.data)
          console.log(resp)
        })
      } else if (searchParams.job_type == 5) {
        setStandardJobReports([])
        user.level == "level_3" && apiService.getJobReports('jobs5', {owner: searchParams.owner })
        .then(resp => {
          setJob5Reports(resp.data)
          console.log(resp)
        })
      } else {
        setJob5Reports([])
        apiService.getJobReports('standardJobs', {owner: searchParams.owner, job_type: searchParams.job_type})
        .then(resp => {
          setStandardJobReports(resp.data)
          console.log(resp.data)
        })
      }
    } else {
      setStandardJobReports([]);
      setJob5Reports([]);
    }
    
  }, [reportsToggle, searchParams])

  const handleFilter = (parameter) => {
    console.log(parameter)
    console.log(user.username)
    if (parameter == user.username) {
      setSearchParams(prev => prev.owner ? ({...prev, owner: null}) : ({...prev, owner: user.id}))
    } else {
      setSearchParams(prev => prev.job_type == parameter ?  ({...prev, job_type: null}) : ({...prev, job_type: parameter}))
    } 
  }

  return (
    <div className="App">
      <Actions reportsToggle={reportsToggle} user={user} sideBarOpen={open} handleJob={handleJob} jobs={jobs} standardJobReports={standardJobReports} job5Reports={job5Reports}/>
      <Paper elevation={8} style={{ paddingRight: 10, position: 'absolute', left: 20, top: 85,}}>
        <Typography variant="overline" style={{marginLeft: 10, fontWeight: 'bold'}}>Reports</Typography>
        <Switch onChange={() => setReportsToggle(prev => !prev)} />
      </Paper>

      <div style={{ position: 'absolute', marginLeft: 20, zIndex: 3, top: 170, display: reportsToggle ? 'flex' : 'none', flexDirection: 'column' }}>
      
        <Fab  onClick={() => handleFilter(user.username)} 
        style={{ color: searchParams.owner ? 'white' : 'black', backgroundColor: searchParams.owner ? '#1a76d2' : 'white', marginBottom: 10, fontSize: 10}} size="medium">
          My
        </Fab>
        {jobTypes.map(job => (
          <Fab onClick={() => handleFilter(job)} 
          style={{ color: searchParams.job_type == job ? 'white' : 'black', backgroundColor: searchParams.job_type == job ? '#1a76d2' : 'white', marginBottom: 10, fontSize: 10}} size="medium">
            JOB {job}
          </Fab>
        ))}
      </div>
      <div style={{ position: 'absolute', right: 20, top: 85,}}>
      <Badge badgeContent={jobsInProgress + jobsFinished + jobsPending} color="primary">
      <Paper
          style={{padding: 2.5, paddingLeft: 8, paddingRight: 8, cursor: 'pointer',}}
          elevation={8}
          onClick={handleDrawerOpen}
          sx={{ ...(open && { display: 'none' }) }}
        >
          <Typography variant="overline" style={{fontWeight: 'bold'}}>JOBS</Typography>
        </Paper>
      </Badge>
      </div>

      <Drawer
        sx={{
          width: matchesMedium ? '100%' : '30%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: matchesMedium ? '100%' : '30%',
            backgroundColor: 'white',
            top: 62,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
        hideBackdrop={true}
        PaperProps={{elevation: 3,}}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <JobCard 
          jobs={jobs}
          jobsFinished={jobsFinished}
          jobsInProgress={jobsInProgress}
          jobsPending={jobsPending}
        />
      </Drawer>
    </div>
  );
}