import React, { useState } from 'react';
import {Button, CssBaseline, TextField, Box, Grid, Typography, Paper, RadioGroup, FormControlLabel, Radio}from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/authService.js';


const theme = createTheme();

export default function SignUp() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    level: 'level_1',
  });

  const [errors, setErrors] = useState({});


  const registerUser = (e) => {
    e.preventDefault();

    AuthService.register(user).then(resp => {
      if (resp.status == 201) {
        navigate('/signin');
      } else {
        setErrors(resp.response.data);
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh', }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage: "url('map.jpeg')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
        </Grid>
        
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={0} square style={{ backgroundColor: 'none', paddingTop: 30 }}>
          <Box
            sx={{
              my: 6,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography color='primary' variant="overline" fontSize={18}>
              Sign up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 6 }}>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
                InputProps={{ disableUnderline: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
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
                InputProps={{ disableUnderline: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
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
                InputProps={{ disableUnderline: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
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
                InputProps={{ disableUnderline: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                type="password"
                value={user.password}
                onChange={(e) => {
                  setUser({ ...user, password: e.target.value });
                  setErrors({ ...errors, password: "" });
                }}
                error={errors.password ? true : null}
                helperText={errors.password}
                InputProps={{ disableUnderline: true, }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                value={user.password_confirmation}
                onChange={(e) => {
                  setUser({ ...user, password_confirmation: e.target.value });
                  setErrors({ ...errors, password_confirmation: "" });
                }}
                error={errors.password_confirmation ? true : null}
                helperText={errors.password_confirmation}
                InputProps={{ disableUnderline: true, }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} container justifyContent="center">
              <RadioGroup
                style={{fontSize: 12, color: 'grey', marginTop: 20, marginBottom: 20}}
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
            <Grid item xs={12} sm={12} md={12}>
              <Button fullWidth variant="contained" onClick={registerUser}>
                Sign up
              </Button> 
            </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
            </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" >
              <Grid item style={{marginTop: 10}}>
                <Link to="/signin">Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
          </Box>
        </Grid>
        </Grid> 
    </ThemeProvider>
  );
}