/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
import React, { useState } from "react";
// import Timer from 'react-timer-wrapper';
// import Timecode from 'react-timecode';
// import { useStopwatch } from 'react-timer-hook';
import PropTypes from 'prop-types';
// @mui
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { Card, Typography, TextField, Stack, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LoadingButton from '@mui/lab/LoadingButton';
import DownloadIcon from '@mui/icons-material/Download';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import SimpleButton from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// const bcrypt = require("bcryptjs")
import bcryptjs from 'bcryptjs';

// axios
import axios from 'axios';

//
// import { max } from "lodash";

// alert
import { useAlert } from 'react-alert'
import Iconify from '../components/Iconify';
// import ThemeProvider from '../theme';
// sections
import {
  AppDNAdonor,
  AppGeneGenome,
  AppgRNA,
  AppPrimer,
} from '../sections/@dashboard/app';
// import { RequestPageRounded } from "@mui/icons-material";
// import { el } from "date-fns/locale";

// import { sub } from "date-fns";
// import { set } from "lodash";
// import { set } from "lodash";
// import { SettingsRemoteRounded } from '@mui/icons-material';
// ----------------------------------------------------------------------

let subData = []; // submission list
let primerResults = []; // primer design result
let primerResultsCsv = "Entry,Genome,Chromosome,Edit position coordinate,ID,Gene symbol,Retry count,Primer Pair 1 For,Primer Pair 1 Rev,Primer Pair 1 For tm,Primer Pair 1 Rev tm,Primer Pair 1 Prod Size,Primer Pair 2 For,Primer Pair 2 Rev,Primer Pair 2 For tm,Primer Pair 2 Rev tm,Primer Pair 2 Prod Size,Primer Pair 3 For,Primer Pair 3 Rev,Primer Pair 3 For tm,Primer Pair 3 Rev tm,Primer Pair 3 Prod Size\n";

// stepper
const steps = ['Build Job', 'or Upload CSV', 'Review Submission', 'Jam it!', 'View and Download Results'];
  
const stepperTheme = createTheme({
  labelContainer: {
    "& $alternativeLabel": {
      marginTop: 0
    }
  },
  step: {
    "& $completed": {
      color: "lightgreen"
    },
    "& $active": {
      color: "pink"
    },
    "& $disabled": {
      color: "red"
    }
  },
  alternativeLabel: {},
  active: {}, // needed so that the &$active tag works
  completed: {},
  disabled: {},
});

const TokenTextField = styled(TextField)({
  backgroundColor: "#eee",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none"
  },
  "&.Mui-focused": {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none"
    }
  }
});

function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i+=1) {
          byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: mimeType});
  return blob;
}

