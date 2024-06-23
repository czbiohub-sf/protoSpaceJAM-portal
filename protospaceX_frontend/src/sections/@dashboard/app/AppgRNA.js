import PropTypes from 'prop-types';
import merge from 'lodash/merge';
// import ReactApexChart from 'react-apexcharts';
import * as React from 'react';
// @mui
import {Grid, Typography, Card, CardHeader, Box } from '@mui/material';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import BuildIcon from '@mui/icons-material/Build';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import { useAlert } from 'react-alert'
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppgRNA.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  // chartData: PropTypes.array.isRequired,
  // chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const weightmarks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: '1',
  },

];

const Input = styled(MuiInput)`
  width: 25px;
  align: center;
`;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


export default function AppgRNA({ title, subheader, gRNAnumToParent, penalizeRegToParent, NucleaseToParent, SpecificityWeightScalingFactorToParent, PositionWeightScalingFactorToParent, Cut2InsertDistWeightScalingFactorToParent,
                                  parentToChildNuclease, parentToChildgRNAnum, parentToChildpenalizeReg, parentToChildSpecificityWeightScalingFactor, parentToChildPositionWeightScalingFactor, parentToChildCut2InsertDistWeightScalingFactor,  ...other }) {
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
  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 380,
    },
  });

  const alert = useAlert()

  // gRNA num change
    
  const [gRNAparam, setValues] = React.useState({
    gRNAnum: '1',
  });


  const handlegRNAnumChange = (prop) => (event) => {
    setValues({ ...gRNAparam, [prop]: event.target.value });
    gRNAnumToParent(event.target.value)
  };

  // penalize gRNA cutting in/near regulatory sequence
  const [penalizeReg, setPenalizeReg] = React.useState(true);

  const HandlePenalizeRegChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPenalizeReg(event.target.checked);
    penalizeRegToParent(event.target.checked)
    if (!event.target.checked){
      PositionWeightScalingFactorToParent(0)
    }
    else{
      PositionWeightScalingFactorToParent(1)
    }
  };

  // Nuclease selection
  const [Nuclease, setNuclease] = React.useState('SpCas9');
  const handleNucleaseChange = (event: SelectChangeEvent) => {
    setNuclease(event.target.value);
    NucleaseToParent(event.target.value)
  };

  // Spcificity weight change
  const [SpecificityWeightScalingFactor, setSpecificityWeightScalingFactor] = React.useState(1);
  const handleSpecificityWeightScalingFactorChange = () => (event) => {
    if (event.target.value < 0) {
      setSpecificityWeightScalingFactor(0);
      SpecificityWeightScalingFactorToParent(0)
      alert.error("Scaling factor should > 0")
    }
    else if (event.target.value > 1) {
      setSpecificityWeightScalingFactor(1);
      SpecificityWeightScalingFactorToParent(1)
      alert.error("Scaling factor should <= 1")
    }
    else{
      setSpecificityWeightScalingFactor(event.target.value);
      SpecificityWeightScalingFactorToParent(event.target.value)
    }
  };

  // Position weight change
  const [PositionWeightScalingFactor, setPositionWeightScalingFactor] = React.useState(1);
  const handlePositionWeightScalingFactorChange = () => (event) => {
    if (event.target.value < 0) {
      setPositionWeightScalingFactor(0);
      PositionWeightScalingFactorToParent(0)
      alert.error("Scaling factor should > 0")
    }
    else if (event.target.value > 1) {
      setPositionWeightScalingFactor(1);
      PositionWeightScalingFactorToParent(1)
      alert.error("Scaling factor should <= 1")
    }
    else{
    setPositionWeightScalingFactor(event.target.value);
    PositionWeightScalingFactorToParent(event.target.value)
    }
  };

  // cut2insert weight change
  const [Cut2InsertDistWeightScalingFactor, setCut2InsertDistWeightScalingFactor] = React.useState(1);
  const handleCut2InsertDistWeightScalingFactorChange = () => (event) => {
    if (event.target.value < 0) {
      setCut2InsertDistWeightScalingFactor(0);
      Cut2InsertDistWeightScalingFactorToParent(0)
      alert.error("Scaling factor should > 0")
    }
    else if (event.target.value > 1) {
      setCut2InsertDistWeightScalingFactor(1);
      Cut2InsertDistWeightScalingFactorToParent(1)
      alert.error("Scaling factor should <= 1")
    }
    else{
    setCut2InsertDistWeightScalingFactor(event.target.value);
    Cut2InsertDistWeightScalingFactorToParent(event.target.value)
    }
  };

  return (
    <Card variant="outlined" {...other}>
      <CardHeader title={title} subheader={""} />

      <Box sx={{ p: 3, pb: 0 ,width: 320 }} >
      <FormControl  sx={{minWidth: 300 }} dir="ltr">
        <InputLabel id="Nuclease">Nuclease</InputLabel>
        <Select
          labelId="Nuclease"
          id="Nuclease"
          value={parentToChildNuclease}
          onChange={handleNucleaseChange}
          // autoWidth
          label="Nuclease"
        >
          <MenuItem value={"SpCas9"}>SpCas9 &nbsp; <font style={{color:'grey', fontSize:"12px"}}>on/[off] NGG/[NGG,NGA,NAG]</font></MenuItem>
          <MenuItem value={"SpCas9-VQR"}>SpCas9-VQR &nbsp; <font style={{color:'grey', fontSize:"12px"}}>on/[off] NGA/[NGA,NGG]</font></MenuItem>
          <MenuItem value={"enAsCas12a"}>enAsCas12a &nbsp; <font style={{color:'grey', fontSize:"12px"}}>on/[off] TTTV/[TTTN]</font></MenuItem>
        </Select>
      </FormControl>
      <FormHelperText sx={{ml:1, mb:0,pb:0}}>Looking for another PAM? <a href="https://github.com/czbiohub-sf/protoSpaceJAM/tree/main/protoSpaceJAM/precompute">Here</a> are instructions to onboard your own. You can also <a href ="https://forms.gle/FjiXKdbYLaxsPp7aA" target = "_blank" rel="noreferrer">contact us</a> for help </FormHelperText>
      </Box>



      <Box sx={{ p: 3, pb: 0 ,width: 320 }} >
      
      <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
      <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/> Number of gRNAs per site: &nbsp;&nbsp;&nbsp;
      </Typography>

        <Grid sx={{pl: 2}} container spacing={2} alignItems="center">
              <Grid item >
                  <Slider sx={{ width: 80 }} 
                            value={parentToChildgRNAnum}
                            onChange={handlegRNAnumChange('gRNAnum')}
                            aria-labelledby="input-slider"
                            step={1}
                            // marks={marks}
                            min={1}
                            max={10}
                          />
              </Grid> 

              <Grid item xs>
                  <Input
                        value={parentToChildgRNAnum}
                        size="small"
                        onChange={handlegRNAnumChange('gRNAnum')}
                        // onBlur={handleBlur}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 10,
                          type: 'number',
                          'aria-labelledby': 'input-slider',
                        }}
                      />
              </Grid>
          </Grid>
      </Box>


      <Box sx={{ p: 3, pb: 3 ,width: 320 }} >
        <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/>
        <Checkbox 
        checked = {parentToChildpenalizeReg}
        onChange = {HandlePenalizeRegChange} />
        <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
         Penalize gRNAs that cut in 5' UTRs or near splice junctions.
        </Typography>

      </Box>

      {/* gRNA scoring weights */}
      
      {/* <Box sx={{ p: 3, pb: 3 ,width: 320 }} >
        <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/>
        <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
          &nbsp; <b>Scaling factor</b> of gRNA scoring weights
        </Typography>
        <CustomWidthTooltip  title={<><p>The total score is calculated by taking the product three weights.</p>
                                      <p>Each weight can be scaled by the corresponding scaling factor.</p>
                                      <p>If scaling factor is 0, the corresponding weight is ignored</p>
                                    <p>The mathemathical formula is <a href="https://czbiohub-sf.github.io/protoSpaceJAM/algorithmandparameters.html#grna-scoring" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p> 
                                    </>}>
                                    <IconButton>
                                      <HelpOutlineIcon fontSize="small"/>
                                    </IconButton>
        </CustomWidthTooltip>

      </Box>

      <Box sx={{ p: 0, pb: 1 ,width: 320 }} > */}
      
      {/* Specificity weight change */}
      {/* <Grid container spacing={2} columns={16} sx = {{pl:4}}>
          <Grid item xs={8}>
            <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
                Specificity (α1)
              </Typography>
            </Grid>
          <Grid item xs={2}>
            <TextField 
              sx={{width: 35 }}
              required          
              rows={1} 
              id="outlined-basic" 
              variant="standard"
              size="small"
              value = {parentToChildSpecificityWeightScalingFactor}
              onChange={handleSpecificityWeightScalingFactorChange()}
              />
          </Grid>
          <Grid item xs={6}>
            <Slider sx={{ width: 85, ml: 2}} 
                      value={parentToChildSpecificityWeightScalingFactor}
                      onChange={handleSpecificityWeightScalingFactorChange()}
                      aria-labelledby="input-slider"
                      step={0.01}
                      min={0}
                      max={1}
                    />
          </Grid> 
      </Grid> */}

     {/* cut to insert weight change */}
      {/* <Grid container spacing={2} columns={16}  sx = {{pl:4}}>
          <Grid item xs={8}>
            <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
            Cut to insert (α2)
              </Typography>
            </Grid>
          <Grid item xs={2}>
            <TextField 
              sx={{width: 35 }}
              required          
              rows={1} 
              id="outlined-basic" 
              variant="standard"
              size="small"
              value = {parentToChildCut2InsertDistWeightScalingFactor}
              onChange={handleCut2InsertDistWeightScalingFactorChange()}
              />
          </Grid>
          <Grid item xs={6} >
            <Slider sx={{ width: 85, ml: 2 }} 
                      value={parentToChildCut2InsertDistWeightScalingFactor}
                      onChange={handleCut2InsertDistWeightScalingFactorChange()}
                      aria-labelledby="input-slider"
                      step={0.01}
                      min={0}
                      max={1}
                    />
          </Grid> 
      </Grid> */}
          

     {/* position weight change */}
     {/* <Grid container spacing={2} columns={16}  sx = {{pl:4}}>
          <Grid item xs={8}>
            <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
            Position (α3)
              </Typography>
            </Grid>
          <Grid item xs={2}>
            <TextField 
              sx={{width: 35 }}
              required          
              rows={1} 
              id="outlined-basic" 
              variant="standard"
              size="small"
              value = {parentToChildPositionWeightScalingFactor}
              onChange={handlePositionWeightScalingFactorChange()}
              disabled = {!parentToChildpenalizeReg}
              />
          </Grid>
          <Grid item xs={6}>
            <Slider sx={{ width: 85, ml: 2}} 
                      value={parentToChildPositionWeightScalingFactor}
                      onChange={handlePositionWeightScalingFactorChange()}
                      aria-labelledby="input-slider"
                      step={0.01}
                      min={0}
                      max={1}
                      disabled = {!parentToChildpenalizeReg}
                    />
          </Grid> 
      </Grid>

      </Box> */}



    </Card>
  );
}


