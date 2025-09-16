"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

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
        {user && (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ ml: 2 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: user.tipo === 'admin' ? '#EF4444' : '#10B981',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              {user.nombreCompleto?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: 1.2
              }}>
                {user.nombreCompleto}
              </Typography>
              <Typography sx={{
                color: '#B0BEC5',
                fontSize: '12px',
                lineHeight: 1.2
              }}>
                {user.tipo === 'admin' ? 'Administrador' : 'Organizador'}
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Menu Icon */}
        <IconButton 
          onClick={(e) => setUserMenuAnchor(e.currentTarget)}
          sx={{ 
            color: 'white',
            ml: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Menu del usuario */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={logout} sx={{ gap: 1, color: '#EF4444' }}>
            <ExitToAppIcon fontSize="small" />
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
};

export default Header;
