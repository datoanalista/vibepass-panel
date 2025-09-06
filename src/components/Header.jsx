"use client";
import React from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const Header = () => {

  return (
    <Box sx={{
      width: '100%',
      height: '85px',
      bgcolor: '#1B2735',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 3,
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
      position: 'relative'
    }}>
      {/* Left side - Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}>
            <img 
              src="/vibepass-panel/vibepass.svg" 
              alt="VibePass" 
              style={{ 
                height: '32px', 
                width: 'auto'
              }} 
            />
          </Box>
        </Link>
      </Box>



      {/* Right side - User info and icons */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: '0 0 auto' }}>
        {/* Search Icon */}
        <IconButton sx={{ 
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}>
          <SearchIcon />
        </IconButton>

        {/* Notifications Icon */}
        <IconButton sx={{ 
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}>
          <NotificationsIcon />
        </IconButton>

        {/* User Info */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ ml: 2 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: '#00BCD4',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            JO
          </Avatar>
          <Box>
            <Typography sx={{
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: 1.2
            }}>
              José Ortiz
            </Typography>
            <Typography sx={{
              color: '#B0BEC5',
              fontSize: '12px',
              lineHeight: 1.2
            }}>
              Administrador
            </Typography>
          </Box>
        </Stack>

        {/* Menu Icon */}
        <IconButton sx={{ 
          color: 'white',
          ml: 1,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}>
          <MenuIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Header;
