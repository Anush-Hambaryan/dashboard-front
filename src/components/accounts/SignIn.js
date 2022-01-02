import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import AuthService from '../../services/authService.js';
import { Navigate, Link } from 'react-router-dom';


const theme = createTheme();

export default function SignIn(props) {

  const [user, setUser] = React.useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [signedIn, setsignedIn] = useState(false)


  const loginUser = (e) => {
    e.preventDefault();
    AuthService.login(user).then(resp => {
      if (resp.status == 200) {
         setsignedIn(true);
      } else {
        setError(resp);
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      { signedIn && <Navigate to="/"/>}
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
        
        <Grid item xs={12} sm={8} md={6} p={8} component={Paper} elevation={4} square style={{backgroundColor: 'white', paddingTop: 30 }}>
           
          <Box
            sx={{
              my: 6,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems:'center',
            }}
          >
             <Typography color="primary" variant="overline" fontSize={18}>
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 6 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Username"
                    value={user.username}
                    onChange={(e) => {
                      setUser({ ...user, username: e.target.value });
                      setError("");
                    }}
                    InputProps={{ disableUnderline: true, }}
                    error={error}
                  />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      value={user.password}
                      onChange={(e) => {
                        setUser({ ...user, password: e.target.value });
                        setError("");
                      }}
                      InputProps={{ disableUnderline: true, }}
                      error={error}
                    />
                 <Typography variant="caption" style={{color: error ? '#d32f2f' : 'white'}}>
                    {"Incorrect password or username" }
                  </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
              <Button style={{marginTop: 20}} fullWidth variant="contained" onClick={(e) => loginUser(e)}>
                Sign in
              </Button> 
              </Grid>
              
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item style={{marginTop: 10}}>
                <Link to="/signup">Don't have an account? Sign up</Link>
              </Grid>
            </Grid>
          </Box>
          </Box>
           
        </Grid>
        </Grid>
    </ThemeProvider>
  );
}