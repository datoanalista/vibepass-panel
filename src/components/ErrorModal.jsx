"use client";
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const ErrorModal = ({ open, message, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '20px'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', paddingBottom: '10px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <ErrorIcon sx={{ fontSize: 48, color: '#EF4444' }} />
          <Typography variant="h6" sx={{
            fontFamily: 'Inter',
            fontWeight: 600,
            color: '#1F2937'
          }}>
            Error
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', paddingY: '20px' }}>
        <Typography sx={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: '14px',
          color: '#6B7280',
          lineHeight: 1.5
        }}>
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', paddingTop: '10px' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #01A8E2 0%, #99B7DB 100%)',
            borderRadius: '8px',
            padding: '10px 30px',
            fontFamily: 'Inter',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(90deg, #0191C7 0%, #8AA5C9 100%)',
            }
          }}
        >
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;
