import PropTypes from 'prop-types';
import merge from 'lodash/merge';
// import ReactApexChart from 'react-apexcharts';
import * as React from 'react';
// @mui
import {Grid, Typography, Card, CardHeader, Box, Slider } from '@mui/material';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useAlert } from 'react-alert'
// components
import { set } from 'lodash';
import { BaseOptionChart } from '../../../components/chart';


// ----------------------------------------------------------------------

AppgRNA.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  // chartData: PropTypes.array.isRequired,
  // chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const Input = styled(MuiInput)`
  width: 25px;
  align: center;
`;

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 380,
  },
});

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#28A6D1',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

const AntSwitchNoColorChange = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#28A6D1' : '#28A6D1',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
    theme.palette.mode === 'dark' ? '#28A6D1' : '#28A6D1',
    boxSizing: 'border-box',
  },
}));


export default function AppgRNA({ title, subheader, PrimerSearchOnOffToParent, PrimerOnOff, PrimerModeToParent, PrimerMode, 
  TunePrimersToParent, TunePrimers, PrimerOptionsToParent, PrimerOptions, ...other }) {
  
  const alert = useAlert()

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
  }
  );

  const handlePrimerSearchOnOffChange = (event) => {
    if (event.target.checked)
    {
      PrimerSearchOnOffToParent(true)
    }
    else
    {
      PrimerSearchOnOffToParent(false)
    }
  }

  const handlePrimerModeChange = (event) => {
    if (event.target.checked)
    {
      PrimerModeToParent("long")
      PrimerOptionsToParent(
        {
          prod_size_lower: 3300,
          prod_size_upper: 3700,
          Tm_lower:57,
          Tm_upper:63,
          Tm_opt:60,
        }
      )
    }
    else
    {
      PrimerModeToParent("short")
      PrimerOptionsToParent(
        {
          prod_size_lower: 250,
          prod_size_upper: 350,
          Tm_lower:57,
          Tm_upper:63,
          Tm_opt:60,
        }
      )
    }
  }

  const handleTunePrimersChange = (event) => {
    if (event.target.checked)
    {
      alert.info(<div style={{ textTransform: 'initial' }}>Changing the default primer parameters may result in substantially longer wait time as it prevents the use of pre-computed primers.</div>, {position:'middle', timeout: 10000})

      TunePrimersToParent(true)
    }
    else
    {
      TunePrimersToParent(false)
    }
  }

  const handleProdSizeLowerChange = () => (event) => {
    if (event.target.value < PrimerOptions.prod_size_upper)
    {
      PrimerOptionsToParent(
        {
          prod_size_lower: event.target.value,
          prod_size_upper: PrimerOptions.prod_size_upper,
          Tm_lower: PrimerOptions.Tm_lower,
          Tm_upper: PrimerOptions.Tm_upper,
          Tm_opt: PrimerOptions.Tm_opt,
        }
      )
    }
    else{
      alert("Lower limit should be less than upper limit")
    }
  }
  const handleProdSizeUpperChange = () => (event) => {
    if (event.target.value > PrimerOptions.prod_size_lower)
    {
      PrimerOptionsToParent(
        {
          prod_size_lower: PrimerOptions.prod_size_lower,
          prod_size_upper: event.target.value,
          Tm_lower: PrimerOptions.Tm_lower,
          Tm_upper: PrimerOptions.Tm_upper,
          Tm_opt: PrimerOptions.Tm_opt,
        }
      )
    }
    else{
      alert("Upper limit should be greater than lower limit")
    }
  }
  const handleTmLowerChange = () => (event) => {
    if (event.target.value < PrimerOptions.Tm_upper)
    {
      PrimerOptionsToParent(
        {
          prod_size_lower: PrimerOptions.prod_size_lower,
          prod_size_upper: PrimerOptions.prod_size_upper,
          Tm_lower: event.target.value,
          Tm_upper: PrimerOptions.Tm_upper,
          Tm_opt: PrimerOptions.Tm_opt,
        }
      )
    }
    else{
      alert("Lower limit should be less than upper limit")
    }
  }
  const handleTmUpperChange = () => (event) => {
    if (event.target.value > PrimerOptions.Tm_lower)
    {
      PrimerOptionsToParent(
        {
          prod_size_lower: PrimerOptions.prod_size_lower,
          prod_size_upper: PrimerOptions.prod_size_upper,
          Tm_lower: PrimerOptions.Tm_lower,
          Tm_upper: event.target.value,
          Tm_opt: PrimerOptions.Tm_opt,
        }
      )
    }
    else{
      alert("Upper limit should be greater than lower limit")
    }
  }
  const handleTmOptChange = () => (event) => {
    if (event.target.value > PrimerOptions.Tm_lower && event.target.value < PrimerOptions.Tm_upper)
    {
      PrimerOptionsToParent(
        {
          prod_size_lower: PrimerOptions.prod_size_lower,
          prod_size_upper: PrimerOptions.prod_size_upper,
          Tm_lower: PrimerOptions.Tm_lower,
          Tm_upper: PrimerOptions.Tm_upper,
          Tm_opt: event.target.value,
        }
      )
    }
    else{
      alert("Optimal value should be between lower and upper limit")
    }
  }


  return (
    <Card variant="outlined" {...other}>
      <CardHeader title={<div>Get primers for genotyping via amplicon-based deep sequencing
                              <CustomWidthTooltip title={<p>Precomputed primers are fetched for N- and C-terminus of canonical transcripts<br/><br/>For all other edit sites, primer are calculated in realtime and takes ~2 minutes for each site</p>}> 
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                </CustomWidthTooltip>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography>Off</Typography>
                                <AntSwitch inputProps={{ 'aria-label': 'ant design' }} onChange={handlePrimerSearchOnOffChange} checked={PrimerOnOff} />
                                <Typography>On</Typography>
                              </Stack>
                          </div>} subheader={subheader} 
        />
      <Box sx={{ pt:1, pl: 1 , pb: 1, pr:0, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth:1000, minWidth:400 }} >
            {PrimerOnOff ?
                    ( <>

                          <Box sx={{ pl: 2, pt: 1 ,width: 300 }} >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography>Short read</Typography>
                                <AntSwitchNoColorChange inputProps={{ 'aria-label': 'ant design' }} onChange={handlePrimerModeChange} checked={PrimerMode === "long"} />
                                <Typography>Long read</Typography>
                                <CustomWidthTooltip title={<p>Short read: Primers will generate ~250bp amplicons centered around the edit site.<br /><br />Long read: Primers will generate ~3000bp amplicons centered around the edit site.<br /></p>}> 
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                </CustomWidthTooltip>
                              </Stack>
                          </Box>
                          <Box sx={{ pl: 2, pt: 1 ,width: 300 }} >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography>Tune primer parameters</Typography>
                                <AntSwitch inputProps={{ 'aria-label': 'ant design' }} onChange={handleTunePrimersChange} checked={TunePrimers} />
                                <CustomWidthTooltip title={<p>changing the default primer parameters may result in substantially longer wait time as it prevents the use of pre-computed primers.</p>}> 
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                </CustomWidthTooltip>
                              </Stack>
                          </Box>
                          {TunePrimers ?
                                    ( <>

                                          <Box sx={{ p: 0, pb: 1 ,width: 500 }} >
      
                                          <Typography sx={{pl:5}}>PCR amplicon size:</Typography>

                                        {/* prod size upper */}
                                          <Grid container spacing={2} columns={16}  sx = {{pl:4}}>
                                              <Grid item xs={7}>
                                                <Typography sx={{pl:5}} nowrap = "true" variant="body" align="left" gutterBottom="true">
                                                Upper limit
                                                  </Typography>
                                                </Grid>
                                              <Grid item xs={3}>
                                                <TextField 
                                                  sx={{width: 60 }}
                                                  required          
                                                  rows={1} 
                                                  id="outlined-basic" 
                                                  variant="standard"
                                                  size="small"
                                                  value = {PrimerOptions.prod_size_upper}
                                                  onChange={handleProdSizeUpperChange()}
                                                  />
                                              </Grid>
                                              <Grid item xs={6} >
                                              <Slider sx={{ width: 150 }}
                                                      name = "prod_size_upper"
                                                      value={PrimerOptions.prod_size_upper}
                                                      onChange={handleProdSizeUpperChange()}
                                                      aria-labelledby="input-slider"
                                                      step={1}
                                                      min={100}
                                                      max={6000}
                                          />
                                              </Grid> 
                                          </Grid>

                                          {/* prod size lower */}
                                          <Grid container spacing={2} columns={16} sx = {{pl:4}}>
                                              <Grid item xs={7}>
                                                <Typography  sx={{pl:5}} nowrap = "true" variant="body" align="left" gutterBottom="true">
                                                Lower limit
                                                  </Typography>
                                                </Grid>
                                              <Grid item xs={3}>
                                                <TextField 
                                                  sx={{width: 60 }}
                                                  required          
                                                  rows={1} 
                                                  id="outlined-basic" 
                                                  variant="standard"
                                                  size="small"
                                                  value = {PrimerOptions.prod_size_lower}
                                                  onChange={handleProdSizeLowerChange()}
                                                  />
                                              </Grid>
                                              <Grid item xs={6}>
                                              <Slider sx={{ width: 150 }} 
                                                      name = "prod_size_lower"
                                                      value={PrimerOptions.prod_size_lower}
                                                      onChange={handleProdSizeLowerChange()}
                                                      aria-labelledby="input-slider"
                                                      step={1}
                                                      min={100}
                                                      max={6000}
                                          />
                                              </Grid> 
                                          </Grid>

                                        <Typography sx={{pl:5}}>Melting temperature (Tm):</Typography>
                                        
                                        {/* Tm upper limit */}
                                        <Grid container spacing={2} columns={16}  sx = {{pl:4}}>
                                              <Grid item xs={7}>
                                                <Typography sx={{pl:5}} nowrap = "true" variant="body" align="left" gutterBottom="true">
                                                Upper limit
                                                  </Typography>
                                                </Grid>
                                              <Grid item xs={3}>
                                                <TextField 
                                                  sx={{width: 50 }}
                                                  required          
                                                  rows={1} 
                                                  id="outlined-basic" 
                                                  variant="standard"
                                                  size="small"
                                                  value = {PrimerOptions.Tm_upper}
                                                  onChange={handleTmUpperChange()}
                                                  />
                                              </Grid>
                                              <Grid item xs={6}>
                                              <Slider sx={{ width: 150 }}
                                                      name = "Tm_upper"
                                                      value={PrimerOptions.Tm_upper}
                                                      onChange={handleTmUpperChange()}
                                                      aria-labelledby="input-slider"
                                                      step={0.1}
                                                      min={37}
                                                      max={95}
                                          />
                                              </Grid> 
                                          </Grid>
                                        {/* Tm optimal */}
                                        <Grid container spacing={2} columns={16}  sx = {{pl:4}}>
                                              <Grid item xs={7}>
                                                <Typography sx={{pl:5}} nowrap = "true" variant="body" align="left" gutterBottom="true">
                                                Optimal
                                                  </Typography>
                                                </Grid>
                                              <Grid item xs={3}>
                                                <TextField 
                                                  sx={{width: 50 }}
                                                  required          
                                                  rows={1} 
                                                  id="outlined-basic" 
                                                  variant="standard"
                                                  size="small"
                                                  value = {PrimerOptions.Tm_opt}
                                                  onChange={handleTmOptChange()}
                                                  />
                                              </Grid>
                                              <Grid item xs={6}>
                                              <Slider sx={{ width: 150 }}
                                                      name = "Tm_opt"
                                                      value={PrimerOptions.Tm_opt}
                                                      onChange={handleTmOptChange()}
                                                      aria-labelledby="input-slider"
                                                      step={0.1}
                                                      min={37}
                                                      max={95}
                                          />
                                              </Grid> 
                                          </Grid>
                                        {/* Tm lower limit */}
                                        <Grid container spacing={2} columns={16}  sx = {{pl:4}}>
                                              <Grid item xs={7}>
                                                <Typography sx={{pl:5}} nowrap = "true" variant="body" align="left" gutterBottom="true">
                                                Lower limit
                                                  </Typography>
                                                </Grid>
                                              <Grid item xs={3}>
                                                <TextField 
                                                  sx={{width: 50 }}
                                                  required          
                                                  rows={1} 
                                                  id="outlined-basic" 
                                                  variant="standard"
                                                  size="small"
                                                  value = {PrimerOptions.Tm_lower}
                                                  onChange={handleTmLowerChange()}
                                                  />
                                              </Grid>
                                              <Grid item xs={6}>
                                              <Slider sx={{ width: 150 }}
                                                      name = "Tm_lower"
                                                      value={PrimerOptions.Tm_lower}
                                                      onChange={handleTmLowerChange()}
                                                      aria-labelledby="input-slider"
                                                      step={0.1}
                                                      min={37}
                                                      max={95}
                                          />
                                              </Grid> 
                                          </Grid>

                                          </Box>
                                          

                                      </>
                                      ) : null  
                          }
                      </>
                      ) : null
            }

      </Box>
    </Card>
  );
}


