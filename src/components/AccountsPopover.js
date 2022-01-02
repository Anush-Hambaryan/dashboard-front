import React, { useState } from 'react';
import {Popover, Link, Typography, IconButton, List, ListItem, ListItemButton, Divider } from '@mui/material';
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js'
import AuthService from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function AccountsPopover() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleLogOut = () => {
    AuthService.logout()
    .then(resp => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate('/signin');
    })
  }

  return (
    <div>
      <IconButton rounded size='small' aria-describedby={id} onClick={handleClick} style={{marginRight: 0}}>
        <Icon path={mdiAccount} size={0.8} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{ 
          style: {position: "sticky", width: 120}, 
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <Link href="/profile" variant="overline" style={{textDecorationLine: 'none', color: 'inherit'}}>
                Profile
              </Link>
            </ListItemButton> 
          </ListItem>

          <Divider />

          <ListItem disablePadding>
            <ListItemButton onClick={handleLogOut}>
              <Typography variant="overline" style={{textDecorationLine: 'none', color: 'inherit'}}>
                  Log out
              </Typography>
            </ListItemButton> 
          </ListItem>
        </List>
      </Popover>
    </div>
  );
}