const downloadZipFile = (blob,filename) => {
  // const file = new Blob([mydata], {type: 'data:text/csv;charset=utf-8'});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};


export default function DashboardApp() {
  // privary button
  const [privaryOpen, setPrivaryOpen] = React.useState(false);
  const handlePrivacyButton = () => {
    if (privaryOpen === false)
      setPrivaryOpen(true)
    else
      setPrivaryOpen(false)
  };
  const handleReportBugButton = () => {
    window.open('https://forms.gle/FjiXKdbYLaxsPp7aA', '_blank')
  };    
  // tabs
  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };     

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = (step) => {
    const newCompleted = completed;
    newCompleted[step] = true;
    setCompleted(newCompleted);
    // handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setLoginBackdropOpen(false);

    // clear examples, sublist, results
    ClearExample();
    clearSubList();
    UpdateResTable([]);
    primerResults=[];
    UpdatePrimerTable([]);
    primerResultsCsv = "Entry,Genome,Chromosome,Edit position coordinate,ID,Gene symbol,Retry count,Primer Pair 1 For,Primer Pair 1 Rev,Primer Pair 1 For tm,Primer Pair 1 Rev tm,Primer Pair 1 Prod Size,Primer Pair 2 For,Primer Pair 2 Rev,Primer Pair 2 For tm,Primer Pair 2 Rev tm,Primer Pair 2 Prod Size,Primer Pair 3 For,Primer Pair 3 Rev,Primer Pair 3 For tm,Primer Pair 3 Rev tm,Primer Pair 3 Prod Size\n";


    // disable res download
    UpdateDownloadButton("",true,"");
    UpdateDownloadinputButton("",true,"");
    UpdateDownloadPrimerResultButton("",true,"")

    // reset parameters
    resetParams();

    // reset primers
    setPrimerOnOff(false)

  };

  // gRNA num
  const [gRNAnum, setgRNAnum] = useState(1);
  const gRNAnumToParent = (childdata) => {
    setgRNAnum(childdata)
  }
  // penalize gRNA cutting in/near regulatory regions
  const [penalizeReg, setpenalizeReg] = useState(true);
  const penalizeRegToParent = (childdata) => {
    setpenalizeReg(childdata)
  }
  // HA length
  const [HAlen, setHAlen] = useState(500);
  const HAlenToParent = (childdata) => {
    setHAlen(childdata)
  }
  // payload
  const [Tag, setTag] = useState('ACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG');
  const TagToParent = (childdata) => {
    setTag(childdata)
  }
  const [Linker, setLinker] = useState('GGTGGTGGTGGTTCTGGTGGTGGTGGTTCT');
  const LinkerToParent = (childdata) => {
    setLinker(childdata)
  }  

  const [TagName, setTagName] = useState('mNG11');
  const TagNameToParent = (childdata) => {
    setTagName(childdata)
  }
  const [LinkerName, setLinkerName] = useState('HRV_3C_cleavable_linker');
  const LinkerNameToParent = (childdata) => {
    setLinkerName(childdata)
  }  

  // N C payload 
  const [Npayload, setNpayload] = React.useState('');
  const NpayloadToParent = (childdata) => {
    setNpayload(childdata)
  }
  const [Cpayload, setCpayload] = React.useState('');
  const CpayloadToParent = (childdata) => {
    setCpayload(childdata)
  }
  const [PosPayload, setPosPayload] = React.useState('');
  const PosPayloadToParent = (childdata) => {
    setPosPayload(childdata)
  }
  // payload seq
  const [PayloadSeq, setPayloadSeq] = React.useState('');
  const PayloadSeqtoParent = (childdata) => {
    setPayloadSeq(childdata)
  }; 

  // cfd threshold
  const [cfdThres, setCfdThres] = React.useState(0.03);
  const cfdThresToParent = (childdata) => {
    setCfdThres(childdata)
  }; 

  // Payload mode
  const [PayloadMode, setPayloadMode] = useState('');
  const PayloadModeToParent = (childdata) => {
    setPayloadMode(childdata)
    if (childdata === "TwoPayloads")
    {
      setShowTwoPayloadInput(true)
      setShowOnePayloadInput(false)
      setShowTagAndLinkerPayloadInput(false)
    }
    if (childdata === "OnePayLoad")
    {
      setShowTwoPayloadInput(false)
      setShowOnePayloadInput(true)
      setShowTagAndLinkerPayloadInput(false)
    }
    if (childdata === "TagAndLinker")
    {
      setShowTwoPayloadInput(false)
      setShowOnePayloadInput(false)
      setShowTagAndLinkerPayloadInput(true)
    }
  }

  // tag linker order
  const [tagLinkerOrder, setTagLinkerOrder] = useState('linkerFirst');
  const tagLinkerOrderToParent = (childdata) => {
    setTagLinkerOrder(childdata)
   // console.log(childdata)
  }
  
 // Payload input visibility
 const [ShowTwoPayloadInput, setShowTwoPayloadInput] = React.useState(false);
 const [ShowOnePayloadInput, setShowOnePayloadInput] = React.useState(false);
 const [ShowTagAndLinkerPayloadInput, setShowTagAndLinkerPayloadInput] = React.useState(false);

  // recode mode
  const [recodeIntensity, setrecodeIntensity] = useState('full');
  const recodeIntensityToParent = (childdata) => {
    setrecodeIntensity(childdata)
    if ((childdata === "full" || childdata === "stop_recut_only")
         && DonorSSDS==="ssODN"){
      setShowMutateOrder(true)
    }
    else{
      setShowMutateOrder(false)
    }
  }  

  // Recode only in coding region
  const [RecodeOnlyInCodingRegion, setRecodeOnlyInCodingRegion] = useState(false);
  const RecodeOnlyInCodingRegionToParent = (childdata) => {
    setRecodeOnlyInCodingRegion(childdata)
    // console.log(childdata)
  }

  // Donor ss/ds
  const [DonorSSDS, setDonorSSDS] = React.useState("ssODN");
  const DonorSSDStoParent = (childdata) => {
    setDonorSSDS(childdata)
    if ((recodeIntensity === "full" || recodeIntensity === "stop_recut_only") 
          && childdata==="ssODN"){
      setShowMutateOrder(true)
    }
    else{
      setShowMutateOrder(false)
    }
  }  

  // ss strand choice
  const [strandChoice, setstrandChoice] = React.useState("auto");
  const StrandChoiceToParent = (childdata) => {
    setstrandChoice(childdata)
  }  

  // mutate order (PAM vs protospacer)
  const [ShowMutateOrder, setShowMutateOrder] = React.useState(true);
  const [MutateOrder, setMutateOrder] = React.useState("PAM_first");
  const MutateOrderChangeToParent = (childdata) => {
    setMutateOrder(childdata)
    if (childdata === "PAM_first")
      {setMutateOrderPAMfirst(true)}
    else
      {setMutateOrderPAMfirst(false)}
  }
  const [MutateOrderPAMfirst, setMutateOrderPAMfirst] = React.useState(true);

  // enforce max donor length
  const [EnforceMaxDonLen, setEnforceMaxDonLen] = useState(true);
  const enforceMaxDonLenToParent = (childdata) => {
    setEnforceMaxDonLen(childdata)
  }  

  // max donor size
  const [MaxDonLen, setMaxDonLen] = useState(200);
  const MaxDonLenToParent = (childdata) => {
    setMaxDonLen(childdata)
  }

  // DonorSize
  const [DonorSize, setDonorSize] = useState(200);

  // Genome
  const [Genome, setGenome] = useState('GRCh38');
  const GenomeToParent = (childdata) => {
    setGenome(childdata)
  }

  // Nuclease
  const [Nuclease, setNuclease] = useState('SpCas9');
  const NucleaseToParent = (childdata) => {
    setNuclease(childdata)
  }

  // Input gene
  const [Genes, setGenes] = useState('');
  const GenesToParent = (childdata) => {
    setGenes(childdata)
  }

  //  PrimerOnOff
  const [PrimerOnOff, setPrimerOnOff] = useState(false);
  const PrimerSearchOnOffToParent = (childdata) => {
    setPrimerOnOff(childdata)
  }
  // amplicon size
  const [AmpliconSize, setAmpliconSize] = useState(250);

  // Primer mode
  const [PrimerMode, setPrimerMode] = useState("short");
  const PrimerModeToParent = (childdata) => {
    setPrimerMode(childdata)
    if (childdata === "short")
    {
      setAmpliconSize(250)
      
    }
    if (childdata === "long")
    {
      setAmpliconSize(3300)
      
    }
  }
  // tunePrimers
  const [TunePrimers, setTunePrimers] = useState(false);
  const TunePrimersToParent = (childdata) => {
    setTunePrimers(childdata)
  }
  // primer options
  const [PrimerOptions, setPrimerOptions] = useState({
    prod_size_lower: 250,
    prod_size_upper: 350,
    Tm_lower:57,
    Tm_upper:63,
    Tm_opt:60,
  });

  const PrimerOptionsToParent = (childdata) => {
    setPrimerOptions(childdata)
    setAmpliconSize(childdata.prod_size_lower) // set amplicon size to the lower bound of the product size
  }

  // SelectedEnzymes
  const [SelectedEnzymes, setSelectedEnzymes] = useState("");
  const SelectedEnzymeToParent = (childdata) => {
    setSelectedEnzymesList(childdata)
    setSelectedEnzymes(childdata.join("|"))
  }
  // SelectedEnzymes (list form)
  const [SelectedEnzymesList, setSelectedEnzymesList] = useState([]);

  // Custom Seq to avoid
  const [CustomSeq2Avoid, setCustomSeq2Avoid] = useState("");
  const CustomSeq2AvoidToParent = (childdata) => {
    setCustomSeq2Avoid(childdata)
  }
  // Minimum post trim arm length
  const [MinArmLenPostTrim, setMinArmLenPostTrim] = useState(300);
  const MinArmLenPostTrimToParent = (childdata) => {
    setMinArmLenPostTrim(childdata)
  }

  // cut to insert distance weight
  const [Cut2InsertDistWeightScalingFactor, setCut2InsertDistWeightScalingFactor] = useState(1);
  const Cut2InsertDistWeightScalingFactorToParent = (childdata) => {
    setCut2InsertDistWeightScalingFactor(childdata)
  }

  // specificity weight
  const [SpecificityWeightScalingFactor, setSpecificityWeightScalingFactor] = useState(1);
  const SpecificityWeightScalingFactorToParent = (childdata) => {
    setSpecificityWeightScalingFactor(childdata)
  }

  // position weight
  const [PositionWeightScalingFactor, setPositionWeightScalingFactor] = useState(1);
  const PositionWeightScalingFactorToParent = (childdata) => {
    setPositionWeightScalingFactor(childdata)
  }

  // Token
  const [TokenEntered, setTokenEntered] = useState("");
  const updateTokedEntered = (event) => {
    setTokenEntered(event.target.value)
  }

  const handleTokenSubmitClick = () => {
    const salt = bcryptjs.genSaltSync(10);
    const newhash = bcryptjs.hashSync("Token", salt);

    const hash = '$2a$10$C53ts7VnmiI..rFGnXTWnOTvtjIjsnywtvD07AIY2jC7EFg45JUDe'
    const hash2 = '$2a$10$kE07XAtZTMjtYT4YBpt16OCrX3x9u5ZN.QcgG8vfqgUy0/iivTtTG'
    if (bcryptjs.compareSync(TokenEntered, hash) || bcryptjs.compareSync(TokenEntered, hash2)){
      setLoginBackdropOpen(false)
    }
    else
    {
      alert.error('Incorrect invitation code')
    }
  };

  const [showToken, setshowToken] = useState(false);


  
  const resetParams = () => {
    setgRNAnum("1")
    setNuclease("SpCas9")
    setHAlen('500')
    setNpayload("")
    setNpayload("")
    setPosPayload("")
    setPayloadSeq("")
    setCfdThres(0.03)
    setPayloadMode("")
    setTagLinkerOrder('linkerFirst')
    setrecodeIntensity("full")
    setRecodeOnlyInCodingRegion(false)
    setShowMutateOrder(true)
    setDonorSSDS("ssODN")
    setstrandChoice("NonTargetStrand")
    setMutateOrder("PAM_first")
    setMutateOrderPAMfirst(true)
    setEnforceMaxDonLen(true)
    setMaxDonLen(200)
    setGenome('GRCh38')
    setGenes("")
    setSelectedEnzymes("")
    setCustomSeq2Avoid("")
    setMinArmLenPostTrim(200)
    setpenalizeReg(true)
  }

  const handleDeleteRow = (EntryNumToDelete) => {
    subData = subData.filter(row => row.EntryNum !== EntryNumToDelete); // remove the row from the list
    UpdateSubTable(); // update the table
  }; 

  // // timer
  //   const [elapsedTime, setElapsedTime] = useState();
  //   const GenerateElapsedTimeText = (hours, minutes,seconds) => {
        
  //         if (hours === 0 && minutes ===0)
  //         {
  //           setElapsedTime(
  //               <p>Job finished in <b><span>{seconds} sec</span></b></p>
  //           )
  //         }
  //         else if (hours === 0 )
  //         {
  //           setElapsedTime(
  //             <p>Job finished in <b><span>{minutes} min</span>, <span>{seconds} sec</span></b></p>
  //         )
  //         }
  //         else
  //         {
  //         <p>Job finished in <b><span>{hours} hr</span>, <span>{minutes} min</span>, <span>{seconds} sec</span></b></p>
  //         }
  //   }

  // table
  function createData(EntryNum, ID, chr, transcriptType, name,terminus,gRNAName,gRNASeq,PAM,gRNAStart,gRNAEnd,cutPos,editPos,distanceBetweenCutAndEdit,specificityScore,SpecificityWeightScalingFactor,distanceWeight,PositionWeightScalingFactor,finalWeight,cfdBeforeRecoding,cfdAfterRecoding,cfdAfterWindowScanAndRecoding,maxRecutCfd,donorName,donorSeq,trimmedDonorName,trimmedDonorSeq,effectiveHAlen,synthesisProblems,cutPos2nearestOffLimitJunc,strands) {
    return {EntryNum, ID, chr, name,terminus,gRNAName,gRNASeq,editPos,distanceBetweenCutAndEdit,specificityScore,maxRecutCfd,donorName,donorSeq,trimmedDonorName,trimmedDonorSeq,effectiveHAlen,synthesisProblems,strands,
            info:[
                  {
                    transcriptType, // property shorthand
                    PAM,
                    gRNAStart,
                    gRNAEnd,
                    cutPos,
                    SpecificityWeightScalingFactor,
                    distanceWeight,
                    PositionWeightScalingFactor,
                    finalWeight,
                    cfdAfterRecoding,
                    cfdAfterWindowScanAndRecoding,
                  }
                ],
            };
  }

  // supporting fuctions for the res table
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          </TableCell>
          {/* <TableCell component="th" scope="row">
            {row.name}
          </TableCell> */}
          <TableCell align="center">{row.EntryNum}</TableCell>
          <TableCell align="center">{row.ID}</TableCell>
          <TableCell align="center">{row.chr}</TableCell>
          <TableCell align="center">{row.name}</TableCell> 
          <TableCell align="center">{row.terminus}</TableCell>
          <TableCell align="center">{row.editPos}</TableCell>
          <TableCell align="center">{row.gRNAName}</TableCell>
          <TableCell align="center">{row.gRNASeq}</TableCell>
          <TableCell align="center">
          <div style={{display: "block", width: '100px', whiteSpace: "nowrap",}}>{row.distanceBetweenCutAndEdit}
          </div>
          </TableCell>
          <TableCell align="center">{row.specificityScore}</TableCell>
          <TableCell align="center">{row.maxRecutCfd}</TableCell>
          <TableCell align="center">{row.donorName}</TableCell>
          <TableCell align="left">
                    <div style={{display: "block", width: '200px', whiteSpace: "nowrap",  overflow: "auto"}}>
                    {row.donorSeq}
                    </div>
          </TableCell>
          <TableCell align="center">{row.trimmedDonorName}</TableCell>
          <TableCell align="left">
                    <div style={{display: "block", width: '200px', whiteSpace: "nowrap",  overflow: "auto"}}>
                    {row.trimmedDonorSeq}
                    </div>
          </TableCell>
          <TableCell align="center">{row.effectiveHAlen}</TableCell>
          <TableCell align="center">
                    <div style={{display: "block", maxWidth: '200px', whiteSpace: "nowrap",  overflow: "auto"}}>
                    {row.synthesisProblems}
                    </div></TableCell>
          <TableCell align="center">{row.strands}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>

                <Table size="small" aria-label="purchases" style={{backgroundColor:'#c4c4c4', fontSize:5}}>
                  <TableHead>
                    <TableRow >
                      {/* <TableCell>Transcript type</TableCell> */}
                      <TableCell align="center">PAM</TableCell>
                      <TableCell align="center"><div style={{width: '80px', whiteSpace: "normal"}}>gRNA start</div></TableCell>
                      <TableCell align="center"><div style={{width: '80px', whiteSpace: "normal"}}>gRNA end</div></TableCell>
                      <TableCell align="center">Cut position</TableCell>
                      <TableCell align="center">gRNA specificity weight</TableCell>
                      <TableCell align="center">gRNA distance weight</TableCell>
                      <TableCell align="center">gRNA position weight</TableCell>
                      <TableCell align="center">gRNA score
                        <CustomWidthTooltip  title="The total score is calculated from three weights: specificity weight, distance weight and the position weight.For weight details, see the algorithm tab.">
                                    <IconButton>
                                      <HelpOutlineIcon fontSize="small"/>
                                    </IconButton>
                        </CustomWidthTooltip>
                      </TableCell>

                      <TableCell align="center">
                        <div style={{width: '150px', whiteSpace: "normal"}}>Recut potential after recoding
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div style={{width: '220px', whiteSpace: "normal"}}>
                          Recut potential after scanning and recoding chimeric region
                        </div>
                        </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.info.map((infoRow) => (
                      <TableRow key={infoRow.transcriptType}>
                        <TableCell component="th" scope="row">{infoRow.PAM}</TableCell>
                        <TableCell>{infoRow.gRNAStart}</TableCell>
                        <TableCell align="center">{infoRow.gRNAEnd}</TableCell>
                        <TableCell align="center">{infoRow.cutPos}</TableCell>
                        <TableCell align="center">{infoRow.SpecificityWeightScalingFactor}</TableCell>
                        <TableCell align="center">{infoRow.distanceWeight}</TableCell>
                        <TableCell align="center">{infoRow.PositionWeightScalingFactor}</TableCell>
                        <TableCell align="center">{infoRow.finalWeight}</TableCell>
                        <TableCell align="center">{infoRow.cfdAfterWindowScanAndRecoding}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
  Row.propTypes = {
    row: PropTypes.shape({
      EntryNum: PropTypes.string.isRequired,
      ID: PropTypes.string.isRequired,
      chr: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      terminus: PropTypes.string.isRequired,
      info: PropTypes.arrayOf(
        PropTypes.shape({
          transcriptType: PropTypes.string.isRequired,
          PAM: PropTypes.string.isRequired,
          gRNAStart: PropTypes.string.isRequired,
          gRNAEnd: PropTypes.string.isRequired,
          cutPos: PropTypes.string.isRequired,
          SpecificityWeightScalingFactor: PropTypes.string.isRequired,
          distanceWeight: PropTypes.string.isRequired,
          PositionWeightScalingFactor: PropTypes.string.isRequired,
          cfdAfterRecoding: PropTypes.string.isRequired,
          cfdAfterWindowScanAndRecoding: PropTypes.string.isRequired,
        }),
      ).isRequired,
      editPos: PropTypes.string.isRequired,
      gRNAName: PropTypes.string.isRequired,
      gRNASeq: PropTypes.string.isRequired,
      distanceBetweenCutAndEdit: PropTypes.string.isRequired,
      specificityScore: PropTypes.string.isRequired,
      finalWeight: PropTypes.string.isRequired,
      maxRecutCfd: PropTypes.string.isRequired,
      donorName: PropTypes.string.isRequired,
      donorSeq: PropTypes.string.isRequired,
      trimmedDonorName: PropTypes.string.isRequired,
      trimmedDonorSeq: PropTypes.string.isRequired,
      effectiveHAlen: PropTypes.string.isRequired,
      synthesisProblems: PropTypes.string.isRequired,
      strands: PropTypes.string.isRequired,
    }).isRequired,
  };

  const [resTable, setResTable] = React.useState();
  const UpdateResTable = (rows) => {
          setResTable(
            <Paper sx={{ width: '98%' }}>
                        {/* <Typography align = "center" gutterBottom = "true" variant = "h5"><br/>Results
                        </Typography> */}
                        <TableContainer component={Paper}>
                        <Table aria-label="collapsible table" size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell />
                              <TableCell align="center">Entry#</TableCell>
                              <TableCell align="center">Ensembl ID</TableCell>
                              <TableCell align="center">Chr</TableCell>
                              <TableCell align="center">Gene symbol</TableCell>
                              <TableCell align="center">Terminus</TableCell>
                              <TableCell align="center">Edit position</TableCell>
                              <TableCell align="center">Protospacer name</TableCell>
                              <TableCell align="center">Protospacer</TableCell>
                              <TableCell align="center">
                                  <div style={{width: '85px', whiteSpace: "normal"}}>
                                    Distance between cut and edit (bp)
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div style={{width: '50px', whiteSpace: "normal"}}>
                                    MIT specifcity score (0-100)
                                  </div>
                              </TableCell>
                              
                              <TableCell align="center">Recut potential (0-1) 
                                  <CustomWidthTooltip  title="The recut potential is measured in CFD score, if CFD score <0.03, the edited sequence is considered not suceptible to recut">
                                  <IconButton>
                                    <HelpOutlineIcon fontSize="small"/>
                                  </IconButton>
                                  </CustomWidthTooltip>
                              </TableCell>
                              <TableCell align="center">Donor name</TableCell>
                              <TableCell align="center">DNA donor</TableCell>
                              <TableCell align="center">Trimmed donor name</TableCell>
                              <TableCell align="center">Trimmed DNA donor</TableCell>
                              <TableCell align="center">Effective homology arm length</TableCell>
                              <TableCell align="center">Synthesis problems</TableCell>
                              <TableCell align="center">Strands(gene/gRNA/donor)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row) => (
                              <Row key={row.name} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
          </Paper>
          )
  };

  
    // supporting fuctions for the primer table
    function PrimerRow(props) {
      const { row } = props;

      return (
        <>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell align="center">{row.Entry}</TableCell>
            <TableCell align="center">{row.ref}</TableCell>
            <TableCell align="center">{row.chr}</TableCell>
            <TableCell align="center">{row.coordinate}</TableCell>
            <TableCell align="center">{row.ID}</TableCell>
            <TableCell align="center">{row.geneSymbol}</TableCell>
            <TableCell align="center">{row.ConstraintsRelaxationIterations}</TableCell>
            <TableCell align="center">{row.PrimerPair1For}</TableCell>
            <TableCell align="center">{row.PrimerPair1Rev}</TableCell>
            <TableCell align="center">{row.PrimerPair1ForTm}</TableCell>
            <TableCell align="center">{row.PrimerPair1ProdSize}</TableCell>
            <TableCell align="center">{row.PrimerPair2For}</TableCell>
            <TableCell align="center">{row.PrimerPair2Rev}</TableCell>
            <TableCell align="center">{row.PrimerPair2ForTm}</TableCell>
            <TableCell align="center">{row.PrimerPair2ProdSize}</TableCell>
            <TableCell align="center">{row.PrimerPair3For}</TableCell>
            <TableCell align="center">{row.PrimerPair3Rev}</TableCell>
            <TableCell align="center">{row.PrimerPair3ForTm}</TableCell>
            <TableCell align="center">{row.PrimerPair3ProdSize}</TableCell>
            
          </TableRow>
        </>
      );
    }
  
    PrimerRow.propTypes = {
      row: PropTypes.shape({
        Entry: PropTypes.string.isRequired,
        ref: PropTypes.string.isRequired,
        chr: PropTypes.string.isRequired,
        coordinate: PropTypes.string.isRequired,
        ConstraintsRelaxationIterations: PropTypes.string.isRequired,
        PrimerPair1For: PropTypes.string.isRequired,
        PrimerPair1Rev: PropTypes.string.isRequired,
        PrimerPair1ForTm: PropTypes.string.isRequired,
        PrimerPair1RevTm: PropTypes.string.isRequired,
        PrimerPair1ProdSize: PropTypes.string.isRequired,
        PrimerPair2For: PropTypes.string.isRequired,
        PrimerPair2Rev: PropTypes.string.isRequired,
        PrimerPair2ForTm: PropTypes.string.isRequired,
        PrimerPair2RevTm: PropTypes.string.isRequired,
        PrimerPair2ProdSize: PropTypes.string.isRequired,
        PrimerPair3For: PropTypes.string.isRequired,
        PrimerPair3Rev: PropTypes.string.isRequired,
        PrimerPair3ForTm: PropTypes.string.isRequired,
        PrimerPair3RevTm: PropTypes.string.isRequired,
        PrimerPair3ProdSize: PropTypes.string.isRequired,
      }).isRequired,
    };

  const [primerTable, setPrimerTable] = React.useState();
  const UpdatePrimerTable = (rows) => {
          setPrimerTable(
            <Paper sx={{ width: '98%' }}>
                        {/* <Typography align = "center" gutterBottom = "true" variant = "h5"><br/>Results
                        </Typography> */}
                        <TableContainer component={Paper}>
                        <Table aria-label="collapsible table" size="small">
                          <TableHead>
                              <TableRow>
                                  <TableCell align="center" colSpan={5}>
                                    Amplicon center info
                                  </TableCell>
                                  <TableCell align="center" colSpan={4}>
                                    Primer pair 1
                                  </TableCell>
                                  <TableCell align="center" colSpan={4}>
                                    Primer pair 2
                                  </TableCell>
                                  <TableCell align="center" colSpan={4}>
                                    Primer pair 3
                                  </TableCell>
                               </TableRow>
                            <TableRow>
                              <TableCell align="center">Entry#</TableCell>
                              <TableCell align="center">Genome</TableCell>
                              <TableCell align="center">Chromosome</TableCell>
                              <TableCell align="center">Edit position coordinate</TableCell>
                              <TableCell align="center">ID</TableCell>
                              <TableCell align="center">Gene symbol</TableCell>
                              <TableCell align="center">Relax count</TableCell>
                              <TableCell align="center">For</TableCell>
                              <TableCell align="center">Rev</TableCell>
                              <TableCell align="center">Tm</TableCell>
                              <TableCell align="center">Prod. size</TableCell>
                              <TableCell align="center">For</TableCell>
                              <TableCell align="center">Rev</TableCell>
                              <TableCell align="center">Tm</TableCell>
                              <TableCell align="center">Prod. size</TableCell>
                              <TableCell align="center">For</TableCell>
                              <TableCell align="center">Rev</TableCell>
                              <TableCell align="center">Tm</TableCell>
                              <TableCell align="center">Prod. size</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row) => (
                              <PrimerRow key={row.name} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
          </Paper>
          )
  };

  // gRNA result download
  const [DownloadResultButton, setDownloadResultButton] = React.useState();
  const onDownload = (mydata,filename) => {
    const file = new Blob([mydata], {type: 'data:text/csv;charset=utf-8'});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = filename;
    // link.href = `data:text/csv;charset=utf-8${mydata}`;

    // simulate link click
    // document.body.appendChild(link); // Required for this to work in FireFox
    link.click();
  };

  // const [DownloadButtonDislabed,setDownloadResultButtonDisabled] = React.useState(false);
  const UpdateDownloadButton = (mydata,disabled,jobID) => {
    setDownloadResultButton(
                        <SimpleButton variant="outlined"
                            onClick={() => onDownload(mydata, `${jobID}_results.csv`)} //  need pass to onClick reference to function,  passing {onDownload(mydata)} will not work, because you call function and pass to onClick value
                            endIcon={<DownloadIcon  fontSize="medium"/>}
                            sx={{ textTransform: 'none' }}
                            disabled={disabled}
                        >
                        Download result table (csv)
                        </SimpleButton>
    );
  };

  // input download
  const [DownloadInputButton, setDownloadInputButton] = React.useState();
  const onDownloadInput = (myInput,filename) => {
    const file = new Blob([myInput], {type: 'data:text/csv;charset=utf-8'});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = filename;
    // link.href = `data:text/csv;charset=utf-8${mydata}`;

    // simulate link click
    // document.body.appendChild(link); // Required for this to work in FireFox
    link.click();
  };

  const UpdateDownloadinputButton = (myinput,disabled, jobID) => {
    setDownloadInputButton(
                      
                        <SimpleButton variant="outlined"
                            onClick={() => onDownloadInput(myinput,`${jobID}_input.csv`)} //  need pass to onClick reference to function,  passing {onDownload(mydata)} will not work, because you call function and pass to onClick value
                            endIcon={<DownloadIcon  fontSize="medium"/>}
                            sx={{ textTransform: 'none' }}
                            disabled={disabled}
                        >
                        Download submission list (csv)
                        </SimpleButton>
    );
  };

  
  // download gb files
  const [DownloadGenBankZipButton, setDownloadGenBankZipButton] = React.useState();
  const onGenBankZip = (b64EncodedZipFile, filename) => {
    const gbZipBlob = base64ToBlob(b64EncodedZipFile, "application/zip");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(gbZipBlob);
    link.download = filename;
    link.click();
  };

  const UpdateDownloadGenBankZipButton = (b64EncodedZipFile, disabled, jobID) => {
    setDownloadGenBankZipButton(
                        <SimpleButton variant="outlined"
                            onClick={() => onGenBankZip(b64EncodedZipFile,`${jobID}_GenBank_files.zip`)} //  need pass to onClick reference to function,  passing {onDownload(mydata)} will not work, because you call function and pass to onClick value
                            endIcon={<DownloadIcon  fontSize="medium"/>}
                            sx={{ textTransform: 'none' }}
                            disabled={disabled}
                        >
                        Download annotated DNA donor (GenBank files)
                        </SimpleButton>
    );
  }


  // Primer result download
  const [DownloadPrimerResultButton, setDownloadPrimerResultButton] = React.useState();
  const onDownloadPrimer = (mydata,filename) => {
    const file = new Blob([mydata], {type: 'data:text/csv;charset=utf-8'});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = filename;
    // link.href = `data:text/csv;charset=utf-8${mydata}`;

    // simulate link click
    // document.body.appendChild(link); // Required for this to work in FireFox
    link.click();
  };

  const UpdateDownloadPrimerResultButton = (mydata,disabled, jobID) => {
    setDownloadPrimerResultButton(
                        <SimpleButton variant="outlined"
                            onClick={() => onDownloadPrimer(mydata,`${jobID}_primers.csv`)} //  need pass to onClick reference to function,  passing {onDownload(mydata)} will not work, because you call function and pass to onClick value
                            endIcon={<DownloadIcon  fontSize="medium"/>}
                            sx={{ textTransform: 'none' }}
                            disabled={disabled}
                        >
                        Download primer results (csv)
                        </SimpleButton>
    );
  };

  // Alert
  const alert = useAlert()

  // submit button state// submit action
  const [loading, setLoading] = React.useState(false);
  const [launchDisabled, setLaunchDisabled] = React.useState(false);

  const handleLaunchButton = () => {
      let pJAMready = true;
      let _payloadSize = 0;
      setLoading(true);
      // clear results
      UpdateResTable([]);
      // disable download buttons
      UpdateDownloadButton("",true,"");
      UpdateDownloadinputButton("",true,"");
      UpdateDownloadGenBankZipButton("",true, "")
      UpdateDownloadPrimerResultButton("",true, "")
      
      // start(); // start timer
      // check primer settings

      // compute payload size
      if (PayloadMode === "TwoPayloads")
      {
        _payloadSize = Math.max(Npayload.length, Cpayload.length, PosPayload.length)
      }
      if (PayloadMode === "OnePayLoad")
      {
        _payloadSize = PayloadSeq.length
      }
      if (PayloadMode === "TagAndLinker")
      {
        _payloadSize = Tag.length + Linker.length
      }
          // console.log("PrimerOnOff", PrimerOnOff)
      // console.log("DonorSSDS",DonorSSDS)
      // console.log("AmpliconSize",AmpliconSize)
      // console.log("MaxDonLen",MaxDonLen)
      // console.log("payloadSize",_payloadSize)
      // console.log("PayloadMode",PayloadMode)

      // check if payload can fit into the donor
      if (DonorSSDS === "ssODN")
      {
        if (_payloadSize > MaxDonLen)
        {
          alert.error(<div style={{ textTransform: 'initial' }}>In at least one entry, the payload size ({_payloadSize}) is larger than the donor size ({MaxDonLen}), and the donor will lack homology arms. </div>, {position:'middle', timeout: 30000,})
          pJAMready = false;
        }
      }
    
      // check if amplicon size is smaller than donor size
      if (PrimerOnOff)
      {
        if (DonorSSDS === "ssODN")
        {
          if (AmpliconSize < MaxDonLen)
          {
            alert.error(<div style={{ textTransform: 'initial' }}> Warning: Amplicon size ({AmpliconSize}) is smaller than the donor size ({MaxDonLen}), PCR amplicons could be generated from the DNA donors in cells</div>, {position:'middle', timeout: 30000,})
            pJAMready = false;
          }
        }
          else if (DonorSSDS === "dsDNA")
          {
            if (AmpliconSize < _payloadSize + 2*HAlen)
            {
              alert.error(<div style={{ textTransform: 'initial' }}> Warning: Amplicon size ({AmpliconSize}) is smaller than the donor size ({_payloadSize + 2*HAlen}), PCR amplicons could be generated from the DNA donors in cells</div>, {position:'middle', timeout: 30000,})
              pJAMready = false;
            }
          }
        
      }

      // check submission list
      if (subData.length !== 0 && pJAMready === true)
      {
        runProtoSpaceJAM();
      }
      else{
        if (subData.length === 0)
        {
          alert.error(<div style={{ textTransform: 'initial' }}>Submission list is empty</div>, {position:'middle', timeout: 20000,})
          setLoading(false);
        }
        if (pJAMready === false)
        {
          setLoading(false);
        }
      }

  };
   
  const handleSubListConfirmButton = () => {
    if (subData.length<=384)
    {
      handleComplete(2);
      setActiveStep(3)
    }
    else
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Submission list is too long, a maximum of 384 entries are allowed</div>, {position:'middle', timeout: 10000,})
    }
  }

 // reset button
  const RestSubmitButton = () =>{
    setLoading(false)
  }

  // call Django, execute protospacejam on the whole submission list 
  const runProtoSpaceJAM = () => {
        TurnOnBackDrop();
        setpJAMProgressShow(true);
        autoUpdatepJAMprogress(Object.keys(subData).length);
        // console.log(subData)
        const starttime = new Date();
        axios({
            method: "POST",
            url:"/API_name_pJAM", 
            data:subData,
            maxContentLength: 100*1024*1024, // 100Mb
            maxBodyLength: 100*1024*1024, // 100Mb

          })
          .then((response) => {  // success
            // console.log(response)
            // generate table rows from data received from CLI

            // clear subdata
            // subData = [];
            // UpdateSubTable();
           
            // table data
            const mydata = response.data[0];
            const myinput = response.data[1]; 
            const _JobID = response.data[2]; 
            const GenoPrimerInput = response.data[3]; 
            const GenbankFiles = response.data[4];
            const b64EncodedZipFile = response.data[5];
            const rawRows = mydata.split("\n");
            const rows = [];
            // console.log(mydata)

            rawRows.forEach(
              (r) => {
                const myArray = r.split(',')
                myArray[15] = Number(myArray[15]).toFixed(4);
                myArray[16] = Number(myArray[16]).toFixed(4);
                myArray[17] = Number(myArray[17]).toFixed(4);
                myArray[18] = Number(myArray[18]).toFixed(4);
                myArray[19] = Number(myArray[19]).toFixed(4);
                myArray[20] = Number(myArray[20]).toFixed(4);
                myArray[21] = Number(myArray[21]).toFixed(4);
                myArray[21] = Number(myArray[22]).toFixed(4);
                rows.push(createData(...myArray))
              }
            )
            rows.shift(); // remove header
            if (rows.at(-1).ID === undefined || rows.at(-1).ID === "")
            {
              rows.pop()
            }
            // console.log(rows)
            // write ressult table
            UpdateResTable(rows);
            // write time elapsed
            const timeTaken= ((new Date())-starttime)/1000;
            const hr = Math.floor(timeTaken/3600);
            const min = Math.floor ((timeTaken - hr*3600) / 60);
            const sec = Math.floor ((timeTaken - hr*3600 - 60*min));
            // pause();
            // console.log(timeTaken);
            // GenerateElapsedTimeText(hr, min, sec)
            
            // generate download button
            UpdateDownloadButton(mydata,false,_JobID);
            UpdateDownloadinputButton(myinput,false,_JobID);
            UpdateDownloadGenBankZipButton(b64EncodedZipFile, false, _JobID);

            // console.log(`JobID returned by protospaceX: ${_JobID}`)
            // reset submit button
            RestSubmitButton();
            // stop timer
            // setProcessTimer(
            //     <Typography><b>Elasped time:</b>
            //     </Typography>
            //     )
            if (hr === 0 && min ===0)
            {
              alert.success(<div style={{ textTransform: 'initial' }}>protoSpaceJAM finished in {sec} seconds</div>, {position:'middle', timeout: 7000,})
            }
            else if (hr === 0 )
            {
              alert.success(<div style={{ textTransform: 'initial' }}>protoSpaceJAM in {min} minutes, {sec} seconds</div>, {position:'middle', timeout: 6500,})
            }
            else
            {
              alert.success(<div style={{ textTransform: 'initial' }}>protoSpaceJAM in {hr} hours, {min} minutes, {sec} seconds</div>, {position:'middle', timeout: 6500,})
            }
            TurnOffBackDrop();
            handleComplete(2)
            handleComplete(3);
            handleComplete(4);
            setActiveStep(4);
            setLaunchDisabled(true);
            // console.log(GenoPrimerInput)

            if (PrimerOnOff)
            {
              alert.info(<div style={{ textTransform: 'initial' }}>Working on primers ... </div>, {position:'middle', timeout: 8000,})
              // check if primers are precomputed
              // const HavePrecomputedPrimer = checkPrecomputedPrimer(GenoPrimerInput,_JobID, PrimerMode, TunePrimers, PrimerOptions);
              // console.log(HavePrecomputedPrimer)
              // if (!HavePrecomputedPrimer)
              // {
              //   alert.info(<div style={{ textTransform: 'initial' }}>Genoprimer is running. The primer results will update after each gene</div>, {position:'middle', timeout: 10000,})
              // }
              // run Genoprimer
              runGenoPrimer(GenoPrimerInput,_JobID, PrimerMode, TunePrimers, PrimerOptions);
            }

          },
          () => { // fail
            console.log(<div style={{ textTransform: 'initial' }}>runProtoSpaceJAM failed</div>)
            TurnOffBackDrop();
            alert.error(<div style={{ textTransform: 'initial' }}>protoSpaceJAM failed to process the submission list</div>, {position:'middle', timeout: 10000,})
            RestSubmitButton()
          }
          )
          // execute while waiting for CLI results
          console.log("Waiting for callback");
  }

  function createPrimerResult(Entry,ref,chr,coordinate,ID,geneSymbol,ConstraintsRelaxationIterations,PrimerPair1For,PrimerPair1Rev,PrimerPair1ForTm,PrimerPair1RevTm,PrimerPair1ProdSize,PrimerPair2For,PrimerPair2Rev,PrimerPair2ForTm,PrimerPair2RevTm,PrimerPair2ProdSize,PrimerPair3For,PrimerPair3Rev,PrimerPair3ForTm,PrimerPair3RevTm,PrimerPair3ProdSize) {
    return { Entry,ref,chr,coordinate,ID,geneSymbol,ConstraintsRelaxationIterations,PrimerPair1For,PrimerPair1Rev,PrimerPair1ForTm,PrimerPair1RevTm,PrimerPair1ProdSize,PrimerPair2For,PrimerPair2Rev,PrimerPair2ForTm,PrimerPair2RevTm,PrimerPair2ProdSize,PrimerPair3For,PrimerPair3Rev,PrimerPair3ForTm,PrimerPair3RevTm,PrimerPair3ProdSize
            }; // property shorthand
  }

  function timeout(ms) {
    return new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`Timed out in ${ms}ms.`))
        }, ms)
    })
}

  // call Django, execute genoprimer one-by-one 
  const runGenoPrimer = async (GenoPrimerInput, jobID, PrimerMode, TunePrimers, PrimerOptions) => {
    // alert.info(`Starting primer design using Genoprimer. The primer results will update after each gene`)
    console.log("Running Genoprimer")
    // console.log(GenoPrimerInput)
    UpdatePrimerTable([]); 
    setPrimerProgressShow(true); // show primer progress circle
    let AlertedLongWait = false; // flag if we alerted user if the primer is taking too long
    // loop through each entry and run GenoPrimer, this is b/c Genoprimer can be slow for some genomic sites
    for (let i = 0; i < GenoPrimerInput.Entry.length; i+=1) {
      const Entry = GenoPrimerInput.Entry[i]
      const chr = GenoPrimerInput.chr[i]
      const coordinate = GenoPrimerInput.coordinate[i]
      const ref = GenoPrimerInput.ref[i]
      const ID = GenoPrimerInput.ID[i]
      const geneSymbol = GenoPrimerInput.geneSymbol[i]
      // console.log(`running Genoprimer on Entry=${Entry},chr=${chr},coordinate=${coordinate},ref=${ref}`);
      // console.log(`TunePrimers=${TunePrimers}, PrimerOptions=${PrimerOptions}`)
      // if (TunePrimers === true)
      // {
      //   console.log(`${PrimerOptions.prod_size_lower}`)
      //   console.log(`${PrimerOptions.prod_size_upper}`)
      //   console.log(`${PrimerOptions.Tm_lower}`)
      //   console.log(`${PrimerOptions.Tm_upper}`)
      // }

      // dry run: check if the primer is precomputed
      await Promise.race([
        axios.post(
              "/API_name_genoprimer",   //
            { // data
              "JobID":jobID,
              "PrimerMode":PrimerMode,
              "TunePrimers":TunePrimers,
              "PrimerOptions":PrimerOptions,
              "Entry":Entry,
              "chr":chr,
              "coordinate":coordinate,
              "ref":ref, 
              "ID":ID,
              "geneSymbol":geneSymbol,
              "CheckPrecomputed": true // dry run: check if the primer is precomputed
            },
            { // config
              maxContentLength: 100*1024*1024, // 20Mb
              maxBodyLength: 100*1024*1024, // 20Mb
            }
          ),
        timeout(60000) // wait for 60000 ms (1 min)
      ])
      .then( response => {
            // success
            // console.log(`response.data = ${response.data}`)
            // console.log(`AlertedLongWait = ${AlertedLongWait}`)
            if (response.data === false && AlertedLongWait === false) // if the primer is not precomputed and we haven't alerted the user
            {
              
              alert.info(<div style={{ textTransform: 'initial' }}>Please note: Precomputed primers are currently unavailable for one or more selected sites. As a result, the processing time may be extended. We appreciate your patience.</div>, {position:'middle', timeout: 30000,})
              AlertedLongWait = true; // set the flag to true
            }
      })
      .catch(error => {
          // either the post request failed, or it didn't finish in time
          console.log(error);
          // setPrimerProgress(parseInt((i+1)/GenoPrimerInput.Entry.length*100,10))
      });




      await Promise.race([
        axios.post(
              "/API_name_genoprimer",
            { // data
              "JobID":jobID,
              "PrimerMode":PrimerMode,
              "TunePrimers":TunePrimers,
              "PrimerOptions":PrimerOptions,
              "Entry":Entry,
              "chr":chr,
              "coordinate":coordinate,
              "ref":ref, 
              "ID":ID,
              "geneSymbol":geneSymbol,
              "CheckPrecomputed": false // dry run: check if the primer is precomputed
            },
            { // config
              maxContentLength: 100*1024*1024, // 20Mb
              maxBodyLength: 100*1024*1024, // 20Mb
            }
          ),
        timeout(300000) // wait for 300000 ms (5 min)
      ])
      .then( response => {
            // success
            // console.log(response.data)
            primerResultsCsv += response.data // add current primer result download blob
            primerResults.push(createPrimerResult(...response.data.split(","))) // add current primer result to result table data staging
            // console.log(response.data)
            // console.log(primerResults)
            // update primer table
            UpdatePrimerTable(primerResults)
            UpdateDownloadPrimerResultButton(primerResultsCsv, false, jobID)
            // update progress 
            setPrimerProgress(parseInt((i+1)/GenoPrimerInput.Entry.length*100,10))
      })
      .catch(error => {
          // either the post request failed, or it didn't finish in time
          // console.log(error);
          setPrimerProgress(parseInt((i+1)/GenoPrimerInput.Entry.length*100,10))
      });



    } 
    setPrimerProgressShow(false); // Hide primer progress circle
    setPrimerProgress100PercentShow(true); // Hide primer progress circle
  }

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 380,
    },
  });

  const [ShowStrandselection, setShowStrandselection] = React.useState(true)
  const ShowStrandselectionToParent = (childdata) =>
  {
    setShowStrandselection(childdata)
  }

  const LoadExample = () => {
    setgRNAnum(1)
    setNuclease("SpCas9")
    setGenome("GRCh38")
    setGenes("ENST00000421999,N\nENST00000453996,C\nENST00000410067,N\nENST00000651894,16:30193593\n")
    PayloadModeToParent("TwoPayloads") // needed to execute the logics in this function
    setNpayload("ACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATGGGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGT")
    setCpayload("GGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGTACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG")
    setPosPayload("GGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGTACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG")
    setDonorSSDS("ssODN")
    setEnforceMaxDonLen(true)
    setMaxDonLen(200)
    setShowStrandselection(true)
    setMutateOrder("PAM_first")
    setMutateOrderPAMfirst(true)
    setstrandChoice("auto")
    setrecodeIntensity("full")
    setRecodeOnlyInCodingRegion(false)
    setCfdThres(0.03)
    setHAlen(500)
    setSpecificityWeightScalingFactor(1)
    setCut2InsertDistWeightScalingFactor(1)
    setPositionWeightScalingFactor(1)
    
    alert.success(<div style={{ textTransform: 'initial' }}>Example loaded!<br/>To continue, click "Add to submission list"</div>, {timeout: 5000 })
  }
  const ClearExample = () => {
    resetParams()
    alert.info(<div style={{ textTransform: 'initial' }}>Example cleared, default options loaded</div>, {  timeout: 8000 })
  }

    // create data for submission (from build job section)
    function createData2(ID, Terminus,Chromosome, Coordinate, Genome, numOfgRNA, Nuclease, penalizeReg, SpecificityWeightScalingFactor, Cut2InsertDistWeightScalingFactor, PositionWeightScalingFactor, HAarmLen,EnforceMaxDonLen,MaxDonLen,recodeIntensity,RecodeOnlyInCodingRegion,cfdThres,mutateOrder,DonorSSDS,strandChoice,Payload,NtermPayload,CtermPayload, PosPayload,SelectedEnzymes,CustomSeq2Avoid,MinArmLenPostTrim ) {
      return {          ID, Terminus, Chromosome, Coordinate, Genome, numOfgRNA, Nuclease, penalizeReg, SpecificityWeightScalingFactor, Cut2InsertDistWeightScalingFactor, PositionWeightScalingFactor, HAarmLen,EnforceMaxDonLen,MaxDonLen,recodeIntensity,RecodeOnlyInCodingRegion,cfdThres,mutateOrder,DonorSSDS,strandChoice,Payload,NtermPayload,CtermPayload, PosPayload,SelectedEnzymes,CustomSeq2Avoid,MinArmLenPostTrim 
              }; // property shorthand
    }

  // add build-your-job to the submission list
  const AddBuildJobToSubList = () => {
    // AddsubDataRow(subData, ID, Terminus, Genome, numgRNA,HAarmLen,Payload,Npayload,Cpayload,EnforceMaxDonorLen,RecodingIntensity) 
    if(typeof Genes === 'undefined')
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the Genes list and/or the payload sequence is empty</div>, {timeout: 5000})
      return
    }
    // Check if the terminus/chr:position is valid
    let valRawrows = Genes.trim().split("\n");
    if (valRawrows.length<1)
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the Genes list  is empty</div>, {timeout: 5000})
      return
    }
    // remove version number from transcript ID, and remove any leading/trailing spaces
    const _Genes = Genes.split("\n").map(line => {
      const parts = line.split(",");
      parts[0] = parts[0].split(".")[0].trimStart().trimEnd(); // Transcript ID: Clip the decimal point and characters after it
      if (parts.length > 1) {
        parts[1] = parts[1].trimStart().trimEnd().toUpperCase(); // Terminus
      }
      return parts.join(",");
    }).join("\n");
    // console.log(_Genes)

    // Check if all alphas are zero
    if (SpecificityWeightScalingFactor === 0 &&  Cut2InsertDistWeightScalingFactor === 0 && PositionWeightScalingFactor === 0)
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, at least one gRNA score scaling factors should be nonzero</div>, {timeout: 5000})
      return
    }

    let transcriptIDFlag = false
    let geneInputBoxFlag = false

    valRawrows = _Genes.trim().split("\n");
    valRawrows.forEach(
    (r) => {
        const valmyArray = r.split(',')
        if(valmyArray.length ===1  && !valmyArray[0].includes(":")) // one column and it has to be a chromosome:position
        {
          geneInputBoxFlag = true
        }

        if (valmyArray.length === 2)  // two columns, the second columns should be N/C or chromosome:position
        {
          if (!valmyArray[1].includes(":") && valmyArray[1].toUpperCase() !== "N" && valmyArray[1].toUpperCase() !== "C")
          {
            geneInputBoxFlag = true
          }
        }
        
        // check if the transcript ID matches the genome
        if (valmyArray.length===2 && !valmyArray[1].includes(":")) // only check if no coordinates are provided and two columns are present
        {
            if (Genome === "GRCh38" && !(valmyArray[0].startsWith("ENST"))){
                transcriptIDFlag = true
            } else if (Genome === "GRCm39" && !(valmyArray[0].startsWith("ENSMUST"))) {
                transcriptIDFlag = true
            } else if (Genome === "GRCz11" && !(valmyArray[0].startsWith("ENSDART"))) {
                transcriptIDFlag = true
            }
        }
        r.split(',')
      })
    
    if (geneInputBoxFlag === true)
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the target gene input box should have rows in one of the three formats:<br/>&lt;1&gt;&nbsp;transcript ID,terminus<br/>&lt;2&gt;&nbsp;transcript ID,chromosome&#58;position<br/>&lt;3&gt;&nbsp;chromosome&#58;position</div>, {timeout: 15000})
      return
    }

    if (transcriptIDFlag)
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, check typos in transcript IDs, and transcript IDs must match the selected genome</div>, {timeout: 5000})
      return
    }

    // validate custom seq to avoid
    const allowedCharsPattern = '[^ATCGatcg,]' 
    const regex = new RegExp(allowedCharsPattern);
    if(regex.test(CustomSeq2Avoid))
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Error in sequences to avoid, only ATCG and commas are allowed</div>, {timeout: 5000})
      return
    }
    // selected enzymes (dsDNA)
    const _SelectedEnzymes = SelectedEnzymes;
    // custom seqs to avoid (dsDNA)
    const _CustomSeq2Avoid = CustomSeq2Avoid;
    // minimum arm length (dsDNA)
    let _MinArmLenPostTrim = MinArmLenPostTrim;
    // max donor length (ssODN)
    let _MaxDonLen = MaxDonLen;
    // mutate order
    const _mutateOrder = MutateOrder;
    // check and process payload
    let _PayloadSeq = "";
    let _Npayload = "";
    let _Cpayload = "";
    let _PosPayload = "";
    if (PayloadMode === "")
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the payload selection is empty</div>, {timeout: 5000}) 
      return
    }
    if (PayloadMode === "TagAndLinker")
    {
      if (Tag.length===0  && Linker.length===0)
      {
        alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, both the tag and linker sequences are empty</div>, {timeout: 5000})
        return
      }
      if (tagLinkerOrder === "tagFirst")
      {
        _PayloadSeq = Tag + Linker
       // console.log("tagFirst")
      }
      if (tagLinkerOrder === "linkerFirst")
      {
        _PayloadSeq = Linker + Tag
       // console.log("linkerFirst")
      }
    }
    if (PayloadMode === "OnePayLoad")
    {
      if (PayloadSeq.length===0 || typeof PayloadSeq === 'undefined')
      {
        alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the payload sequence is empty</div>, {timeout: 5000})
        return
      }
      _PayloadSeq = PayloadSeq
    }
    if (PayloadMode === "TwoPayloads")
    { 
      // TODO: cross reference the target terminue RequestPageRounded
      // tally all the terminus in the input
      const lines = Genes.split('\n');
      const extractedTerminus = lines.map(line => {
        // Split each line at commas and get the second element (index 1)
        const parts = line.split(',');
        return parts[1] || '';  // Return an empty string if there is no second element
      });
      // console.log(extractedTerminus)
      // Capitalize all elements and convert to a Set to ensure uniqueness
      const uniqueCapitalizedTerminus = [...new Set(extractedTerminus.map(element => element.trim().toUpperCase()))];

      if (uniqueCapitalizedTerminus.includes('N')) {
        if (Npayload.length===0 || typeof Npayload === 'undefined')
        {
          alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the N-terminus payload sequence is empty while N-terminus design is requested</div>, {timeout: 9000})
          return
        }
      }
      if (uniqueCapitalizedTerminus.includes('C')) {
        if (Cpayload.length===0 || typeof Cpayload === 'undefined')
        {
          alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the C-terminus payload sequence is empty while C-terminus design is requested</div>, {timeout: 9000})
          return
        }
      }
      if (uniqueCapitalizedTerminus.some(element => element.includes(':') )) {
        if (PosPayload.length===0 || typeof PosPayload === 'undefined')
        {
          alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the genomic coordinate payload sequence is empty while genomic coordinate design is requested</div>, {timeout: 9000})
          return
        }
      }
      _Npayload = Npayload;
      _Cpayload = Cpayload;
      _PosPayload = PosPayload;
    }

      // check if the payload is larger than the ssODN size
      // compute payload size
      let _payloadSize = 0;
      if (PayloadMode === "TwoPayloads")
      {
        _payloadSize = Math.max(Npayload.length, Cpayload.length, PosPayload.length)
      }
      if (PayloadMode === "OnePayLoad")
      {
        _payloadSize = PayloadSeq.length
      }
      if (PayloadMode === "TagAndLinker")
      {
        _payloadSize = Tag.length + Linker.length
      }
      if (DonorSSDS === "ssODN" && _payloadSize > MaxDonLen)
      {
        alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the payload size ({_payloadSize}) is larger than the donor size ({MaxDonLen}), and the donor will lack homology arms. </div>, {timeout: 5000})
        return
      }
    
    // if (DonorSSDS === "dsDNA")
    // {
    //   _mutateOrder = "N/A"
    // }
    if (DonorSSDS === "ssODN")
    {
      _MinArmLenPostTrim = "N/A"
    }
    else{
      _MaxDonLen = "N/A"
    }

    // create the data rows
    const { rows, coordWithoutTerm} = makeDataRowFromBuildJob(_Genes, _PayloadSeq, _Npayload, _Cpayload, _PosPayload, _SelectedEnzymes , _CustomSeq2Avoid, _mutateOrder, _MinArmLenPostTrim,_MaxDonLen);

    console.log(coordWithoutTerm)
    if (coordWithoutTerm)
    {
      alert.info(<div style={{ textTransform: 'initial' }}>Warning: one or more of your entries use genomic coordinates without specifying a transcript ID. As a result, the recoding process for those entries will not account for gene features like codons, splice junctions etc. Consider either disabling recoding, or including a corresponding transcript ID(s) with the genomic coordinates if available.
      </div>, {position: 'middle', timeout: 30000})
    }

    // console.log(rows)
    // check if the result submission list will be too long
    if (rows.length + subData.length > 384)
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list, the submission list will exceed the maximum allowance of 384 entries</div>, {timeout: 5000}) 
      return
    }

    
    // add the data rows to the submission list
    rows.forEach(
      (r) => {
          // console.log(createData2(...r))
          subData.push(createData2(...r))
      }
    )
    // console.log(rows);
    // console.log(subData);
    UpdateSubTable();
    
    if (rows.length!==0){
      handleComplete(0)
      setActiveStep(2)
      alert.success(<div style={{ textTransform: 'initial' }}>Successfully added items to the submission list from the "build job" section!<br/>Click "confirm" to continue</div>, {timeout: 5000})
    }
    else{
      alert.error(<div style={{ textTransform: 'initial' }}>Failed to add to submission list,<br />please make sure the following area were filled: Ensembl transcript IDs, terminus and payload.</div>, {timeout: 5000})
    }
        
    // UpdateSubTable(subData)
    // enable launch
    setLaunchDisabled(false);
  }

  const makeDataRowFromBuildJob = (_Genes, _PayloadSeq, _Npayload, _Cpayload, _PosPayload, _SelectedEnzymes, _CustomSeq2Avoid, _mutateOrder, _MinArmLenPostTrim, _MaxDonLen) => {
        if (typeof _Genes !== 'undefined') {
              const rawRows = _Genes.trim().split("\n");
              const rows = [];
              let coordWithoutTerm = false
              if (rawRows.length>0)
              {
                rawRows.forEach(

                (r) => {
                    const myArray = r.split(',')
                    if(myArray.length>=2) // two columns
                    {
                      const IDtermOK = (myArray[0] !== "" && ["N", "C"].includes(myArray[1].toUpperCase()))
                      const IDok = (myArray[0] !== "")

                      const myArray2 = myArray[1].split(':')
                      const coordOK =  myArray[1].includes(":") && (myArray2.length === 2) && (myArray2[0] !== "" && myArray2[1] !== "")

                      if(coordOK)
                      {
                        rows.push([myArray[0],  '',       myArray2[0],myArray2[1], Genome, gRNAnum, Nuclease, penalizeReg.toString(), SpecificityWeightScalingFactor, Cut2InsertDistWeightScalingFactor, PositionWeightScalingFactor, HAlen, EnforceMaxDonLen, _MaxDonLen, recodeIntensity,RecodeOnlyInCodingRegion.toString(), cfdThres, _mutateOrder, DonorSSDS,strandChoice,_PayloadSeq, _Npayload, _Cpayload, _PosPayload, _SelectedEnzymes, _CustomSeq2Avoid, _MinArmLenPostTrim]) // myArray[0]=ID myArray[1]=terminus
                      }
                      else if (IDtermOK){
                        rows.push([myArray[0], myArray[1],'',          '',         Genome, gRNAnum, Nuclease, penalizeReg.toString(), SpecificityWeightScalingFactor, Cut2InsertDistWeightScalingFactor, PositionWeightScalingFactor, HAlen, EnforceMaxDonLen, _MaxDonLen, recodeIntensity,RecodeOnlyInCodingRegion.toString(), cfdThres, _mutateOrder, DonorSSDS,strandChoice,_PayloadSeq, _Npayload, _Cpayload, _PosPayload, _SelectedEnzymes, _CustomSeq2Avoid, _MinArmLenPostTrim]) // myArray[0]=ID myArray[1]=terminus
                      }

                      if (coordOK && !IDok)
                      {
                        coordWithoutTerm = true
                      }
                    }
                    else // one column
                    {
                      const IDtermOK = false
                      const coordOK =  (myArray[0].split(':').length === 2) && (myArray[0].split(':')[0] !== "" && myArray[0].split(':')[1] !== "")
                      if(coordOK)
                      {
                        rows.push(['',  '',       myArray[0],myArray[1], Genome, gRNAnum, Nuclease, penalizeReg.toString(), SpecificityWeightScalingFactor, Cut2InsertDistWeightScalingFactor, PositionWeightScalingFactor, HAlen, EnforceMaxDonLen, _MaxDonLen, recodeIntensity,RecodeOnlyInCodingRegion.toString(), cfdThres, _mutateOrder, DonorSSDS,strandChoice,_PayloadSeq, _Npayload, _Cpayload, _PosPayload, _SelectedEnzymes, _CustomSeq2Avoid, _MinArmLenPostTrim]) // myArray[0]=ID myArray[1]=terminus
                        coordWithoutTerm = true
                      }
                    }
                  }
                )
                
                // // rows.shift(); // remove header
                // const IDtermMissing = rows.at(-1)[0] === "" && rows.at(-1)[1] === ""
                // const coordMissing =  rows.at(-1)[2] === "" || rows.at(-1)[3] === ""
                // console.log(IDtermMissing)
                // console.log(coordMissing)
                // if ( (IDtermMissing && coordMissing) 
                //   )
                // {
                //   rows.pop() // remove last row if it is empty
                // }
                // console.log(rawRows)
                return {rows, coordWithoutTerm}
              }
        }
        return([])
  }

  // submission list table
  const [SubTable, setSubTable] = React.useState(          
                                    <Paper sx={{ width: '98%' }}>
                                    {/* <Typography align = "center" gutterBottom = "true" variant = "h5"><br/>Results
                                    </Typography> */}
                                    <TableContainer component={Paper}>
                                    <Table aria-label="collapsible table" size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell align="center">Entry #</TableCell>
                                          <TableCell align="center">Enembl transcript ID*</TableCell>
                                          <TableCell align="center">Terminus*</TableCell>
                                          <TableCell align="center">Chromosome*</TableCell>
                                          <TableCell align="center">Coordinate*</TableCell>
                                          <TableCell align="center">Genome*</TableCell>
                                          <TableCell align="center">Number of gRNA</TableCell>
                                          <TableCell align="center">Nuclease</TableCell>
                                          <TableCell align="center">Penalize gRNAs cutting in/near regulatory sequences</TableCell>
                                          <TableCell align="center">homology arm length to consider</TableCell>
                                          <TableCell align="center">Maximum donor length (ssODN only)</TableCell>
                                          <TableCell align="center">Minimum homology arm length (dsDNA only)</TableCell>
                                          <TableCell align="center">Recoding intensity
                                            <CustomWidthTooltip  title={<p>Introduce synonmous changes to the donor DNA to:<br/>(1) Prevent donor and the repaired loci from being cut again.<br/>(2) Facilitate donor integration.<br/> Full = (1) + (2)<br/>Prevent recut = (1)<br/><br/>More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#recoding-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}>
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                            </CustomWidthTooltip>
                                          </TableCell>
                                          <TableCell align="center">Recode only in coding region
                                            <CustomWidthTooltip  title={<p>Limit recoding activity to introducing synonmous codon changes to protein coding sequence</p>} >
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                            </CustomWidthTooltip>
                                          </TableCell>
                                          <TableCell align="center">cfd threshold                                   
                                            <CustomWidthTooltip  title={<p>This option is in effect only if the recoding intensity is set to "Full" or "Prevent recut", protoSpaceJAM will attempt to lower the recut potential to this threshold.<br/> 
                                                                                                <br/>The default threshold is 0.03, which means that any CFD values lower than the threshold will be considered not suceptible to being recut anymore, and protoSpaceJAM will stop recoding immediately once this threshold is reached<br/>
                                                                                                <br/>The recut potential is measured by CFD score comparing the gRNA sequence in the genome to that in the donor. Recut potential ranges from 0 to 1, and 1 means perfect match, thus it is highly likely to result in recutting of the repaired genome.</p>}>
                                            <IconButton>
                                              <HelpOutlineIcon fontSize="small"/>
                                            </IconButton>
                                            </CustomWidthTooltip>
                                          </TableCell>
                                          <TableCell align="center">Recode order                                   
                                          <CustomWidthTooltip  title={<p>This option controls whether protoSpaceJAM should start recoding in PAM or the protospacer.<br/><br/>Recoding in PAM first will likely result in using less mutations to prevent recut, but increases the chance of the ssODN donor to be recut in a PAM-independent way.<br/><br/>More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#recoding-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}>
                                            <IconButton>
                                              <HelpOutlineIcon fontSize="small"/>
                                            </IconButton>
                                            </CustomWidthTooltip>
                                          </TableCell>
                                          <TableCell align="center">Donor type</TableCell>
                                          <TableCell align="center">Payload (not terminus or position-specific)</TableCell>
                                          <TableCell align="center">N-Payload
                                          <CustomWidthTooltip  title={<p>Payload sequence to be inserted immediatedly downstream of start codons. </p>}>
                                                    <IconButton>
                                                      <HelpOutlineIcon fontSize="small"/>
                                                    </IconButton>
                                            </CustomWidthTooltip>
                                          </TableCell>
                                          <TableCell align="center">C-Payload
                                          <CustomWidthTooltip  title={<p>Payload sequence to be inserted immediatedly upstream of stop codons. </p>}>
                                                    <IconButton>
                                                      <HelpOutlineIcon fontSize="small"/>
                                                    </IconButton>
                                            </CustomWidthTooltip>
                                          </TableCell>
                                          <TableCell align="center">Custom position payload
                                          <CustomWidthTooltip  title={<p>Payload sequence to be inserted immediatedly downstream of genomic coordinates denoted by format chr:position. </p>}>
                                                    <IconButton>
                                                      <HelpOutlineIcon fontSize="small"/>
                                                    </IconButton>
                                            </CustomWidthTooltip>
                                          </TableCell>
                                          <TableCell align="center">strand selection (ssODN only)</TableCell>
                                          <TableCell align="center">Avoid restriction sites (dsDNA only)</TableCell>
                                          <TableCell align="center">Avoid sequences (dsDNA only)</TableCell>
                                          
                                        </TableRow>
                                      </TableHead>
                                    </Table>
                                    </TableContainer>
                                    </Paper>);
  const UpdateSubTable = () => {

                          // add EntryNum to a temp copy of subData
                          const tmpSubData = subData.slice()
                          tmpSubData.forEach(
                            (val,idx) => { 
                              // console.log(idx)
                              tmpSubData[idx].EntryNum= idx+1

                            })
                        // console.log(subData)

                          // update table
                          setSubTable(
                                    <Paper sx={{ width: '98%' }}>
                                    {/* <Typography align = "center" gutterBottom = "true" variant = "h5"><br/>Results
                                    </Typography> */}
                                    <TableContainer component={Paper}>
                                    <Table aria-label="collapsible table" size="small">
                                    <TableHead>
                                    <TableRow>
                                    <TableCell align="center">Entry #</TableCell>
                                    <TableCell align="center">Ensembl transcript ID*</TableCell>
                                    <TableCell align="center">Terminus*</TableCell>
                                    <TableCell align="center">Chromosome*</TableCell>
                                    <TableCell align="center">Coordinate*</TableCell>
                                    <TableCell align="center">Genome*</TableCell>
                                    <TableCell align="center">Number of gRNA</TableCell>
                                    <TableCell align="center">Nuclease</TableCell>
                                    <TableCell align="center">Penalize gRNAs cutting in/near regulatory sequences</TableCell>
                                    <TableCell align="center">Specificity weight scaling factor</TableCell>
                                    <TableCell align="center">Cut to insert dist. weight  scaling factor</TableCell>
                                    <TableCell align="center">Position weight scaling factor</TableCell>
                                    <TableCell align="center">Homology arm length to consider</TableCell>
                                    <TableCell align="center">Maximum donor length (ssODN only)</TableCell>
                                    <TableCell align="center">Minimum homology arm length (dsDNA only)</TableCell>
                                    <TableCell align="center">Recoding intensity
                                      <CustomWidthTooltip  title={<p>Introduce synonmous changes to the donor DNA to:<br/>(1) Prevent donor and the repaired loci from being cut again.<br/>(2) Facilitate donor integration.<br/> Full = (1) + (2)<br/>Prevent recut = (1)<br/><br/>More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#recoding-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}>
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                      </CustomWidthTooltip>
                                    </TableCell>
                                    <TableCell align="center">Recode only in coding region
                                            <CustomWidthTooltip  title={<p>Limit recoding activity to introducing synonmous codon changes to protein coding sequence</p>} >
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                            </CustomWidthTooltip>
                                          </TableCell>
                                    <TableCell align="center">cfd threshold
                                    <CustomWidthTooltip  title={<p>This option is in effect only if the recoding intensity is set to "Full" or "Prevent recut", protoSpaceJAM will attempt to lower the recut potential to this threshold.<br/> 
                                                                                                <br/>The default threshold is 0.03, which means that any CFD values lower than the threshold will be considered not suceptible to being recut anymore, and protoSpaceJAM will stop recoding immediately once this threshold is reached<br/>
                                                                                                <br/>The recut potential is measured by CFD score comparing the gRNA sequence in the genome to that in the donor. Recut potential ranges from 0 to 1, and 1 means perfect match, thus it is highly likely to result in recutting of the repaired genome.</p>}>
                                            <IconButton>
                                              <HelpOutlineIcon fontSize="small"/>
                                            </IconButton>
                                            </CustomWidthTooltip>
                                    </TableCell>
                                    <TableCell align="center">Recode order                                   
                                            <CustomWidthTooltip  title={<p>This option controls whether protoSpaceJAM should start recoding in PAM or the protospacer.<br/><br/>Recoding in PAM first will likely result in using less mutations to prevent recut, but increases the chance of the ssODN donor to be recut in a PAM-independent way.<br/><br/>More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#recoding-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}>
                                            <IconButton>
                                              <HelpOutlineIcon fontSize="small"/>
                                            </IconButton>
                                            </CustomWidthTooltip>
                                          </TableCell>
                                    <TableCell align="center">Donor type</TableCell>
                                    <TableCell align="center">Payload (not terminus or position-specific)</TableCell>
                                    <TableCell align="center">N-Payload
                                    <CustomWidthTooltip  title={<p>Payload sequence to be inserted immediatedly downstream of start codons. </p>}>
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                      </CustomWidthTooltip>
                                    </TableCell>
                                    <TableCell align="center">C-Payload
                                    <CustomWidthTooltip  title={<p>Payload sequence to be inserted immediatedly upstream of stop codons. </p>}>
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                      </CustomWidthTooltip>
                                    </TableCell>
                                    <TableCell align="center">Custom position payload
                                    <CustomWidthTooltip  title={<p>Payload sequence to be inserted immediatedly downstream of genomic coordinates denoted by format chr:position. </p>}>
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                      </CustomWidthTooltip>
                                    </TableCell>
                                    <TableCell align="center">strand selection (ssODN only)</TableCell>
                                    <TableCell align="center">Avoid restriction sites (dsDNA only)</TableCell>
                                    <TableCell align="center">Avoid sequences (dsDNA only)</TableCell>
                                    
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {tmpSubData.map((row) => (
                                    <Row2 row={row} />
                                    ))}
                                    </TableBody>
                                    </Table>
                                    </TableContainer>
                                    </Paper>
  )

  // supporting fuctions for the submission table
  function Row2(props) {
    const { row } = props;

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          {/* <TableCell component="th" scope="row">
            {row.name}
          </TableCell> */}
          <TableCell align="center">
            <div style={{display: "flex", alignItems: 'center', width: '50px', whiteSpace: "nowrap",  overflow: "auto", cursor: "pointer"}}>
              <DeleteForeverIcon onClick={() => handleDeleteRow(row.EntryNum)}/> 
              &nbsp; {row.EntryNum}
            </div>
          </TableCell>
          <TableCell align="center">{row.ID}</TableCell>
          <TableCell align="center">{row.Terminus}</TableCell>
          <TableCell align="center">{row.Chromosome}</TableCell>
          <TableCell align="center">{row.Coordinate}</TableCell>
          <TableCell align="center">{row.Genome}</TableCell>
          <TableCell align="center">{row.numOfgRNA}</TableCell>
          <TableCell align="center">{row.Nuclease}</TableCell>
          <TableCell align="center">{row.penalizeReg}</TableCell>
          <TableCell align="center">{row.SpecificityWeightScalingFactor}</TableCell>
          <TableCell align="center">{row.Cut2InsertDistWeightScalingFactor}</TableCell>
          <TableCell align="center">{row.PositionWeightScalingFactor}</TableCell>
          <TableCell align="center">{row.HAarmLen}</TableCell>
          <TableCell align="center">{row.MaxDonLen}</TableCell>
          <TableCell align="center">{row.MinArmLenPostTrim}</TableCell>
          <TableCell align="center">{row.recodeIntensity}</TableCell>
          <TableCell align="center">{row.RecodeOnlyInCodingRegion}</TableCell>
          <TableCell align="center">{row.cfdThres}</TableCell>
          <TableCell align="center">{row.mutateOrder}</TableCell>
          <TableCell align="center">{row.DonorSSDS}</TableCell>
          
          <TableCell align="left">
                    <div style={{display: "block", width: '200px', whiteSpace: "nowrap",  overflow: "auto"}}>
                    {row.Payload}
                    </div>
          </TableCell>
          <TableCell align="left">
                    <div style={{display: "block", width: '200px', whiteSpace: "nowrap",  overflow: "auto"}}>
                    {row.NtermPayload}
                    </div>
          </TableCell>
          <TableCell align="left">
                    <div style={{display: "block", width: '200px', whiteSpace: "nowrap",  overflow: "auto"}}>
                    {row.CtermPayload}
                    </div>
          </TableCell>
          <TableCell align="left">
                    <div style={{display: "block", width: '200px', whiteSpace: "nowrap",  overflow: "auto"}}>
                    {row.PosPayload}
                    </div>
          </TableCell>
          <TableCell align="center">{row.strandChoice}</TableCell>
          <TableCell align="left">
                    <div style={{display: "block", width: '100px', whiteSpace: "nowrap",  overflow: "auto"}}>
                    {row.SelectedEnzymes}
                    </div>
          </TableCell>
          <TableCell align="left">
                    <div style={{display: "block", width: '100px', whiteSpace: "nowrap",  overflow: "auto"}}>
                    {row.CustomSeq2Avoid}
                    </div>
          </TableCell>
          
        </TableRow>
      </>
    );
  }

  Row2.propTypes = {
    row: PropTypes.shape({
      EntryNum: PropTypes.string.isRequired,
      ID: PropTypes.string.isRequired,
      Terminus: PropTypes.string.isRequired,
      Chromosome: PropTypes.string.isRequired,
      Coordinate: PropTypes.string.isRequired,
      Genome: PropTypes.string.isRequired,
      numOfgRNA: PropTypes.string.isRequired,
      Nuclease: PropTypes.string.isRequired,
      penalizeReg: PropTypes.string.isRequired,
      SpecificityWeightScalingFactor: PropTypes.string.isRequired,
      Cut2InsertDistWeightScalingFactor: PropTypes.string.isRequired,
      PositionWeightScalingFactor: PropTypes.string.isRequired,
      HAarmLen: PropTypes.string.isRequired,
      DonorSSDS: PropTypes.string.isRequired,
      strandChoice: PropTypes.string.isRequired,
      Payload: PropTypes.string.isRequired,
      NtermPayload: PropTypes.string.isRequired,
      CtermPayload: PropTypes.string.isRequired,
      PosPayload: PropTypes.string.isRequired,
      MaxDonLen: PropTypes.string.isRequired,
      recodeIntensity: PropTypes.string.isRequired,
      RecodeOnlyInCodingRegion: PropTypes.string.isRequired,
      cfdThres: PropTypes.string.isRequired,
      mutateOrder: PropTypes.string.isRequired,
    }).isRequired,
  };
  };

  // clear sublist
  const clearSubList = () => {
    subData = []
    UpdateSubTable()
    alert.info(<div style={{ textTransform: 'initial' }}>The submission list is cleared</div>, {  timeout: 4000 })
  } 

  // csv headerline checkbox
  const [csvHasHeaderline, setcsvHasHeaderline] = React.useState(true)
  const handleCsvHasHeaderlineChange = (event) => {
    setcsvHasHeaderline(event.target.checked)
  }

      
  // create data for submission (from csv example template)
  function createData3(ID, Genome, Terminus, Chromosome, Coordinate, numOfgRNA, Nuclease, penalizeReg, SpecificityWeightScalingFactor, Cut2InsertDistWeightScalingFactor, PositionWeightScalingFactor, HAarmLen,MaxDonLen,MinArmLenPostTrim,recodeIntensity,RecodeOnlyInCodingRegion,cfdThres,mutateOrder,DonorSSDS,strandChoice,Payload,NtermPayload,CtermPayload, PosPayload,SelectedEnzymes,CustomSeq2Avoid) {
    return {           ID, Genome, Terminus, Chromosome, Coordinate, numOfgRNA, Nuclease, penalizeReg, SpecificityWeightScalingFactor, Cut2InsertDistWeightScalingFactor, PositionWeightScalingFactor, HAarmLen,MaxDonLen,MinArmLenPostTrim,recodeIntensity,RecodeOnlyInCodingRegion,cfdThres,mutateOrder,DonorSSDS,strandChoice,Payload,NtermPayload,CtermPayload, PosPayload,SelectedEnzymes,CustomSeq2Avoid 
            }; // property shorthand
  }
  // create data for submission (from submission list download)
  function createData4(Entrynum, ID, Genome, Terminus,Chromosome, Coordinate,  numOfgRNA, Nuclease, penalizeReg, SpecificityWeightScalingFactor, Cut2InsertDistWeightScalingFactor, PositionWeightScalingFactor, HAarmLen,EnforceMaxDonLen, MaxDonLen,recodeIntensity,RecodeOnlyInCodingRegion,cfdThres,mutateOrder,DonorSSDS,strandChoice,Payload,NtermPayload,CtermPayload, PosPayload,SelectedEnzymes,CustomSeq2Avoid, MinArmLenPostTrim) {
    return {                     ID, Genome, Terminus, Chromosome, Coordinate, numOfgRNA, Nuclease, penalizeReg, SpecificityWeightScalingFactor, Cut2InsertDistWeightScalingFactor, PositionWeightScalingFactor, HAarmLen, MaxDonLen,MinArmLenPostTrim,recodeIntensity,RecodeOnlyInCodingRegion,cfdThres,mutateOrder,DonorSSDS,strandChoice,Payload,NtermPayload,CtermPayload, PosPayload,SelectedEnzymes,CustomSeq2Avoid 
            }; // property shorthand
  }
  // parse uploaded csv and add to submission list
  const parseUploadCvs = (text) => {
        const rawRows = text.split("\n");
        let IsDownloadedInput = false
        if (csvHasHeaderline)
        {
          const headerline = rawRows.shift(); // header
          IsDownloadedInput = headerline.includes("Entry #")
        }
        const rows = [];
        let goodRowsCount = 0;
        let badRowsCount = 0;
        rawRows.forEach(
          (r) => {
            const myArray = r.split(',')
            // check for special characters
            // check for mandatory rows
            // push to subData
            const rowarray = IsDownloadedInput ? createData4(...myArray) : createData3(...myArray)
            // console.log(rowarray)
            if (typeof rowarray.ID !== 'undefined' && typeof rowarray.Terminus !== 'undefined' && typeof rowarray.Genome !== 'undefined')
            {
              if ( rowarray.ID.length > 0 && 
                   (rowarray.Terminus.length > 0 || (rowarray.Chromosome.length > 0 && rowarray.Coordinate.length > 0)) && 
                   rowarray.Genome.length > 0 && 
                   (rowarray.Genome === "GRCh38" || rowarray.Genome === "GRCm39" || rowarray.Genome === "GRCz11" )
                  )
              {
                // check for missing values
                if (typeof rowarray.Terminus === 'undefined' && typeof rowarray.Chromosome === 'undefined' && typeof rowarray.Coordinate === 'undefined'){rowarray.Terminus = "ALL"}
                if (typeof rowarray.numOfgRNA === 'undefined'){rowarray.numOfgRNA = 1}
                if (typeof rowarray.penalizeReg === 'undefined'){rowarray.penalizeReg = false}
                if (typeof rowarray.SpecificityWeightScalingFactor === 'undefined'){rowarray.SpecificityWeightScalingFactor = 1}
                if (typeof rowarray.Cut2InsertDistWeightScalingFactor === 'undefined'){rowarray.Cut2InsertDistWeightScalingFactor = 1}
                if (typeof rowarray.PositionWeightScalingFactor === 'undefined'){rowarray.PositionWeightScalingFactor = 1}
                if (typeof rowarray.HAarmLen === 'undefined'){rowarray.HAarmLen = 500}
                if (typeof rowarray.DonorSSDS === 'undefined'){rowarray.DonorSSDS = "ssODN"}
                if (rowarray.DonorSSDS === "ssODN") {rowarray.MinArmLenPostTrim = "N/A"}
                if (rowarray.DonorSSDS === "dsDNA") {rowarray.MaxDonLen = "N/A"}
                if (typeof rowarray.strandChoice === 'undefined'){rowarray.strandChoice = "auto"}
                if (typeof rowarray.NtermPayload === 'undefined' && typeof rowarray.Payload === 'undefined'){rowarray.NtermPayload = "ACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATGGGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGT"}
                if (typeof rowarray.CtermPayload === 'undefined' && typeof rowarray.Payload === 'undefined'){rowarray.CtermPayload = "GGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGTACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG"}
                if (typeof rowarray.MaxDonLen === 'undefined'){rowarray.MaxDonLen = 200}
                if (typeof rowarray.recodeIntensity === 'undefined'){rowarray.recodeIntensity = "full"}
                if (typeof rowarray.RecodeOnlyInCodingRegion === 'undefined'){rowarray.RecodeOnlyInCodingRegion = false}
                if (typeof rowarray.cfdThres === 'undefined'){rowarray.cfdThres = 0.03}
                if (typeof rowarray.mutateOrder === 'undefined'){rowarray.mutateOrder = 'N/A'}
                if (typeof rowarray.CustomSeq2Avoid === 'undefined'){rowarray.CustomSeq2Avoid = ''}
                if (typeof rowarray.SelectedEnzymes === 'undefined'){rowarray.SelectedEnzymes = ''}
                // add current row
                rows.push(rowarray)
                goodRowsCount+=1
              }
              else
              {
                badRowsCount+=1
              }
            }  
          }
        )

        // console.log(rows)
        // add to subData
        rows.forEach(
        (r) => {
            subData.push(r)
            // console.log(r)
        }
        )
        // console.log(subData);
        UpdateSubTable();

        if (badRowsCount === 0)
        {
          handleComplete(1);
          setActiveStep(2)
          alert.success(<div style={{ textTransform: 'initial' }}>csv file uploaded successfully!<br />Added {goodRowsCount} entries to the submission list</div>, {timeout: 7000}
          // ['csv file uploaded successfully!', <br />, `Added ${goodRowsCount} entries to the submission list`],{  timeout: 7000 }
        );
        }
        else{
          handleComplete(1);
          setActiveStep(2)
          alert.info(
            <div style={{ textTransform: 'initial' }}>csv file uploaded successfully!<br />Added {goodRowsCount} entries to the submission list<br />ignored {badRowsCount} entry(ies) due to errors in format/values<br />Terminus or Chromosome+Coordinate must be specified <br />"Genome must be: "GRCh38", "GRCm39" or "GRCz11"</div>,{  timeout: 14000 }
          );
        }
  }

  // example list download
  // result download
  const onDownloadExampleList = () => {
    const mydata = "Ensembl_transcript_ID*,Genome*,Terminus,Chromosome,Coordinate,numOfgRNA,Nuclease,Penalize gRNAs cutting in/near regulatory sequences, Specificity weight scaling factor,Cut to insert dist. weight scaling factor,Position weight scaling factor,homology arm length to consider,Maximum donor length,Minimum homology arm length (dsDNA only),Recoding intensity,cfd threshold,Recode order,Donor type,strand selection (ssODN only),Payload,Npayload,Cpayload,PosPayload,Restriction site to avoid (dsDNA only),Custom Seq to Avoid (dsDNA only)\nENST00000410067,GRCh38,N,,,1,SpCas9,true,1,1,1,500,200,,full,false,0.03,protospacer_first,ssODN,auto,CATCACCATCACCATCAC,,,,\nENST00000410067,GRCh38,N,,,1,SpCas9-VQR,true,1,1,1,500,500,200,full,false,0.03,PAM_first,dsDNA,auto,CATCACCATCACCATCAC,,,,\nENST00000421999,GRCh38,N,,,1,enAsCas12a,true,1,1,1,500,200,,full,false,0.03,protospacer_first,ssODN,auto,,ACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATGGGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGT,GGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGTACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG,,,,\nENST00000453996,GRCh38,C,,,1,SpCas9,true,1,1,1,500,200,,full,false,0.03,protospacer_first,ssODN,auto,,ACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATGGGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGT,GGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGTACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG,,,,\nENST00000651894,GRCh38,,16,30193593,1,SpCas9,true,1,1,1,500,200,,full,false,0.03,protospacer_first,ssODN,auto,,,,GGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGTACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG,,,\n"
    const file = new Blob([mydata], {type: 'data:text/csv;charset=utf-8'});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `example_submission_list.csv`;
    // link.href = `data:text/csv;charset=utf-8${mydata}`;

    // simulate link click
    // document.body.appendChild(link); // Required for this to work in FireFox
    link.click();
  };

  // backdrop while executing backend
  const [backdropOpen, setbackdropOpen] = React.useState(false);
  const TurnOffBackDrop = () => {
    setbackdropOpen(false);
  };
  const TurnOnBackDrop = () => {
    setbackdropOpen(true);
  };

  // backdrop for login
  const [LoginBackdropOpen, setLoginBackdropOpen] = React.useState(false); // set to true to enable login
  const TurnOffLoginBackdropOpen = () => {
    setLoginBackdropOpen(false);
  };
  const TurnOnLoginBackdropOpen = () => {
    setLoginBackdropOpen(true);
  };


  // circular progress for primer
  const [PrimerProgress100PercentShow, setPrimerProgress100PercentShow] = React.useState(false);
  const [PrimerProgressShow, setPrimerProgressShow] = React.useState(false);
  const [primerProgress, setPrimerProgress] = React.useState(0);
  function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex'}}>
        <CircularProgress variant="indeterminate" {...props} />
        <Box
          sx={{
            top: -9,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }
  
  CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
  };

  // circular progress for pJAM
  const [pJAMProgress99PercentShow, setpJAMProgress99PercentShow] = React.useState(false);
  const [pJAMProgressShow, setpJAMProgressShow] = React.useState(false);
  const [pJAMProgress, setpJAMProgress] = React.useState(0);

  function CircularProgressWithLabel2(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex'}}>
        <CircularProgress color="inherit" variant="indeterminate" {...props} />
        <Box
          sx={{
            top: -9,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="white">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
    }

    function autoUpdatepJAMprogress(n) {
      // this function will update the progress bar every 1200ms until it reaches 100%
      // the total time to reach 100% is 5 seconds * n
      let counter = 0;
      let MypJAMprogress = 0
      const totalTime = 5000 + 2500*n; // 5 seconds load time and 2.5 seconds for each entry
      const updateInverval = 1200; // update every 1200ms
      const totalSteps = totalTime/updateInverval;
      
      function updateProgress() {
        MypJAMprogress = Math.round(counter/totalSteps*100)
        setpJAMProgress(MypJAMprogress)
        counter+=1;
        if (counter >= totalSteps){
          clearInterval(myInterval);
          setpJAMProgressShow(false);
          setpJAMProgress99PercentShow(true);
        }
      }
      let myInterval = setInterval(updateProgress, updateInverval);
    }


return (
      // <Page title="ProtoSpaceJAM">
        <Box sx={{m:"auto"}}>

              {/* Title */}
              <Grid container alignItems="center" justifyContent="left" sx={{ml:2, mb:2,mt:3}}>
                <Grid item>
                        <Link href="http://protospacejam.czbiohub.org" underline="none">
                        <Typography fontWeight={700}
                          fontSize="1.7rem"
                          gutterBottom={false}
                          component="span"
                          sx={{color:"#2CACE2", textTransform: 'none'}}
                          variant="overline" >&nbsp;&nbsp;  protoSpaceJAM <br/>
                          </Typography>
                          </Link>
                          <Typography fontWeight={300}
                          fontSize="1rem"
                          gutterBottom={false}
                          component="span"
                          sx={{color:"gray"}}
                          variant="caption" > &nbsp;&nbsp;&nbsp;&nbsp;CRISPR knock-in design at scale<br/>
                          </Typography>
                </Grid>
              </Grid>

              {/* stepper */}
              <Box sx={{ml:4, mr:4, mb:4, mt:4, maxWidth:800}}>
                <ThemeProvider theme={stepperTheme}>
                      <Stepper nonLinear activeStep={activeStep}>
                        {/* {steps.map((StepLabel, StepIndex) => (
                          <Step key={StepLabel} completed={completed[StepIndex]}>
                            <StepButton color="inherit" onClick={handleStep(StepIndex)}>
                              {StepLabel}
                            </StepButton>
                          </Step>
                        ))} */}

                          <Step key={steps[0]} completed={completed[0]}
                                                                sx={{
                                                                   '& .MuiStepLabel-root .Mui-completed': {
                                                                    color: '#2CACE2', // circle color (COMPLETED)
                                                                  // },
                                                                  // '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                                                  //   {
                                                                  //     color: 'grey.500', // Just text label (COMPLETED)
                                                                     },
                                                                  '& .MuiStepLabel-root .Mui-active': {
                                                                    color: '#027eb3', // circle color (ACTIVE)
                                                                    fontWeight: 'bold',
                                                                  },
                                                                  '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                                                    {
                                                                      color: 'common.white', // Just text label (ACTIVE)
                                                                    },
                                                                  '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                                                    fill: 'white', // circle's number (ACTIVE)
                                                                  },
                                                                }}>
                            <StepButton color="inherit" onClick={handleStep(0)}>
                              {steps[0]}
                            </StepButton>
                          </Step>
                          
                          <Step key={steps[1]} completed={completed[1]}
                                                            sx={{
                                                              '& .MuiStepLabel-root .Mui-completed': {
                                                                color: '#2CACE2', // circle color (COMPLETED)
                                                              // },
                                                              // '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                                              //   {
                                                              //     color: 'grey.500', // Just text label (COMPLETED)
                                                                 },
                                                              '& .MuiStepLabel-root .Mui-active': {
                                                                color: '#027eb3', // circle color (ACTIVE)
                                                                fontWeight: 'bold',
                                                              },
                                                              '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                                                {
                                                                  color: 'common.white', // Just text label (ACTIVE)
                                                                },
                                                              '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                                                fill: 'white', // circle's number (ACTIVE)
                                                              },
                                                            }}>
                            <StepButton color="inherit" onClick={handleStep(1)}>
                              {steps[1]}
                            </StepButton>
                          </Step>
                          
                          <Step key={steps[2]} completed={completed[2]}
                                                          sx={{
                                                            '& .MuiStepLabel-root .Mui-completed': {
                                                              color: '#2CACE2', // circle color (COMPLETED)
                                                            // },
                                                            // '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                                            //   {
                                                            //     color: 'grey.500', // Just text label (COMPLETED)
                                                               },
                                                            '& .MuiStepLabel-root .Mui-active': {
                                                              color: '#027eb3', // circle color (ACTIVE)
                                                              fontWeight: 'bold',
                                                            },
                                                            '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                                              {
                                                                color: 'common.white', // Just text label (ACTIVE)
                                                              },
                                                            '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                                              fill: 'white', // circle's number (ACTIVE)
                                                            },
                                                          }}>
                            <StepButton color="inherit" onClick={handleStep(2)}>
                              {steps[2]}
                            </StepButton>
                          </Step>
                          
                          <Step key={steps[3]} completed={completed[3]}
                                                          sx={{
                                                            '& .MuiStepLabel-root .Mui-completed': {
                                                              color: '#2CACE2', // circle color (COMPLETED)
                                                            // },
                                                            // '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                                            //   {
                                                            //     color: 'grey.500', // Just text label (COMPLETED)
                                                               },
                                                            '& .MuiStepLabel-root .Mui-active': {
                                                              color: '#027eb3', // circle color (ACTIVE)
                                                              fontWeight: 'bold',
                                                            },
                                                            '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                                              {
                                                                color: 'common.white', // Just text label (ACTIVE)
                                                              },
                                                            '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                                              fill: 'white', // circle's number (ACTIVE)
                                                            },
                                                          }}>
                            <StepButton color="inherit" onClick={handleStep(3)}>
                            {steps[3]} <RocketLaunchOutlinedIcon  fontSize="small"/>
                            </StepButton>
                          </Step>

                          <Step key={steps[4]} completed={completed[4]}
                                                          sx={{
                                                            '& .MuiStepLabel-root .Mui-completed': {
                                                              color: '#2CACE2', // circle color (COMPLETED)
                                                            // },
                                                            // '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                                            //   {
                                                            //     color: 'grey.500', // Just text label (COMPLETED)
                                                               },
                                                            '& .MuiStepLabel-root .Mui-active': {
                                                              color: '#027eb3', // circle color (ACTIVE)
                                                              fontWeight: 'bold',
                                                            },
                                                            '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                                              {
                                                                color: 'common.white', // Just text label (ACTIVE)
                                                              },
                                                            '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                                              fill: 'white', // circle's number (ACTIVE)
                                                            },
                                                          }}>
                            <StepButton color="inherit" onClick={handleStep(4)}>
                              {steps[4]}
                            </StepButton>
                          </Step>
                      </Stepper>
                </ThemeProvider>
                  <Box sx = {{ml:-1, mr:0, mb:0, mt:4, pl:2,pr:0}}>
                  <Typography>
                  {activeStep===0 ? (<>Build your job and click "Add to the submission list", or skip and go to step 2.</>
                  ) : null }
                  {activeStep===1 ? (<>Upload a csv to populate the submission list, or go back to step 1 to interactively build your job.</>
                  ) : null }
                  {activeStep===2 ? (<>Click "Confirm" or return to steps 1 or 2 to add to this list. Click "Reset" to start over.</>
                  ) : null }
                  {activeStep===3 ? (<>Click "Jam it!" to start protoSpaceJAM, or return to steps 1 or 2 to add to this list.</>
                  ) : null }
                  {activeStep===4 ? (<>You can download a copy of the submission list.</>
                  ) : null }
                  < SimpleButton onClick={handleReset} variant="text" sx={{ textTransform: 'none' , float: "right"}} size="medium">Reset</SimpleButton>
                  </Typography>
                  
                  </Box>
                </Box>
              
              {activeStep===0 ? (
              <Paper sx = {{ml:4, mr:4, mb:3, mt:1, pl:2,pr:2}}>
                    <Grid container spacing={1}>
                      
                          {/* whole width for the title */}
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box sx={{ml:3, mr:2, mt:3, mb:2}} >
                                      <Typography fontWeight={700}
                                                    fontSize="1rem"
                                                    gutterBottom={false}
                                                    component="span"
                                                    sx={{color:"black"}}
                                                    variant="overline" >Build your job
                                      </Typography>
                                </Box>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                      <SimpleButton onClick={LoadExample} variant="outlined" sx={{ textTransform: 'none' }} size="small"><AddIcon fontSize="small"/> &nbsp;Load example</SimpleButton>
                                      &nbsp;&nbsp;
                                      <SimpleButton onClick={ClearExample}  variant="outlined" sx={{ textTransform: 'none',}} size="small"><DeleteIcon fontSize="small"/> &nbsp;Clear example</SimpleButton>
                                      {/* <SimpleButton onClick={ClearExample}  variant="outlined" sx={{ textTransform: 'none', float: "right", mr:2}} size="small"><DeleteIcon fontSize="small"/> &nbsp;Clear example</SimpleButton> */}
                                      &nbsp;&nbsp;
                                      <SimpleButton onClick={AddBuildJobToSubList} variant="contained" sx={{ textTransform: 'none' }} size="small"><PlaylistAddIcon fontSize="medium"/> &nbsp;Add to the submission list</SimpleButton>
                                      
                                      <Box
                                        sx = {{mb:-2, mt:0, mr:4}}
                                        display="flex"
                                        justifyContent="flex-end"
                                        alignItems="flex-end"
                                      >
                                        <SimpleButton variant="text" color="primary" sx={{ height: 20, textTransform: 'none' }} size = "large" onClick={handleReportBugButton}>
                                        Give us feedback | Report a problem
                                        </SimpleButton>
                                      </Box>

                          </Grid>

                          {/* left column */}
                          <Grid item xs={12} sm={12} md={5} lg={4}>

                                <Box sx={{ml:2, mr:2, mt:1, mb:2}} >
                                      <Card>
                                            <AppGeneGenome
                                                          title=
                                                          {<p>
                                                            Target genome and genes
                                                            <CustomWidthTooltip  title={<List dense="true">
                                                                              <ListItem sx={{ display: 'list-item' }}><InfoIcon fontSize="small"/> Please select a genome from the dropdown menu. <br/></ListItem>
                                                                              <ListItem sx={{ display: 'list-item' }}><InfoIcon fontSize="small"/> Please enter a list of ENST IDs followed by either the target terminus or a genomic coordinate in the format "chr:position". Hint: Click on the textbox for example inputs.</ListItem>
                                                                              <ListItem sx={{ display: 'list-item' }}><InfoIcon fontSize="small"/> N-terminus(N) = insert immediately after ATG (with the exception when ATG is at the end of an exon, then the insert will be after the second codon)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C-terminus(C) = insert immediately prior to the stop codon.</ListItem>
                                                                            </List>}> 
                                                            <IconButton>
                                                              <HelpOutlineIcon fontSize="small"/>
                                                            </IconButton>
                                                            </CustomWidthTooltip>
                                                          
                                                          </p>}
                                                          subheader=""
                                                          GenomeToParent={GenomeToParent}
                                                          GenesToParent={GenesToParent}
                                                          parentToChildGenes= {Genes}
                                                          parentToChildGenome= {Genome}
                                            />
                                      </Card>
                                  </Box>

                                  <Box sx={{ml:2, mr:2, mt:1, mb:2}}> 
                                      <Card>
                                            <AppgRNA
                                                    title={<p>
                                                            gRNA search parameters
                                                            <CustomWidthTooltip  title={<p>gRNA scoring algorithm is described <a href="https://czbiohub-sf.github.io/protoSpaceJAM/algorithmandparameters.html#grna-scoring" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}> 
                                                            <IconButton>
                                                              <HelpOutlineIcon fontSize="small"/>
                                                            </IconButton>
                                                            </CustomWidthTooltip>
                                                           </p>}
                                                    subheader={<p>Nuclease: SpCas9<br/> PAM: NGG</p>}
                                                    gRNAnumToParent={gRNAnumToParent}
                                                    penalizeRegToParent={penalizeRegToParent}
                                                    NucleaseToParent={NucleaseToParent}
                                                    SpecificityWeightScalingFactorToParent={SpecificityWeightScalingFactorToParent}
                                                    PositionWeightScalingFactorToParent={PositionWeightScalingFactorToParent}
                                                    Cut2InsertDistWeightScalingFactorToParent={Cut2InsertDistWeightScalingFactorToParent}
                                                    parentToChildNuclease= {Nuclease}
                                                    parentToChildgRNAnum= {gRNAnum}
                                                    parentToChildpenalizeReg = {penalizeReg}
                                                    parentToChildSpecificityWeightScalingFactor = {SpecificityWeightScalingFactor}
                                                    parentToChildPositionWeightScalingFactor = {PositionWeightScalingFactor}
                                                    parentToChildCut2InsertDistWeightScalingFactor = {Cut2InsertDistWeightScalingFactor}
                                            />
                                      </Card>
                                  </Box>



                          </Grid>

                          {/* right column */}
                          <Grid item xs={12} sm={12} md={7} lg={8}>
                            <Box sx={{ml:2, mr:2, mt:-4, mb:2}}>
                                <Typography fontWeight={700}
                                              fontSize="1rem"
                                              gutterBottom={false}
                                              component="span"
                                              sx={{color:"white"}}
                                              variant="overline" >Build your job <br/>
                                </Typography>
                            </Box>
                            <Box sx={{ml:2, mr:2, mt:2, mb:2}}>
                                      <AppDNAdonor
                                                  title="DNA donor design parameters"
                                                  subheader="Define the payload and adjust additional settings as desired."
                                                  HAlenToParent={HAlenToParent}
                                                  TagToParent={TagToParent}
                                                  LinkerToParent={LinkerToParent}
                                                  recodeIntensityToParent={recodeIntensityToParent}
                                                  DonorSSDStoParent={DonorSSDStoParent}
                                                  StrandChoiceToParent={StrandChoiceToParent}
                                                  enforceMaxDonLenToParent={enforceMaxDonLenToParent}
                                                  MaxDonLenToParent={MaxDonLenToParent}
                                                  PayloadModeToParent={PayloadModeToParent}
                                                  NpayloadToParent={NpayloadToParent}
                                                  CpayloadToParent={CpayloadToParent}
                                                  PosPayloadToParent={PosPayloadToParent}
                                                  ShowStrandselectionToParent={ShowStrandselectionToParent}
                                                  PayloadSeqtoParent={PayloadSeqtoParent}
                                                  tagLinkerOrderToParent={tagLinkerOrderToParent}
                                                  cfdThresToParent={cfdThresToParent}
                                                  SelectedEnzymeToParent={SelectedEnzymeToParent}
                                                  CustomSeq2AvoidToParent={CustomSeq2AvoidToParent}
                                                  MinArmLenPostTrimToParent={MinArmLenPostTrimToParent}
                                                  MutateOrderChangeToParent={MutateOrderChangeToParent}
                                                  TagNameToParent={TagNameToParent}
                                                  LinkerNameToParent={LinkerNameToParent}
                                                  RecodeOnlyInCodingRegionToParent={RecodeOnlyInCodingRegionToParent}
                                                  NpayloadToChildren={Npayload}
                                                  CpayloadToChildren={Cpayload}
                                                  PosPayloadToChildren={PosPayload}
                                                  EnforceMaxDonLenToChildren={EnforceMaxDonLen}
                                                  DonorSSDSToChildren={DonorSSDS}
                                                  MaxDonLenToChildren={MaxDonLen}
                                                  strandChoiceToChildren={strandChoice}
                                                  ShowStrandselectionToChildren={ShowStrandselection}
                                                  PayloadModeToChildren={PayloadMode}
                                                  ShowOnePayloadInputToChildren={ShowOnePayloadInput}
                                                  ShowTwoPayloadInputToChildren={ShowTwoPayloadInput}
                                                  ShowTagAndLinkerPayloadInputToChildren={ShowTagAndLinkerPayloadInput}
                                                  ShowMutateOrderToChildren={ShowMutateOrder}
                                                  MutateOrderPAMfirstToChildren={MutateOrderPAMfirst}
                                                  cfdThresToChildren={cfdThres}
                                                  recodeIntensityToChildren={recodeIntensity}
                                                  PayloadSeqtoChildren={PayloadSeq}
                                                  TagSeqToChildren={Tag}
                                                  LinkerSeqToChildren={Linker}
                                                  TagNameToChildren={TagName}
                                                  LinkerNameToChildren={LinkerName}
                                                  HAlenToChildren={HAlen}
                                                  MinArmLenPostTrimToChildren={MinArmLenPostTrim}
                                                  SelectedEnzymeToChildren={SelectedEnzymesList}
                                                  CustomSeq2AvoidToChildren={CustomSeq2Avoid}
                                                  RecodeOnlyInCodingRegionToChildren={RecodeOnlyInCodingRegion}
                                          />
                                </Box>
                              </Grid>   
                              {/* whole width for the button */}
                              {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Box sx={{ml:2, mr:2, mt:1, mb:2}} >
                                          <SimpleButton onClick={AddBuildJobToSubList} variant="contained" sx={{ textTransform: 'none' }} size="small"><PlaylistAddIcon fontSize="medium"/> &nbsp;Add the above to submission list</SimpleButton>                 
                                    </Box>
                              </Grid> */}
                        </Grid>
                </Paper>
                ) : null 
                }

              {activeStep===1 ? (
              <Paper sx = {{ml:4, mr:4, mb:3, mt:1, pl:2,pr:2}}>
                    <Grid container spacing={1}>
                          {/* left column */}

                          <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box sx={{ml:3, mr:2, mt:2, mb:2}} >
                                      <Typography fontWeight={700}
                                                    fontSize="1rem"
                                                    gutterBottom={false}
                                                    component="span"
                                                    sx={{color:"black"}}
                                                    variant="overline" >Upload a csv file
                                      </Typography>
                                </Box>   
                                <Box sx={{ml:3, mr:2, mt:2, mb:2}} >    
                                      <SimpleButton component="label" variant="outlined" sx={{ textTransform: 'none' }} size="small" ><UploadFileIcon fontSize="small"/> &nbsp;Upload csv
                                                    <input
                                                              type="file"
                                                              onChange={(e) => {
                                                                if (!e.target.files) {
                                                                  alert.error(<div style={{ textTransform: 'initial' }}>No file uploaded</div>,{  timeout: 4000 });
                                                                  return;
                                                                }
                                                                const file = e.target.files[0];
                                                                if (file.size > 5e8) {
                                                                  alert.error(<div style={{ textTransform: 'initial' }}>upload error: file too large, maximum size is 50 MB</div>,{  timeout: 5000 });
                                                                  return;
                                                                }
                                                                if (file.type !== "text/csv") {
                                                                  alert.error(<div style={{ textTransform: 'initial' }}>upload error: only csv files are accepted</div>,{  timeout: 5000 });
                                                                  return;
                                                                }
                                                                // Encode the file using the FileReader API
                                                                const reader = new FileReader();
                                                                reader.readAsText(file);
                                                                reader.onloadend = async () => {
                                                                  // reader.result is the data
                                                                  if (reader.error) {
                                                                    alert(reader.message);
                                                                    return;
                                                                  }
                                                                  // console.log(reader.result)
                                                                  parseUploadCvs(reader.result)
                                                                };
                                                              }}
                                                              hidden
                                                      />
                                        </SimpleButton>                             
                                        &nbsp;&nbsp;&nbsp;
                                        <FormControlLabel
                                          label={<Typography variant="caption" style={{ lineHeight: "15px", color:"gray"}}>My csv has<br/>a header line</Typography>}
                                          control={<Checkbox checked={csvHasHeaderline} onChange={handleCsvHasHeaderlineChange} size="small"/>}
                                        />
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                      <br/><br/>
                                      <SimpleButton onClick={onDownloadExampleList} component="label" variant="outlined" sx={{ textTransform: 'none'}} size="small" ><BrowserUpdatedIcon fontSize="small"/> &nbsp;Download example csv</SimpleButton> 
                                </Box>
                          </Grid>
                    
                    </Grid>
              </Paper>
              ) : null
              }

            {activeStep===2 ? (
              <Paper sx = {{ml:4, mr:4, mb:3, mt:1, pl:2,pr:2}}>
                    <Grid container spacing={1}>
                          {/* left column */}

                          <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box sx={{ml:3, mr:2, mt:2, mb:2}} >
                                      <Typography fontWeight={700}
                                                    fontSize="1rem"
                                                    gutterBottom={false}
                                                    component="span"
                                                    sx={{color:"black"}}
                                                    variant="overline" >Submission list
                                      </Typography>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                      <SimpleButton variant="contained"
                                                onClick={handleSubListConfirmButton}
                                                loadingPosition="end"
                                                disabled={launchDisabled}
                                               
                                        >
                                        Confirm 
                                        </SimpleButton>
                                          
                                          <SimpleButton onClick={clearSubList} variant="outlined" sx={{ textTransform: 'none' , float: "right"}} size="small"><DeleteIcon fontSize="small"/> &nbsp;Clear list</SimpleButton>
                                          
                                          {SubTable}
                                </Box>
                           </Grid>
                          {/* <Grid>
                                <Box sx={{ml:3, mr:2, mt:2, mb:2}} >
                                        <LoadingButton variant="contained"
                                                onClick={handleLaunchButton}
                                                loading={loading}
                                                loadingPosition="end"
                                                endIcon={<RocketLaunchIcon  fontSize="medium"/>}
                                        >
                                        Launch protoSpaceJAM 
                                        </LoadingButton>
                                </Box>
                          </Grid> */}
                    </Grid>
                    
              </Paper>
              ) : null
              }

            {activeStep===3 ? (
              <Paper sx = {{ml:4, mr:4, mb:3, mt:1, pl:2,pr:2}}>
                    <Grid container spacing={1}>
                          {/* left column */}

                          <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box sx={{ml:3, mr:2, mt:2, mb:2}} >
                                      <Typography fontWeight={700}
                                                    fontSize="1rem"
                                                    gutterBottom={false}
                                                    component="span"
                                                    sx={{color:"black"}}
                                                    variant="overline" >Start protoSpaceJAM
                                      </Typography>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                      <LoadingButton variant="contained"
                                                onClick={handleLaunchButton}
                                                loading={loading}
                                                loadingPosition="end"
                                                disabled={launchDisabled}
                                                endIcon={<RocketLaunchIcon  fontSize="medium"/>}
                                        >
                                        Jam it!
                                        </LoadingButton>

                                </Box>
                                                                          
                                <Box sx={{ml:2, mr:2, mt:1, mb:2, maxWidth:700}}> 
                                              <Card>
                                                    <AppPrimer
                                                            title="Primer search parameters"
                                                            subheader=""
                                                            PrimerSearchOnOffToParent={PrimerSearchOnOffToParent}
                                                            PrimerOnOff={PrimerOnOff}
                                                            PrimerModeToParent={PrimerModeToParent}
                                                            PrimerMode={PrimerMode}
                                                            TunePrimersToParent={TunePrimersToParent}
                                                            TunePrimers={TunePrimers}
                                                            PrimerOptionsToParent={PrimerOptionsToParent}
                                                            PrimerOptions={PrimerOptions}
                                                            // gRNAnumToParent={gRNAnumToParent}
                                                    />
                                              </Card>
                                </Box>
                          </Grid>
                          {/* <Grid>
                                <Box sx={{ml:3, mr:2, mt:2, mb:2}} >
                                        <LoadingButton variant="contained"
                                                onClick={handleLaunchButton}
                                                loading={loading}
                                                loadingPosition="end"
                                                endIcon={<RocketLaunchIcon  fontSize="medium"/>}
                                        >
                                        Launch protoSpaceJAM 
                                        </LoadingButton>
                                </Box>
                          </Grid> */}
                    </Grid>
              </Paper>
              ) : null
              }

              {activeStep===4 ? (
              <Paper sx = {{ml:4, mr:4, mb:3, mt:1, pl:2,pr:2}}>
                    <Grid container spacing={1}>
                          {/* left column */}

                          <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Box sx={{ml:3, mr:2, mt:2, mb:2}} >
                                      <Typography fontWeight={700}
                                                    fontSize="1rem"
                                                    gutterBottom={false}
                                                    component="span"
                                                    sx={{color:"black"}}
                                                    variant="overline" >Results
                                      </Typography>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                      
                                          {/* <SimpleButton variant="outlined" sx={{ textTransform: 'none' }} size="small"><AddIcon fontSize="small"/> &nbsp;Load example list</SimpleButton>
                                          &nbsp;&nbsp;&nbsp;
                                          <SimpleButton variant="outlined" sx={{ textTransform: 'none' }} size="small"><DeleteIcon fontSize="small"/> &nbsp;Clear list</SimpleButton> */}
                                </Box>
                          </Grid>

                            <Grid item  spacing={3} sx={{mb:1}} direction="column" xs={12} sm={12} md={12} lg={12} xl={12}  noWrap>
                                  <Grid item>
                                    <Card variant="outlined" raised>
                                      <Box sx={{ position: 'relative', display: 'inline-flex', mt:1}}>
                                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                          <Typography fontWeight={200}
                                                    fontSize="1.1rem"
                                                    gutterBottom
                                                    component="span"
                                                    variant="inherit" 
                                                    style={{ lineHeight: "50px" }}>gRNA and Donor
                                          </Typography>
                                     </Box>
                                    <br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{DownloadResultButton}
                                        &nbsp;&nbsp;&nbsp;&nbsp;{DownloadGenBankZipButton}
                                        &nbsp;&nbsp;&nbsp;&nbsp;{DownloadInputButton}
                                        
                                        <br/><br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;click "<KeyboardArrowRightIcon/>" to view gRNA information
                                        {resTable}
                                    </Card>
                                  </Grid>
                            </Grid>
                            {PrimerOnOff ?
                            ( <>
                                          <Grid item  spacing={3} sx={{mb:1}} direction="column" xs={12} sm={12} md={12} lg={12} xl={12}  noWrap>
                                                <Grid item>
                                                  <Card variant="outlined" raised>
                                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Box sx={{ position: 'relative', display: 'inline-flex', mt:1, mb:1}}>
                                                            <Typography fontWeight={200}
                                                                  fontSize="1.1rem"
                                                                  component="span"
                                                                  variant="inherit" 
                                                                  style={{ lineHeight: "50px" }}
                                                                  >Primers
                                                            </Typography>&nbsp;&nbsp;
                                                            {PrimerProgressShow && <CircularProgressWithLabel value={primerProgress} />}
                                                            {PrimerProgress100PercentShow && <Box sx={{ position: 'relative', display: 'inline-flex'}}>
                                                                                      <CircularProgress variant="determinate" value={100} />
                                                                                      <Box
                                                                                        sx={{
                                                                                          top: -9,
                                                                                          left: 0,
                                                                                          bottom: 0,
                                                                                          right: 0,
                                                                                          position: 'absolute',
                                                                                          display: 'flex',
                                                                                          alignItems: 'center',
                                                                                          justifyContent: 'center',
                                                                                        }}>
                                                                                          <Typography variant="caption" component="div" color="text.secondary">
                                                                                            {`100%`}
                                                                                          </Typography>
                                                                                        </Box>
                                                                                      </Box>
                                                              }
                                                    </Box>
                                                    <br/>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{DownloadPrimerResultButton} 

                                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                                      {primerTable}
                                                  </Card>
                                                </Grid>
                                          </Grid>
                                </>
                            ) : null
                            }

                    </Grid>
              </Paper>
              ) : null
              }
              <div>

          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdropOpen}
          >
            Processing submission list!<br />Estimated processing time: 5s + additional 2s per entry &nbsp;&nbsp;&nbsp;&nbsp;<br />

            {pJAMProgressShow && <CircularProgressWithLabel2 value={pJAMProgress} />}
            {pJAMProgress99PercentShow && <Box sx={{ position: 'relative', display: 'inline-flex'}}>
                                      <CircularProgress color="inherit" variant="indeterminate" value={99} />
                                      <Box
                                        sx={{
                                          top: -9,
                                          left: 0,
                                          bottom: 0,
                                          right: 0,
                                          position: 'absolute',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                          <Typography variant="caption" component="div" color="white">
                                            {`99%`}
                                          </Typography>
                                        </Box>
                                      </Box>
              }

          </Backdrop>

          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={LoginBackdropOpen}
          >
            <Stack spacing={4}>

              <Typography  variant="h3">
                We are currently only open to testers and early adopters.<br />We will soon open up to the general public.<br /> <br />
              </Typography>
              <TokenTextField
                  sx={{ml:-30, mt:10}}
                  name="Invitation code"
                  label="Invitation code"
                  variant="filled"
                  type={showToken ? 'text' : 'password'}
                  onChange={updateTokedEntered}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setshowToken(!showToken)} edge="end">
                          <Iconify icon={showToken ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box textAlign='center'>
                <LoadingButton style={{maxWidth: '200px'}} fullWidth size="large" type="submit" variant="contained" onClick={handleTokenSubmitClick} >
                  Login
                </LoadingButton>
                <br/><br/>

                <SimpleButton style={{maxWidth: '400px'}} size="large" variant="outlined" href="https://forms.gle/2VkBYZGqPxxrSwMc7" target="_blank" >Don't have an invitation code? Click here</SimpleButton>
                </Box>
            </Stack>
          </Backdrop>

        </div>

      
        <Box
            sx = {{mb:-3, mt:-2, mr:5}}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <SimpleButton variant="text" color="primary" sx={{ height: 20,  textTransform: 'none' }} size = "large" onClick={handleReportBugButton}>
            Give us feedback | Report a problem
            </SimpleButton>
            </Box>
            
            <Box
            sx = {{mb:-3, mt:3, mr:5}}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <SimpleButton variant="text" color="primary" sx={{ height: 20, textTransform: 'none' }} size = "large" onClick={handlePrivacyButton}>
            Privacy and cookie policy
            </SimpleButton>
          </Box>


          <Box sx={{mr:30, ml:4}}>
            <Collapse in={privaryOpen}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setPrivaryOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                  <p>We use cookies to enable the use of Google Analytics tools.</p>
                  <p>These tools allow us to understand how people use this website: number of users, which pages are most often visited, etc.</p>
                  <p>This information is useful feedback to improve our user interface. We do not link IP addresses to anything personally identifiable. This means that user sessions will be tracked, but the users will remain anonymous.</p>
                  <p>At no time do we disclose site usage by individual IP addresses.</p>
                  <p>Learn more about Google Analytics <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage" target="_blank" rel="noreferrer">here</a>.</p>
                  <p>You are free to remove these cookies at any time by deleting them in your browser as applicable.</p>
              </Alert>
            </Collapse>

          </Box>


      </Box>

    // </Page>
  );
}


