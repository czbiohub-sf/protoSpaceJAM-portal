import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import * as React from 'react';
// @mui
import {Typography, Card, CardHeader, Box } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppGeneGenome.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppGeneGenome({ title, subheader, parentToChildTimeElapsed, parentToChildParams, parentToChildDownloadResultButton, handleLoadingButton,loading,parentToChildResBoxshow, ...other }) {
  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: { bar: { columnWidth: '16%' } },
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        },
      },
    },
  });




  return (
    <Card variant="outlined" {...other}>
      <CardHeader title={title} subheader={subheader} />


      <Box sx={{ mt:3, ml:3, mb: 3, minWidth: 250 }} autoComplete="off">
          <Stack spacing={2} direction="row">

          <LoadingButton variant="contained"
                    onClick={handleLoadingButton}
                    loading={loading}
                    loadingPosition="end"
                    endIcon={<RocketLaunchIcon  fontSize="medium"/>}
          >
             Run protospaceX 
          </LoadingButton>

        </Stack>
        <br/>
        {parentToChildResBoxshow &&         
            <Box sx={{pt:1, pb:1, pr:1, pl:2, mt:1, ml:0, mr:3, width:350, boxShadow:5, borderRadius: 1, bgcolor: '#edf4f7',}}  dir="ltr">
            <Typography>Job <b>submitted</b><br/>The estimated processing time is:<br/>10s + 5s per additional gene
            </Typography>
            {/* {parentToChildParams} */}
            <br/>
            {parentToChildTimeElapsed}
            {/* {parentToChildDownloadResultButton} */}
          
      </Box>}


      </Box>


    </Card>
  );
}
