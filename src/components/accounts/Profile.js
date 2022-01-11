import React, { useState, useEffect } from 'react';
import { IconButton, Button, CssBaseline, TextField, Box, Grid, Typography, RadioGroup, FormControlLabel, Radio, Alert} from '@mui/material';
import { ArrowBackIosNew } from '@mui/icons-material';

import ProfilePicture  from './ProfilePicture';
import AuthService from '../../services/authService.js';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      level: "",
      phone_number: "",
      address: "",
      image: "",
    });

  const [errors, setErrors] = useState({});
  const [dataUpdateMessage, setDataUpdateMessage] = useState(false)

  useEffect(() => {
    AuthService.getUserData().then(resp => {
      if (resp.status == 200) {
        let user = replaceNulls(resp.data);
        setUser(user)
      } else {
        setErrors(resp.data);
      }
    });
   }, [])

   const updateUserData = (e) => {
    e.preventDefault();
    let userData = {...user}
    let formdata = new FormData();

    if (userData.image instanceof File == false) {
      delete userData.image;
    }

    for (const property in userData) {
      formdata.append(property, userData[property]);
    }

    AuthService.updateUserData(formdata).then(resp => {
      if (resp.status == 200) {
        setUser(resp.data);
        setDataUpdateMessage(true);
        setTimeout(() => {
          setDataUpdateMessage(false);
        }, 3000);
      } else {
        setErrors(resp.response.data);
      }
    });
   }

   const replaceNulls = (data) => {
    let userObj = {}
    for (let property in data) {
      data[property] != null && data[property] != "null" ? userObj[property] = data[property] : userObj[property] = "";
    }
    return userObj;
   }

   const handleBackClick = () => {
    navigate('/');
   }


  return (
    <>
      <Grid container component="main" sx={{ height: '100vh', }}>
        <CssBaseline />
        <Grid item justifyContent="center" xs={12} sm={6} md={4} >
          <div style={{
              height: '100%',
              backgroundImage: "url('map.jpeg')",
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
          }}>
          <ProfilePicture image={user.image} setUser={setUser} user={user}/>
          </div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={8} square style={{padding: 30, paddingTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <IconButton onClick={handleBackClick} aria-label="back to dashboard" sx={{ mx: 4, backgroundColor: 'grey'}}>
            <ArrowBackIosNew />
          </IconButton> 
          <Typography color="primary" variant="overline" sx={{ mx: 4, fontSize: 18}}>
            Profile
          </Typography>
           
          <Box
            sx={{
              my: 4,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="First Name"
                value={user.first_name}
                onChange={(e) => {
                  setUser({ ...user, first_name: e.target.value });
                  setErrors({ ...errors, first_name: "" });
                }}
                error={errors.first_name ? true : null}
                helperText={errors.first_name}
                InputLabelProps={{ shrink: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                style={{border: 'none'}}
                variant="outlined"
                required
                fullWidth
                label="Last Name"
                value={user.last_name}
                onChange={(e) => {
                  setUser({ ...user, last_name: e.target.value });
                  setErrors({ ...errors, last_name: "" });
                }}
                error={errors.last_name ? true : null}
                helperText={errors.last_name}
                InputLabelProps={{ shrink: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="email"
                label="Email Address"
                value={user.email}
                onChange={(e) => {
                  setUser({ ...user, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                error={errors.email ? true : null}
                helperText={errors.email}
                InputLabelProps={{ shrink: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Username"
                value={user.username}
                onChange={(e) => {
                  setUser({ ...user, username: e.target.value });
                  setErrors({ ...errors, username: "" });
                }}
                error={errors.username ? true : null}
                helperText={errors.username}
                InputLabelProps={{ shrink: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} >
              <TextField
                variant="outlined"
                fullWidth
                label="Phone Number"
                type="number"
                value={user.phone_number}
                onChange={(e) => {
                  setUser({ ...user, phone_number: e.target.value });
                  setErrors({ ...errors, phone_number: "" });
                }}
                error={errors.phone_number ? true : null}
                helperText={errors.phone_number}
                InputLabelProps={{ shrink: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} >
              <TextField
                variant="outlined"
                fullWidth
                label="Address"
                type="text"
                value={user.address}
                onChange={(e) => {
                  setUser({ ...user, address: e.target.value });
                  setErrors({ ...errors, address: "" });
                }}
                error={errors.address ? true : null}
                helperText={errors.phone_number}
                InputLabelProps={{ shrink: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} style={{ marginBottom: 15}}>
                <RadioGroup
                    row
                    name="controlled-radio-buttons-group"
                    value={user.level}
                    onChange={(e) => {
                        setUser({ ...user, level: e.target.value });
                    }}
                >
                    <FormControlLabel value="level_1" control={<Radio />} label="Level 1" />
                    <FormControlLabel value="level_2" control={<Radio />} label="Level 2" />
                    <FormControlLabel value="level_3" control={<Radio />} label="Level 3" />
                </RadioGroup>
            </Grid>
            </Grid>
            <Grid container justifyContent="flex-start">
              <Grid item>
                <Button
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                onClick={(e) => updateUserData(e)}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Box>
          </Box>
        </Grid>
      </Grid>
      <Alert style={{
          position: 'absolute', 
          display: dataUpdateMessage ? 'flex' : 'none',
          top: 30, 
          right: 30, 
          backgroundColor: 'white', color: 'green'
        }}
        severity="success">
          Updated successfully.
        </Alert>
    </>
  );
}