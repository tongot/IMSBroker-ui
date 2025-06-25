import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const LoadingPage = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
    </Box>
  )
}

export default LoadingPage
