import { Box, Dialog, IconButton, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface IMSModalProps {
  openDialog: boolean
  children: React.ReactNode
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false
  heading: string
  onClose?: () => void
}

const IMSModal = ({openDialog, children, maxWidth, heading, onClose}:IMSModalProps) => {
  
  return (
    <Dialog fullWidth maxWidth={maxWidth} open={openDialog}>
      <Box sx={{display: "flex", justifyContent: "space-between", padding: "1rem"}}>
        <Typography variant="h6">{heading}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{padding: "1rem"}}>
        {children}
      </Box>
  </Dialog>
  )
}

export default IMSModal
