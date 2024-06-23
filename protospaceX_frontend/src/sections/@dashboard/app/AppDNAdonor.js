import PropTypes from 'prop-types';
// import ReactApexChart from 'react-apexcharts';
import * as React from 'react';
// @mui
import {Typography, Card, CardHeader, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BuildIcon from '@mui/icons-material/Build';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Alert from '@mui/material/Alert';
// alert
import { useAlert } from 'react-alert'
// css
import '../../../css/AppDNAdonor.css';
// ----------------------------------------------------------------------
AppDNAdonor.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  // chartData: PropTypes.array.isRequired,
  // chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const armLenMarks = [
  {
    value: 100,
    label: '100',
  },
  {
    value: 500,
    label: '500',
  },
  {
    value: 1000,
    label: '1000',
  },

];

const cfdMarks = [
  {
    value: 0.03,
    label: '0.03',
  },
  {
    value: 0.1,
    label: '0.1',
  },
  {
    value: 0.2,
    label: '0.2',
  },
];

const maxSizeMarks = [
  {
    value: 50,
    label: '50',
  },
  {
    value: 200,
    label: '200',
  },
  {
    value: 400,
    label: '400',
  },

];

// enzymes list
const EnzymeNames = [
  "AanI","AarI","AasI","AatII","Aba6411II","AbaB8342IV","AbaCIII","AbaSI","AbaUMB2I","Abr4036II","AbsI","Acc16I","Acc36I","Acc65I","Acc65V","AccB1I","AccB7I","AccBSI","AccI","AccII","AccIII",
  "AceIII","AchA6III","AciI","AclI","AclWI","Aco12261II","AcoI","AcoY31II","AcsI","AcuI","AcvI","AcyI","AdeI","Adh6U21I","AfaI","AfeI","AfiI","AflII","AflIII","AgeI","AgsI","AhaIII","AhdI","AhlI",
  "AhyRBAHI","AhyYL17I","AjiI","AjnI","AjuI","AleI","AlfI","AllEnzymes","AloI","AluBI","AluI","Alw21I","Alw26I","Alw44I","AlwFI","AlwI","AlwNI","Ama87I","AmaCSI","Analysis","Aod1I","Aor13HI",
  "Aor51HI","AoxI","ApaBI","ApaI","ApaLI","ApeKI","ApoI","ApyPI","AquII","AquIII","AquIV","ArsI","AscI","AseI","Asi256I","AsiGI","AsiSI","Asp103I","Asp114pII","Asp337I","Asp700I","Asp718I","AspA2I",
  "AspAMDIV","AspBHI","AspDUT2V","AspJHL3II","AspLEI","AspNIH4III","AspS9I","AspSLV7III","Asu14238IV","AsuC2I","AsuHPI","AsuI","AsuII","AsuNHI","AteTI","AvaI","AvaII","AvaIII","AvrII","Awo1030IV","AxyI",
  "BaeGI","BaeI","Bag18758I","BalI","BamHI","BanI","BanII","BanLI","BarI","Bau1417V","BauI","Bbr52II","Bbr57III","Bbr7017II","Bbr7017III","BbrPI","BbsI","BbuB31I","BbuB31II","Bbv12I","BbvCI","BbvI",
  "BbvII","BccI","Bce3081I","Bce83I","BceAI","BceSIV","BcefI","BcgI","BciT130I","BciVI","BclI","BcnI","BcoDI","BcuI","BdaI","BetI","BfaI","BfaSII","BfiI","BfmI","BfoI","BfrI","BfuAI","BfuI","Bga514I",
  "BglI","BglII","BinI","BisI","BkrAM31DI","Ble402II","BlnI","BloAII","BlpI","BlsI","BmcAI","Bme1390I","Bme18I","BmeDI","BmeRI","BmeT110I","BmgBI","BmgI","BmgT120I","BmiI","BmrFI","BmrI","BmsI",
  "BmtI","BmuI","BoxI","BpiI","BplI","BpmI","Bpu10I","Bpu1102I","Bpu14I","BpuEI","BpuMI","Bsa29I","BsaAI","BsaBI","BsaHI","BsaI","BsaJI","BsaWI","BsaXI","BsbI","Bsc4I","BscAI","BscGI","Bse118I","Bse1I",
  "Bse21I","Bse3DI","Bse8I","BseAI","BseBI","BseCI","BseDI","BseGI","BseJI","BseLI","BseMI","BseMII","BseNI","BsePI","BseRI","BseSI","BseX3I","BseXI","BseYI","BsgI","Bsh1236I","Bsh1285I","BshFI",
  "BshNI","BshTI","BshVI","BsiEI","BsiHKAI","BsiHKCI","BsiI","BsiSI","BsiWI","BsiYI","BslFI","BslI","BsmAI","BsmBI","BsmFI","BsmI","BsnI","Bso31I","BsoBI","Bsp119I","Bsp120I","Bsp1286I","Bsp13I",
  "Bsp1407I","Bsp143I","Bsp1720I","Bsp19I","Bsp24I","Bsp3004IV","Bsp460III","Bsp68I","BspACI","BspANI","BspCNI","BspD6I","BspDI","BspEI","BspFNI","BspGI","BspHI","BspLI","BspLU11I","BspMAI","BspMI",
  "BspMII","BspNCI","BspOI","BspPI","BspQI","BspT104I","BspT107I","BspTI","BspTNI","BsrBI","BsrDI","BsrFI","BsrGI","BsrI","BssAI","BssECI","BssHII","BssMI","BssNAI","BssNI","BssSI","BssT1I","Bst1107I",
  "Bst2BI","Bst2UI","Bst4CI","Bst6I","BstACI","BstAFI","BstAPI","BstAUI","BstBAI","BstBI","BstC8I","BstDEI","BstDSI","BstEII","BstENI","BstF5I","BstFNI","BstH2I","BstHHI","BstKTI","BstMAI","BstMBI","BstMCI",
  "BstMWI","BstNI","BstNSI","BstPAI","BstPI","BstSCI","BstSFI","BstSLI","BstSNI","BstUI","BstV1I","BstV2I","BstX2I","BstXI","BstYI","BstZ17I","BstZI","Bsu15I","Bsu36I","BsuI","BsuRI","BsuTUI","BtgI",
  "BtgZI","BthCI","BtrI","BtsCI","BtsI","BtsIMutI","BtuMI","Bve1B23I","BveI","Cac8I","CaiI","Cal14237I","CalB3II","Cau10061II","CauII","Cba13II","Cba16038I","Cbo67071IV","Cch467III","CchII","CchIII","CciI",
  "CciNI","Cco14983V","Cco14983VI","CcrNAIII","Cdi11397I","CdiI","CdpI","Cdu23823II","CfoI","Cfr10I","Cfr13I","Cfr42I","Cfr9I","CfrI","CfrMH13II","CfrMH16VI","Cfupf3II","Cgl13032I","Cgl13032II","ChaI","Cje265V",
  "Cje54107III","CjeFIII","CjeFV","CjeI","CjeNII","CjeNIII","CjeNV","CjeP659IV","CjePI","CjuI","CjuII","Cla11845III","ClaI","Cly7489II","Cma23826I","CommOnly","CpoI","CseI","CsiI","Csp2014I","Csp6I",
  "CspAI","CspCI","CspI","CstMI","CviAII","CviJI","CviKI_1","CviQI","CviRI","Dde51507I","DdeI","DinI","DpnI","DpnII","DraI","DraII","DraIII","DraRI","DrdI","DrdII","DrdIV","DriI","DsaI","DseDI","DvuIII",
  "EaeI","EagI","Eam1104I","Eam1105I","EarI","EciI","Ecl136II","Ecl234I","Ecl35734I","EclXI","Eco105I","Eco130I","Eco147I","Eco24I","Eco31I","Eco32I","Eco43896II","Eco4465II","Eco47I","Eco47III","Eco52I",
  "Eco53kI","Eco57I","Eco57MI","Eco72I","Eco81I","Eco88I","Eco91I","EcoBLMcrX","EcoE1140I","EcoHI","EcoHSI","EcoICRI","EcoMVII","EcoNI","EcoNIH6II","EcoO109I","EcoO65I","EcoRI","EcoRII","EcoRV","EcoT14I",
  "EcoT22I","EcoT38I","EgeI","EheI","Eli8509II","ErhI","EsaBC3I","EsaSSI","Esp3007I","Esp3I","EspI","FaeI","FaiI","FalI","FaqI","FatI","FauI","FauNDI","Fba202Z8II","FbaI","FblI","Fco1691IV","FinI","FmuI",
  "Fnu4HI","FnuDII","FokI","FormattedSeq","FriOI","FseI","Fsp4HI","FspAI","FspBI","FspEI","FspI","FspPK15I","FtnUV","GauT27I","Gba708II","GdiII","GlaI","GluI","GsaI","GsuI","HaeI","HaeII","HaeIII","HapII",
  "HauII","HbaII","HdeNY26I","HdeZA17I","HgaI","HgiAI","HgiCI","HgiEII","HgiJII","HhaI","Hin1I","Hin1II","Hin4I","Hin4II","Hin6I","HinP1I","HincII","HindII","HindIII","HinfI","HpaI","HpaII","HphI",
  "Hpy166II","Hpy178III","Hpy188I","Hpy188III","Hpy300XI","Hpy8I","Hpy99I","Hpy99XIII","Hpy99XIV","Hpy99XIV_mut1","Hpy99XXII","HpyAV","HpyAXIV","HpyAXVIII","HpyAXVI_mut1","HpyAXVI_mut2","HpyCH4III","HpyCH4IV",
  "HpyCH4V","HpyF10VI","HpyF3I","HpySE526I","HpyUM032XIII","HpyUM032XIII_mut1","HpyUM032XIV","HpyUM037X","Hso63250IV","Hso63373III","Hsp92I","Hsp92II","HspAI","HspMHR1II","Jma19592I","Jma19592II","Jsp2502II",
  "KasI","KflI","Kor51II","Kpn156V","Kpn2I","Kpn327I","KpnI","KpnNH25III","KpnNIH30III","KpnNIH50I","KroI","Ksp22I","Ksp632I","KspAI","KspI","Kzo9I","Lba2029III","Lbr124II","Lde4408II","LguI","LlaG50I","LmnI",
  "Lmo370I","Lmo911II","Lpl1004II","LpnI","LpnPI","Lra68I","LsaDS4I","Lsp1109I","Lsp48III","Lsp6406VI","LweI","MabI","MaeI","MaeII","MaeIII","MalI","MaqI","MauBI","Mba11I","MbiI","MboI","MboII","McaTI","Mcr10I",
  "McrI","MfeI","MflI","MhlI","MjaIV","MkaDII","MlsI","Mlu211III","MluCI","MluI","MluNI","Mly113I","MlyI","MmeI","MnlI","Mox20I","Mph1103I","MreI","MroI","MroNI","MroXI","MscI","MseI","MslI","Msp20I","MspA1I",
  "MspCI","MspGI","MspI","MspI7II","MspI7IV","MspJI","MspR9I","MspSC27II","MssI","MstI","MteI","MtuHN878II","MunI","Mva1269I","MvaI","MvnI","MwoI","NaeI","Nal45188II","NarI","Nbr128II","NciI","NcoI","NdeI","NdeII",
  "NgoAVII","NgoAVIII","NgoMIV","NhaXI","NheI","NhoI","NlaCI","NlaIII","NlaIV","Nli3877I","NmeA6CIII","NmeAIII","NmeDI","NmuCI","NonComm","NotI","NpeUS61II","NruI","NsbI","NsiI","NspBII","NspI","NspV",
  "ObaBS10I","OgrI","OliI","OspHL35III","PabI","Pac19842II","PacI","PacIII","PaeI","PaePA99III","PaeR7I","PagI","Pal408I","PalAI","PasI","PauI","Pba2294I","PcaII","PceI","PciI","PciSI","Pcr308II","PcsI","PctI",
  "Pdi8503III","PdiI","PdmI","Pdu1735I","PenI","PfeI","Pfl1108I","Pfl23II","Pfl8569I","PflFI","PflMI","PflPt14I","PfoI","PfrJS12IV","PfrJS12V","PfrJS15III","Pin17FIII","PinAI","PinP23II","PinP59III","PkrI","PlaDI",
  "Ple19I","PleI","PliMI","PluTI","PmaCI","PmeI","PmlI","PpiI","PpiP13II","PpsI","Ppu10I","Ppu21I","PpuMI","PrintFormat","PscI","Pse18267I","PshAI","PshBI","PsiI","Psp0357II","Psp03I","Psp124BI","Psp1406I",
  "Psp5II","Psp6I","PspCI","PspEI","PspFI","PspGI","PspLI","PspN4I","PspOMI","PspOMII","PspPI","PspPPI","PspPRI","PspXI","PsrI","PssI","Pst14472I","Pst145I","Pst273I","PstI","PstNI","PsuGI","PsuI","PsyI","PteI",
  "PvuI","PvuII","Rba2021I","RceI","RdeGBI","RdeGBII","RdeGBIII","Restriction","RestrictionBatch","Restriction_Dictionary","RflFIII","RgaI","RigI","RlaI","RlaII","RleAI","Rmu369III","RpaB5I","RpaBI","RpaI","RpaTI",
  "RruI","RsaI","RsaNI","RseI","Rsp008IV","Rsp008V","Rsp531II","RspPBTS2III","Rsr2I","RsrII","Rtr1953I","SacI","SacII","Saf8902III","Sag901I","SalI","SanDI","SapI","SaqAI","SatI","Sau3AI","Sau64037IV","Sau96I",
  "SauI","Sba460II","SbfI","Sbo46I","ScaI","SchI","SciI","ScoDS2II","ScrFI","SdaI","SdeAI","SdeOSI","SduI","SecI","SelI","Sen17963III","SenA1673III","SenSARA26III","SenTFIV","SetI","SexAI","SfaAI","SfaNI","SfcI",
  "SfeI","SfiI","SfoI","Sfr274I","Sfr303I","SfuI","SgeI","SgfI","SgrAI","SgrAII","SgrBI","SgrDI","SgrTI","SgsI","SimI","SinI","SlaI","SmaI","SmaUMH5I","SmaUMH8I","SmiI","SmiMI","SmlI","SmoI","Sna507VIII","SnaBI",
  "SnaI","Sno506I","Spe19205IV","SpeI","SphI","SplI","SpnRII","SpoDI","SrfI","Sse232I","Sse8387I","Sse8647I","Sse9I","SseBI","SsiI","Ssp6803IV","Ssp714II","SspD5I","SspDI","SspI","SspJOR1II","SspMI","SstE37I",
  "SstI","Sth132I","Sth20745III","Sth302II","SthSt3II","StsI","StuI","StyD4I","StyI","SurP32aII","SwaI","TaaI","TaiI","TaqI","TaqII","TaqIII","TasI","TatI","TauI","TfiI","TpyTP2I","Tru1I","Tru9I","TscAI","TseFI",
  "TseI","TsoI","Tsp45I","Tsp4CI","TspARh3I","TspDTI","TspEI","TspGWI","TspMI","TspRI","TssI","TstI","TsuI","Tth111I","Tth111II","UbaF11I","UbaF12I","UbaF13I","UbaF14I","UbaF9I","UbaPI","UcoMSI","UnbI","Van9116I",
  "Van91I","VchE4II","Vdi96II","Vha464I","VneI","VpaK11AI","VpaK11BI","VspI","Vtu19109I","WviI","XagI","XapI","XbaI","Xca85IV","XceI","XcmI","XhoI","XhoII","XmaI","XmaIII","XmaJI","XmiI","XmnI","XspI","YkrI","ZraI","ZrmI","Zsp2I"
]

  function getStyles(name, SelectedEnzyme, theme) {
    return {
      fontWeight:
      SelectedEnzyme.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  
  // enzymes list theme
const ITEM_HEIGHT = 65;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};


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

export default function AppDNAdonor({ title, subheader, 
  NpayloadToParent,CpayloadToParent,PosPayloadToParent, PayloadModeToParent, PayloadSeqtoParent, TagToParent, LinkerToParent, TagNameToParent, LinkerNameToParent, 
  DonorSSDStoParent, enforceMaxDonLenToParent, MaxDonLenToParent, HAlenToParent, MinArmLenPostTrimToParent,
  recodeIntensityToParent,MutateOrderChangeToParent, cfdThresToParent,
  StrandChoiceToParent,
  SelectedEnzymeToParent, CustomSeq2AvoidToParent,
  ShowStrandselectionToParent, tagLinkerOrderToParent, 
  RecodeOnlyInCodingRegionToParent,

  NpayloadToChildren, CpayloadToChildren, PosPayloadToChildren, PayloadModeToChildren,PayloadSeqtoChildren, TagSeqToChildren, LinkerSeqToChildren, TagNameToChildren, LinkerNameToChildren,
  DonorSSDSToChildren, EnforceMaxDonLenToChildren, MaxDonLenToChildren, HAlenToChildren, MinArmLenPostTrimToChildren,
  recodeIntensityToChildren, MutateOrderPAMfirstToChildren,ShowMutateOrderToChildren, cfdThresToChildren,
  strandChoiceToChildren,
  SelectedEnzymeToChildren, CustomSeq2AvoidToChildren,
  RecodeOnlyInCodingRegionToChildren,
  ShowStrandselectionToChildren, ShowOnePayloadInputToChildren, ShowTwoPayloadInputToChildren, ShowTagAndLinkerPayloadInputToChildren, ...other }) {

  const alert = useAlert()

  // Donor strand selection Show all options
  const [DonorStrandSelectionShowAll, setDonorStrandSelectionShowAll] = React.useState(true);
  const DonorStrandSelectionExpand = () =>{
    setDonorStrandSelectionShowAll(true)
  }

  const [DonorStrandSelectionShowAllChangeButtonLabel,setDonorStrandSelectionShowAllChangeButtonLabel] = React.useState("Hide options")

  const handleDonorStrandSelectionShowAllChange = () => {
    setDonorStrandSelectionShowAll(DonorStrandSelectionShowAll => !DonorStrandSelectionShowAll)
    if (DonorStrandSelectionShowAll)
    {
      setDonorStrandSelectionShowAllChangeButtonLabel("Show all options")
    }
    else{
      setDonorStrandSelectionShowAllChangeButtonLabel("Hide options")
    }
  } 

  // show other options
  const [OtherOptionsShow, setOtherOptionsShow] = React.useState(false);
  const OtherOptionsExpand = () =>{
    setOtherOptionsShow(true)
  }
  const OtherOptionsCollapse = () =>{
    setOtherOptionsShow(false)
  }

  // payload selection
  const [Tag, setTag] = React.useState('mNG11');
  const handleTagChange = (event: SelectChangeEvent) => {
    // check if both tag and linker are selected, and warn user if both are empty
    if(event.target.value === "skip_tag" && Linker === "skip_linker")
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Warning: both the tag and linker sequences are empty</div>, {timeout: 5000})
    }

    setTag(event.target.value);
    
    if(event.target.value === "skip_tag") // set text box sequence
    {
      setTagSeq("")
      TagToParent("")
      TagNameToParent("skip_tag")
    }
    if(event.target.value === "mNG11") // set text box sequence
    {
      setTagSeq("ACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG")
      TagToParent("ACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG") // communicate change to parent element
      TagNameToParent("mNG11")
      // aa sequence: TELNFKEWQKAFTDMM
    }
    if(event.target.value === "GFP11") // set text box sequence
    {
      setTagSeq("CGGGACCACATGGTGCTGCACGAGTACGTGAACGCCGCCGGCATCACA")
      TagToParent("CGGGACCACATGGTGCTGCACGAGTACGTGAACGCCGCCGGCATCACA") // communicate change to parent element
      TagNameToParent("GFP11")
      // aa sequence RDHMVLHEYVNAAGIT
    }
    if(event.target.value === "HA") // set text box sequenceLinkerSeq
    {
      setTagSeq("TACCCATACGATGTTCCAGATTACGCT")
      TagToParent("TACCCATACGATGTTCCAGATTACGCT")
      TagNameToParent("HA")
    }
    if(event.target.value === "3xHA") // set text box sequenceLinkerSeq
    {
      setTagSeq("TACCCGTATGATGTTCCGGATTACGCTGGCTACCCATACGACGTCCCAGACTACGCTGGCTACCCATACGACGTCCCAGACTACGCT")
      TagToParent("TACCCGTATGATGTTCCGGATTACGCTGGCTACCCATACGACGTCCCAGACTACGCTGGCTACCCATACGACGTCCCAGACTACGCT")
      TagNameToParent("3xHA")
    }
    if(event.target.value === "6xHis-Tag") // set text box sequence
    {
      setTagSeq("CATCACCATCACCATCAC")
      TagToParent("CATCACCATCACCATCAC")
      TagNameToParent("6xHis-Tag")
    }
    if(event.target.value === "c-Myc") // set text box sequence
    {
      setTagSeq("GAACAAAAACTTATTAGCGAAGAAGATCTT")
      TagToParent("GAACAAAAACTTATTAGCGAAGAAGATCTT")
      TagNameToParent("c-Myc")
    }    
    if(event.target.value === "Streptavidin") // set text box sequence
    {
      setTagSeq("TGGAGCCACCCGCAGTTCGAAAAA")
      TagToParent("TGGAGCCACCCGCAGTTCGAAAAA")
      TagNameToParent("Streptavidin")
    }    
    if(event.target.value === "Flag") // set text box sequence
    {
      setTagSeq("GACTACAAAGACGATGACGACAAG")
      TagToParent("GACTACAAAGACGATGACGACAAG")
      TagNameToParent("Flag")
    }    
    if(event.target.value === "GFP") // set text box sequence
    {
      setTagSeq("AGTAAAGGAGAAGAACTTTTCACTGGAGTTGTCCCAATTCTTGTTGAATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCAAGATACCCAGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAAAGAACTATATTTTTCAAAGATGACGGGAACTACAAGACACGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATAGAATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTTGGACACAAATTGGAATACAACTATAACTCACACAATGTATACATCATGGCAGACAAACAAAAGAATGGAATCAAAGTTAACTTCAAAATTAGACACAACATTGAAGATGGAAGCGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCCACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGAGAGACCACATGGTCCTTCTTGAGTTTGTAACAGCTGCTGGGATTACACATGGCATGGATGAACTATACAAA")
      TagToParent("AGTAAAGGAGAAGAACTTTTCACTGGAGTTGTCCCAATTCTTGTTGAATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCAAGATACCCAGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAAAGAACTATATTTTTCAAAGATGACGGGAACTACAAGACACGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATAGAATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTTGGACACAAATTGGAATACAACTATAACTCACACAATGTATACATCATGGCAGACAAACAAAAGAATGGAATCAAAGTTAACTTCAAAATTAGACACAACATTGAAGATGGAAGCGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCCACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGAGAGACCACATGGTCCTTCTTGAGTTTGTAACAGCTGCTGGGATTACACATGGCATGGATGAACTATACAAA")
      TagNameToParent("GFP")
    }  
    if(event.target.value === "eGFP") // set text box sequence
    {
      setTagSeq("GTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAGCTGGACGGCGACGTAAACGGCCACAAGTTCAGCGTGTCCGGCGAGGGCGAGGGCGATGCCACCTACGGCAAGCTGACCCTGAAGTTCATCTGCACCACCGGCAAGCTGCCCGTGCCCTGGCCCACCCTCGTGACCACCCTGACCTACGGCGTGCAGTGCTTCAGCCGCTACCCCGACCACATGAAGCAGCACGACTTCTTCAAGTCCGCCATGCCCGAAGGCTACGTCCAGGAGCGCACCATCTTCTTCAAGGACGACGGCAACTACAAGACCCGCGCCGAGGTGAAGTTCGAGGGCGACACCCTGGTGAACCGCATCGAGCTGAAGGGCATCGACTTCAAGGAGGACGGCAACATCCTGGGGCACAAGCTGGAGTACAACTACAACAGCCACAACGTCTATATCATGGCCGACAAGCAGAAGAACGGCATCAAGGTGAACTTCAAGATCCGCCACAACATCGAGGACGGCAGCGTGCAGCTCGCCGACCACTACCAGCAGAACACCCCCATCGGCGACGGCCCCGTGCTGCTGCCCGACAACCACTACCTGAGCACCCAGTCCGCCCTGAGCAAAGACCCCAACGAGAAGCGCGATCACATGGTCCTGCTGGAGTTCGTGACCGCCGCCGGGATCACTCTCGGCATGGACGAGCTGTACAAG")
      TagToParent("GTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAGCTGGACGGCGACGTAAACGGCCACAAGTTCAGCGTGTCCGGCGAGGGCGAGGGCGATGCCACCTACGGCAAGCTGACCCTGAAGTTCATCTGCACCACCGGCAAGCTGCCCGTGCCCTGGCCCACCCTCGTGACCACCCTGACCTACGGCGTGCAGTGCTTCAGCCGCTACCCCGACCACATGAAGCAGCACGACTTCTTCAAGTCCGCCATGCCCGAAGGCTACGTCCAGGAGCGCACCATCTTCTTCAAGGACGACGGCAACTACAAGACCCGCGCCGAGGTGAAGTTCGAGGGCGACACCCTGGTGAACCGCATCGAGCTGAAGGGCATCGACTTCAAGGAGGACGGCAACATCCTGGGGCACAAGCTGGAGTACAACTACAACAGCCACAACGTCTATATCATGGCCGACAAGCAGAAGAACGGCATCAAGGTGAACTTCAAGATCCGCCACAACATCGAGGACGGCAGCGTGCAGCTCGCCGACCACTACCAGCAGAACACCCCCATCGGCGACGGCCCCGTGCTGCTGCCCGACAACCACTACCTGAGCACCCAGTCCGCCCTGAGCAAAGACCCCAACGAGAAGCGCGATCACATGGTCCTGCTGGAGTTCGTGACCGCCGCCGGGATCACTCTCGGCATGGACGAGCTGTACAAG")
      TagNameToParent("eGFP")
    }  
    if(event.target.value === "mNeonGreen") // set text box sequence
    {
      setTagSeq("GTGAGCAAGGGCGAGGAGGATAACATGGCCTCTCTCCCAGCGACACATGAGTTACACATCTTTGGCTCCATCAACGGTGTGGACTTTGACATGGTGGGTCAGGGCACCGGCAATCCAAATGATGGTTATGAGGAGTTAAACCTGAAGTCCACCAAGGGTGACCTCCAGTTCTCCCCCTGGATTCTGGTCCCTCATATCGGGTATGGCTTCCATCAGTACCTGCCCTACCCTGACGGGATGTCGCCTTTCCAGGCCGCCATGGTAGATGGCTCCGGATACCAAGTCCATCGCACAATGCAGTTTGAAGATGGTGCCTCCCTTACTGTTAACTACCGCTACACCTACGAGGGAAGCCACATCAAAGGAGAGGCCCAGGTGAAGGGGACTGGTTTCCCTGCTGACGGTCCTGTGATGACCAACTCGCTGACCGCTGCGGACTGGTGCAGGTCGAAGAAGACTTACCCCAACGACAAAACCATCATCAGTACCTTTAAGTGGAGTTACACCACTGGAAATGGCAAGCGCTACCGGAGCACTGCGCGGACCACCTACACCTTTGCCAAGCCAATGGCGGCTAACTATCTGAAGAACCAGCCGATGTACGTGTTCCGTAAGACGGAGCTCAAGCACTCCAAGACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATGTGATGGGCATGGACGAGCTGTACAAG")
      TagToParent("GTGAGCAAGGGCGAGGAGGATAACATGGCCTCTCTCCCAGCGACACATGAGTTACACATCTTTGGCTCCATCAACGGTGTGGACTTTGACATGGTGGGTCAGGGCACCGGCAATCCAAATGATGGTTATGAGGAGTTAAACCTGAAGTCCACCAAGGGTGACCTCCAGTTCTCCCCCTGGATTCTGGTCCCTCATATCGGGTATGGCTTCCATCAGTACCTGCCCTACCCTGACGGGATGTCGCCTTTCCAGGCCGCCATGGTAGATGGCTCCGGATACCAAGTCCATCGCACAATGCAGTTTGAAGATGGTGCCTCCCTTACTGTTAACTACCGCTACACCTACGAGGGAAGCCACATCAAAGGAGAGGCCCAGGTGAAGGGGACTGGTTTCCCTGCTGACGGTCCTGTGATGACCAACTCGCTGACCGCTGCGGACTGGTGCAGGTCGAAGAAGACTTACCCCAACGACAAAACCATCATCAGTACCTTTAAGTGGAGTTACACCACTGGAAATGGCAAGCGCTACCGGAGCACTGCGCGGACCACCTACACCTTTGCCAAGCCAATGGCGGCTAACTATCTGAAGAACCAGCCGATGTACGTGTTCCGTAAGACGGAGCTCAAGCACTCCAAGACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATGTGATGGGCATGGACGAGCTGTACAAG")
      TagNameToParent("mNeonGreen")
    }  
    if(event.target.value === "mCherry") // set text box sequence
    {
      setTagSeq("GTGAGCAAGGGCGAGGAGGATAACATGGCCATCATCAAGGAGTTCATGCGCTTCAAGGTGCACATGGAGGGCTCCGTGAACGGCCACGAGTTCGAGATCGAGGGCGAGGGCGAGGGCCGCCCCTACGAGGGCACCCAGACCGCCAAGCTGAAGGTGACCAAGGGTGGCCCCCTGCCCTTCGCCTGGGACATCCTGTCCCCTCAGTTCATGTACGGCTCCAAGGCCTACGTGAAGCACCCCGCCGACATCCCCGACTACTTGAAGCTGTCCTTCCCCGAGGGCTTCAAGTGGGAGCGCGTGATGAACTTCGAGGACGGCGGCGTGGTGACCGTGACCCAGGACTCCTCCCTGCAGGACGGCGAGTTCATCTACAAGGTGAAGCTGCGCGGCACCAACTTCCCCTCCGACGGCCCCGTAATGCAGAAGAAGACCATGGGCTGGGAGGCCTCCTCCGAGCGGATGTACCCCGAGGACGGCGCCCTGAAGGGCGAGATCAAGCAGAGGCTGAAGCTGAAGGACGGCGGCCACTACGACGCTGAGGTCAAGACCACCTACAAGGCCAAGAAGCCCGTGCAGCTGCCCGGCGCCTACAACGTCAACATCAAGTTGGACATCACCTCCCACAACGAGGACTACACCATCGTGGAACAGTACGAACGCGCCGAGGGCCGCCACTCCACCGGCGGCATGGACGAGCTGTACAAG")
      TagToParent("GTGAGCAAGGGCGAGGAGGATAACATGGCCATCATCAAGGAGTTCATGCGCTTCAAGGTGCACATGGAGGGCTCCGTGAACGGCCACGAGTTCGAGATCGAGGGCGAGGGCGAGGGCCGCCCCTACGAGGGCACCCAGACCGCCAAGCTGAAGGTGACCAAGGGTGGCCCCCTGCCCTTCGCCTGGGACATCCTGTCCCCTCAGTTCATGTACGGCTCCAAGGCCTACGTGAAGCACCCCGCCGACATCCCCGACTACTTGAAGCTGTCCTTCCCCGAGGGCTTCAAGTGGGAGCGCGTGATGAACTTCGAGGACGGCGGCGTGGTGACCGTGACCCAGGACTCCTCCCTGCAGGACGGCGAGTTCATCTACAAGGTGAAGCTGCGCGGCACCAACTTCCCCTCCGACGGCCCCGTAATGCAGAAGAAGACCATGGGCTGGGAGGCCTCCTCCGAGCGGATGTACCCCGAGGACGGCGCCCTGAAGGGCGAGATCAAGCAGAGGCTGAAGCTGAAGGACGGCGGCCACTACGACGCTGAGGTCAAGACCACCTACAAGGCCAAGAAGCCCGTGCAGCTGCCCGGCGCCTACAACGTCAACATCAAGTTGGACATCACCTCCCACAACGAGGACTACACCATCGTGGAACAGTACGAACGCGCCGAGGGCCGCCACTCCACCGGCGGCATGGACGAGCTGTACAAG")
      TagNameToParent("mCherry")
    }  
    if(event.target.value === "Custom") // reset on custom selection
    {
      setTagSeq("")
    }
    
  };
  const [Linker, setLinker] = React.useState('HRV_3C_cleavable_linker');
  const handleLinkerChange = (event: SelectChangeEvent) => {
    // check if both tag and linker are selected, and warn user if both are empty
    if(event.target.value === "skip_linker" && Tag === "skip_tag")
    {
      alert.error(<div style={{ textTransform: 'initial' }}>Warning: both the tag and linker sequences are empty</div>, {timeout: 5000})
    }
    
    setLinker(event.target.value);
    if(event.target.value === "skip_linker") // set text box sequence
    {
      setLinkerSeq("")
      LinkerToParent("")
      LinkerNameToParent("skip_linker")
    }
    if (event.target.value === "HRV_3C_cleavable_linker")
    {
      setLinkerSeq("GGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGT")
      LinkerToParent("GGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGT"); // communicate change to parent element
      LinkerNameToParent("HRV_3C_cleavable_linker")
    }
    if (event.target.value === "XTEN80")
    {
      setLinkerSeq("GGAGGGCCGAGCTCTGGCGCACCCCCACCAAGTGGAGGGTCTCCTGCCGGGTCCCCAACATCTACTGAAGAAGGCACCAGCGAATCCGCAACGCCCGAGTCAGGCCCTGGTACCTCCACAGAACCATCTGAAGGTAGTGCGCCTGGTTCCCCAGCTGGAAGCCCTACTTCCACCGAAGAAGGCACGTCAACCGAACCAAGTGAAGGATCTGCCCCTGGGACCAGCACTGAACCATCTGAG")
      LinkerToParent("GGAGGGCCGAGCTCTGGCGCACCCCCACCAAGTGGAGGGTCTCCTGCCGGGTCCCCAACATCTACTGAAGAAGGCACCAGCGAATCCGCAACGCCCGAGTCAGGCCCTGGTACCTCCACAGAACCATCTGAAGGTAGTGCGCCTGGTTCCCCAGCTGGAAGCCCTACTTCCACCGAAGAAGGCACGTCAACCGAACCAAGTGAAGGATCTGCCCCTGGGACCAGCACTGAACCATCTGAG"); // communicate change to parent element
      LinkerNameToParent("XTEN80")
    }
    if (event.target.value === "XTEN")
    {
      setLinkerSeq("AGCGGCAGCGAGACTCCCGGGACCTCAGAGTCCGCCACACCCGAAAGT")
      LinkerToParent("AGCGGCAGCGAGACTCCCGGGACCTCAGAGTCCGCCACACCCGAAAGT"); // communicate change to parent element
      LinkerNameToParent("XTEN")
    }
    if (event.target.value === "GGGS3")
    {
      setLinkerSeq("GGCGGTGGCTCTGGAGGTGGTGGGTCCGGCGGTGGCTCT")
      LinkerToParent("GGCGGTGGCTCTGGAGGTGGTGGGTCCGGCGGTGGCTCT")
      LinkerNameToParent("GGGS3")
    }
    if (event.target.value === "GGGGS2")
    {
      setLinkerSeq("GGTGGTGGTGGTTCTGGTGGTGGTGGTTCT")
      LinkerToParent("GGTGGTGGTGGTTCTGGTGGTGGTGGTTCT")
      LinkerNameToParent("GGGGS2")
    }
    if (event.target.value === "PL_rigid")
    {
      setLinkerSeq("GAAGCTGCTGCAAGAGAAGCTGCAGCTAGGGAGGCTGCAGCTAGGGAGGCTGCTGCAAGA")
      LinkerToParent("GAAGCTGCTGCAAGAGAAGCTGCAGCTAGGGAGGCTGCAGCTAGGGAGGCTGCTGCAAGA")
      LinkerNameToParent("PL_rigid")
    }    
    if (event.target.value === "Custom") // reset on custom selection
    {
      setLinkerSeq("")
    }
    

  };

  const [TagSeq, setTagSeq] = React.useState('ACCGAGCTCAACTTCAAGGAGTGGCAAAAGGCCTTTACCGATATGATG');
  const HandleTagSeqChange = (event) => {
    setTagSeq(event.target.value);
    setTag("Custom")
    TagToParent(event.target.value); // communicate change to parent element
  };
  const [LinkerSeq, setLinkerSeq] = React.useState('GGTGGCGGATTGGAAGTTTTGTTTCAAGGTCCAGGAAGTGGT');
  const HandleLinkerSeqChange = (event) => {
    setLinkerSeq(event.target.value);
    setLinker("Custom")
    LinkerToParent(event.target.value); // communicate change to parent element
  };
    
  const handleTagLinkerOrderChange = (event) => {
    if (event.target.checked)
    {
      tagLinkerOrderToParent("linkerFirst")
    }
    else
    {
      tagLinkerOrderToParent("tagFirst")
    }
    // console.log(event.target.checked)
  }

 // enforce maxiumn donor size Check box
  const handleEnforceMaxDonLen = (event) => {
    enforceMaxDonLenToParent(event.target.checked)
  };

  // Recode Mode radio choice
  const handleRecodeIntensityChange = (event) => {
    recodeIntensityToParent(event.target.value); // communicate change to parent element
  };

  // Donor ss or ds radio choice
  const handleDonorSSDSChange = (event) => {
    DonorSSDStoParent(event.target.value); // communicate change to parent element
    if (event.target.value==="ssODN")
    {
      ShowStrandselectionToParent(true)
      enforceMaxDonLenToParent(true) // turn on enforce maximum donor length, the change will propagate back to this children component
      MaxDonLenToParent(200);
      setHAlen(500); 
      HAlenToParent(500);
      
    }
    if (event.target.value==="dsDNA")
    {
      ShowStrandselectionToParent(false)
      enforceMaxDonLenToParent(false) // turn off enforce maximum donor length, 
      setHAlen(500); // set HA length = 500
      HAlenToParent(500); // communicate change to parent element
    }
  };

  // mutate order
  const handleMutateOrderChange = (event) => {
    if (event.target.checked)
    {
      MutateOrderChangeToParent("protospacer_first")
    }
    else
    {
      MutateOrderChangeToParent("PAM_first")
    }
  }
  // strand choice
  const handleStrandChoiceChange = (event) => {
    StrandChoiceToParent(event.target.value); // communicate change to parent element
  }

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 380,
    },
  });

  // Payload mode radio and its logic
  const handlePayloadModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    PayloadModeToParent(event.target.value); // communicate change to parent element, the change will propagate back here to reflect in the display
    // display menus accordingly
    // console.log(event.target.value)
  };

    // N C payload 
    const HandleNpayloadChange = (event) => {
      NpayloadToParent(event.target.value);
    };
    const HandleCpayloadChange = (event) => {
      CpayloadToParent(event.target.value);
    };
    const HandlePospayloadChange = (event) => {
      PosPayloadToParent(event.target.value);
    };
    
    // payload
    const [PayloadSeq, setPayloadSeq] = React.useState('');
    const HandlePayloadSeqChange = (event) => {
      setPayloadSeq(event.target.value);
      PayloadSeqtoParent(event.target.value)
    };
  
    // cfd threshold
    const handlecfdThresChange = () => (event) => {
      cfdThresToParent(event.target.value); // communicate change to parent element
    };
  
    // HA length change
    const [HAlen, setHAlen] = React.useState(500);
    const handleHAlenChange = () => (event) => {
      setHAlen(event.target.value);
      HAlenToParent(event.target.value); // communicate change to parent element
    };
  
    // max Donor size change
    const handleMaxDonLenChange = () => (event) => {
      MaxDonLenToParent(event.target.value); // communicate change to parent element
    };

    // show Additional changes
    const [ShowAdditionalSettings, setShowAdditionalSettings] = React.useState(true);
    const handleShowAdditionalSettingsChange = () => {
      setShowAdditionalSettings(ShowAdditionalSettings => !ShowAdditionalSettings)
      if (ShowAdditionalSettings)
      {
        setShowAdditionalSettingsButtonLabel("Show additional settings")
      }
      else
      {
        setShowAdditionalSettingsButtonLabel("Hide additional settings")
      }
      
    };
    
    const [ShowAdditionalSettingsButtonLabel, setShowAdditionalSettingsButtonLabel] = React.useState("Hide additional settings");

    // enzyme selections
    const theme = useTheme();

    const [SelectedEnzyme, setSelectedEnzyme] = React.useState([]);

    const handleSelectedEnzymeChange = (event) => {
      const {
        target: { value },
      } = event;
      setSelectedEnzyme(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
      // communicate the selected enzyme to parent
      SelectedEnzymeToParent(typeof value === 'string' ? value.split(',') : value);
    };

    // custom seqs to avoid
    const [CustomSeq2Avoid, setCustomSeq2Avoid] = React.useState("");

    const handleCustomSeq2AvoidChange = (event) => {
      setCustomSeq2Avoid(event.target.value)
      CustomSeq2AvoidToParent(event.target.value);
      // GenesToParent(event.target.value)
    };

    // Minimum post trim arm length
    const [MinArmLenPostTrim, setMinArmLenPostTrim] = React.useState(100);

    const handleMinArmLenPostTrimChange = (event) => {
      setMinArmLenPostTrim(event.target.value)
      MinArmLenPostTrimToParent(event.target.value);
    };

    // Recode In Coding Region
    const HandleRecodeOnlyInCodingRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      RecodeOnlyInCodingRegionToParent(event.target.checked);
    };
    
  const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 0 0 1px rgb(16 22 26 / 40%)'
        : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
    backgroundImage:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
        : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
      // outline: '2px auto rgba(19,124,189,.6)',
      outline: '2px auto rgba(40, 166, 209,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#28A6D1',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background:
        theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
    },
  }));
  const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: '#28A6D1',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      // backgroundColor: '#106ba3',
      backgroundColor: '#28A6D1',
    },
  });
  
  // Inspired by blueprintjs
  function BpRadio(props) {
    return (
      <Radio
        sx={{
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        {...props}
      />
    );
  }

  return (
    <Card variant="outlined" {...other}>
      <CardHeader title={title} subheader={subheader} />
        <Box sx={{ pt:3, pl: 1 , pb: 1, pr:0, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth:1000 }} >


                {/* payload */}
                <Box sx={{ mt:1, ml: 2, mb: 1, mr:2, pl:1, pr:1, pb:1, width:"100%", maxWidth: 735, boxShadow:5, bgcolor: '#edf4f7', }}  dir="ltr">
                 <Box>
                      <FormControl sx={{ mt:1, ml:3, mb: 2,maxWidth: 1000 }} dir="ltr">
                            <Typography nowrap = "true" variant="subtitle1" align="left" gutterBottom="true">
                            Payload &nbsp; <font style={{color:'grey', fontSize:"12px"}}> * Required</font>
                            </Typography>
                              <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    // defaultValue="recoding_all"
                                    name="radio-buttons-group"
                                    value={PayloadModeToChildren}
                                    onChange={handlePayloadModeChange}
                                    size="small" 
                                  >
                                    <FormControlLabel value="TwoPayloads" control={<BpRadio  />} label={
                                      <p> Enter terminus- and/or position-specific payloads
                                        <Tooltip title="Payloads that are specific to N-,C-terminus or custom genomic coordinates"> 
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                        </Tooltip>
                                      </p>}
                                    />   

                                    <FormControlLabel value="OnePayLoad" control={<BpRadio  />} label={
                                      <p> Enter a single payload for all designs
                                        <Tooltip title="Payload used for all designs in the current session"> 
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small" />
                                              </IconButton>
                                        </Tooltip>
                                      </p>}
                                    />
                                    <FormControlLabel value="TagAndLinker" control={<BpRadio  />} label={
                                      <p> Select tag and linker for all designs
                                        <Tooltip title="Select from dropdown menus and use toggle switch to control the order of tag and linker"> 
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small" />
                                              </IconButton>
                                        </Tooltip>
                                      </p>}
                                    />
                                  </RadioGroup>

                          </FormControl>
                      {ShowTwoPayloadInputToChildren ?
                            ( <>
                              {/* N-term payload  */}
                              <br/>
                            <FormControl  sx={{width:"95%", maxWidth: 900, mb:1, ml:2 }} dir="ltr">
                                  <TextField 
                                      // required          
                                      multiline
                                      rows={4} 
                                      // defaultValue=""
                                      value = {NpayloadToChildren}
                                      id="outlined-basic" 
                                      label={<p>Payload sequence for N-terminus (inserted after the start codon)</p>}
                                      placeholder=""
                                      variant="outlined"
                                      onChange={HandleNpayloadChange}
                                      />
                              </FormControl>
                              <br/>
                              {/* C-term payload */}
                              <FormControl  sx={{width:"95%", maxWidth: 900, ml:2, mb:1 }} dir="ltr">
                                  <TextField 
                                      // required          
                                      multiline
                                      rows={4} 
                                      // defaultValue=""
                                      value = {CpayloadToChildren}
                                      id="outlined-basic" 
                                      label={<p>Payload sequence for C-terminus (inserted before the stop codon)</p>}
                                      placeholder=""
                                      variant="outlined"
                                      onChange={HandleCpayloadChange}
                                      />
                              </FormControl>
                              {/* custom genomic coordinate payload */}
                              <FormControl  sx={{width:"95%", maxWidth: 900, ml:2, mb:1 }} dir="ltr">
                                  <TextField 
                                      // required          
                                      multiline
                                      rows={4} 
                                      // defaultValue=""
                                      value = {PosPayloadToChildren}
                                      id="outlined-basic" 
                                      label={<p>Payload for custom genomic coordinate (inserted after the coordinate)</p>}
                                      placeholder=""
                                      variant="outlined"
                                      onChange={HandlePospayloadChange}
                                      />
                              </FormControl>
                              </>) : null }


                      {ShowOnePayloadInputToChildren ?
                        ( <>
                          {/*  payload  */}
                        <br/>
                        <FormControl  sx={{width:"95%", maxWidth: 900, mb:1, ml:2 }} dir="ltr">
                              <TextField 
                                  // required          
                                  multiline
                                  rows={5} 
                                  // defaultValue=""
                                  value = {PayloadSeqtoChildren}
                                  id="outlined-basic" 
                                  label={<p>Payload sequence</p>}
                                  placeholder=""
                                  variant="outlined"
                                  onChange={HandlePayloadSeqChange}
                                  />
                          </FormControl>
                          </>) : null }

                      
                        
                        {ShowTagAndLinkerPayloadInputToChildren ?
                        ( <>
                              {/* tag  */}
                              <br/>
                              <Box sx={{ mt:3, ml:6, mb: 3}} >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Typography>Tag before linker</Typography>
                                      <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} 
                                                onChange={handleTagLinkerOrderChange}/>
                                      <Typography>Tag after linker</Typography>
                                    </Stack>
                              </Box>

                              <FormControl sx={{ mt:1, ml:6, mb: 1, width: 300 }} dir="ltr">      
                                    <InputLabel id="demo-simple-select-autowidth-label">Select tag</InputLabel>
                                    <Select
                                      labelId="demo-simple-select-autowidth-label"
                                      id="demo-simple-select-autowidth"
                                      value={TagNameToChildren}
                                      onChange={handleTagChange}
                                      // autoWidth
                                      label="Select tag"
                                      // size="small"
                                    >
                                      <MenuItem value={"skip_tag"}>&lt;empty tag&gt;</MenuItem>
                                      <MenuItem value={"mNG11"}>mNG11</MenuItem>
                                      <MenuItem value={"GFP11"}>GFP11</MenuItem>
                                      <MenuItem value={"6xHis-Tag"}>6x His-Tag</MenuItem>
                                      <MenuItem value={"HA"}>HA</MenuItem>
                                      <MenuItem value={"3xHA"}>3xHA</MenuItem>
                                      <MenuItem value={"c-Myc"}>c-Myc</MenuItem>
                                      <MenuItem value={"Streptavidin"}>Streptavidin</MenuItem>
                                      <MenuItem value={"Flag"}>Flag</MenuItem>
                                      <MenuItem value={"GFP"}>GFP</MenuItem>
                                      <MenuItem value={"eGFP"}>eGFP</MenuItem>
                                      <MenuItem value={"mNeonGreen"}>mNeonGreen</MenuItem>
                                      <MenuItem value={"mCherry"}>mCherry</MenuItem>
                                      {/* <MenuItem value={"Custom"}>Custom</MenuItem> */}
                                    </Select>
                                  </FormControl>
                                  <br/>
                                  <FormControl  sx={{width:"95%", maxWidth: 570, mt:1, mb:1, ml:6 }} dir="ltr">
                                        <TextField 
                                            // required          
                                            multiline
                                            rows={4} 
                                            // defaultValue=""
                                            value = {TagSeqToChildren}
                                            id="outlined-basic" 
                                            label="Tag sequence" 
                                            placeholder="Enter custom&#10;tag sequence"
                                            variant="outlined"
                                            onChange={HandleTagSeqChange}
                                            />
                                    </FormControl>


                                  {/* linker  */}
                                  <FormControl sx={{ mt:1, ml:6, mb: 1, width: 300 }} dir="ltr">
                                  
                                    <InputLabel id="demo-simple-select-autowidth-label">Select linker</InputLabel>
                                    <Select
                                      labelId="demo-simple-select-autowidth-label"
                                      id="demo-simple-select-autowidth"
                                      value={LinkerNameToChildren}
                                      onChange={handleLinkerChange}
                                      // autoWidth
                                      label="Select linker"
                                      // size="small"
                                    >
                                      <MenuItem value={"skip_linker"}>&lt;empty linker&gt;</MenuItem>
                                      <MenuItem value={"HRV_3C_cleavable_linker"}>HRV 3C cleavable linker</MenuItem>
                                      <MenuItem value={"XTEN80"}>XTEN80</MenuItem>
                                      <MenuItem value={"XTEN"}>XTEN</MenuItem>
                                      <MenuItem value={"GGGS3"}>(GGGS)3</MenuItem>
                                      <MenuItem value={"GGGGS2"}>(GGGGS)2</MenuItem>
                                      <MenuItem value={"PL_rigid"}>PL_rigid (EAAAR)4</MenuItem>

                                      {/* <MenuItem value={"Custom"}>Custom</MenuItem> */}
                                    </Select>
                                  </FormControl>

                                  <FormControl  sx={{width:"95%", maxWidth: 570, mt:1, mb:1, ml:6, }} dir="ltr">
                                        <TextField 
                                            // required          
                                            multiline
                                            rows={4} 
                                            // defaultValue=""
                                            id="outlined-basic" 
                                            label="Linker sequence" 
                                            placeholder="Enter custom&#10;linker sequence"
                                            variant="outlined"
                                            value = {LinkerSeqToChildren}
                                            // helperText=""
                                            onChange={HandleLinkerSeqChange}
                                            />
                                    </FormControl>
                          </>) : null }

                        {/* <FormControl  sx={{width: 370 }} dir="ltr">
                        <Accordion expanded={expanded === 'morePayloadParamAccordion'} onChange={handleAccordionChange('morePayloadParamAccordion')}>
                          <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                          <Typography  variant="body2">Advanced options</Typography>
                          </AccordionSummary>
                          
                          <AccordionDetails>
                                  
                          </AccordionDetails>
                        </Accordion>
                        </FormControl> */}

                        </Box>
                </Box>




                {/* Additional settings */}

                <Box sx={{ mt:1, ml: 1 , mb: 1, mr:2, width:"100%",}} >
                  <Button variant="text" onClick={handleShowAdditionalSettingsChange}> {ShowAdditionalSettingsButtonLabel} </Button>
                </Box>

                {ShowAdditionalSettings ?
                ( <>

                  <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} >

                      {/* HA length */}
                      <Box sx={{ mt:1, ml: 2, mb: 1, mr:1, pl:2, pt:2, minWidth: 350,boxShadow:5, bgcolor: '#edf4f7'}} >
                      <Box >
                          <Typography nowrap = "true" variant="subtitle1" align="left" gutterBottom="true">
                            Donor length parameters
                          </Typography>
                          
                          <FormControl sx={{ mt:0, ml:1, mb: 0 }} dir="ltr">
                        
                              {/* Desired homology arm length */}
                              <> 
                                  <Box sx={{mt:1}}>
                                  <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
                                  <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/> Homology arm length to consider
                                  <Tooltip title={<p> The length of homology arm extracted for *each* arm before further processing.<br/><br/> Processing details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#dna-donor-processing-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}> 
                                                            <IconButton>
                                                              <HelpOutlineIcon fontSize="small"/>
                                                  </IconButton>
                                  </Tooltip>
                                  </Typography>
                                  </Box>

                                  <Grid sx={{ml:0.5, pt:2, pl: 2, mb:0}} container spacing={5} alignItems="center">

                                        <Grid item >
                                            <Slider sx={{ width: 120 }} 
                                                      value={HAlenToChildren}
                                                      onChange={handleHAlenChange()}
                                                      aria-labelledby="input-slider"
                                                      step={10}
                                                      marks={armLenMarks}
                                                      min={50}
                                                      max={1000}
                                                    />
                                        </Grid> 

                                        <Grid item xs>
                                            <TextField 
                                              sx={{width: 60 }}
                                              required          
                                              rows={1} 
                                              id="outlined-basic" 
                                              variant="standard"
                                              size="small"
                                              InputProps={{endAdornment: <InputAdornment position="end">bp</InputAdornment>,}}
                                              value = {HAlenToChildren}
                                              onChange={handleHAlenChange()}
                                              />
                                            </Grid>
                                    </Grid>
                                </>

                                {/* Maximum donor length */}
                                <>
                                    <Typography nowrap = "true" variant="body" align="left" gutterBottom="true" sx={{ml:0}}>
                                    <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/> Maximum ssODN length 
                                      {/* <Checkbox
                                          checked={EnforceMaxDonLenToChildren}
                                          onChange={handleEnforceMaxDonLen}
                                          inputProps={{ 'aria-label': 'controlled' }}
                                          label="Enforce maximum donor size"
                                          /> */}
                                          
                                          <Tooltip sx={{mt:0, ml:0}} title={<p> This option is for ssODN donor only<br/><br/>Imposing a maximum ssODN length will trim the ssODN on both ends and ensuring that the donor will be centered on non-homology region. The non-homology region is usually payload + recoded region(s).<br/><br/> More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#dna-donor-processing-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}> 
                                                            <IconButton>
                                                              <HelpOutlineIcon fontSize="small"/>
                                                  </IconButton>
                                          </Tooltip> 
                                    </Typography>

                                    {/* <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
                                    &nbsp;&nbsp;&nbsp;&nbsp;Maximum donor length
                                    </Typography> */}

                                    <Grid sx={{pl: 5}} container spacing={5} alignItems="center">

                                          <Grid item >
                                                  <Slider sx={{ width: 120 }} 
                                                  value={MaxDonLenToChildren}
                                                  onChange={handleMaxDonLenChange()}
                                                  aria-labelledby="input-slider"
                                                  step={10}
                                                  marks={maxSizeMarks}
                                                  min={50}
                                                  max={400}
                                                  disabled={!EnforceMaxDonLenToChildren}
                                                />
                                          </Grid> 

                                          <Grid item xs>
                                                      <TextField 
                                                  sx={{width: 60 }}
                                                  required          
                                                  rows={1} 
                                                  id="outlined-basic" 
                                                  variant="standard"
                                                  size="small"
                                                  InputProps={{endAdornment: <InputAdornment  position="end">bp</InputAdornment>,}}
                                                  value = {MaxDonLenToChildren}
                                                  onChange={handleMaxDonLenChange()}
                                                  disabled={!EnforceMaxDonLenToChildren}
                                                  />
                                            </Grid>
                                            
                                    </Grid>
                                </>


                            </FormControl>
                      </Box>
                      </Box>

                      {/* recode intensity */}
                      <Box sx={{ mt:1, ml: 2, mb: 1, mr:1, pl:2, pt:2, minWidth: 360,  boxShadow:5, bgcolor: '#edf4f7',}} dir="ltr" >
                            <Box>
                                    <Typography nowrap = "true" variant="subtitle1" align="left" gutterBottom="true">
                                      Donor recoding parameters
                                    </Typography>

                                      <FormControl sx={{ mt:0, ml:1, mb: 2 }} dir="ltr">

                                      {/* Donor recoding parameters */}
                                      <>                                      
                                                <Box sx={{mt:1, mb:-1}}>
                                                    <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
                                                    <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/> Recoding intensity 
                                                      <CustomWidthTooltip title={<p>Introduce synonmous changes to the donor DNA to:<br/>(1) Prevent donor and the repaired loci from being cut again.<br/>(2) Facilitate donor integration.<br/> Full = (1) + (2)<br/>Prevent recut = (1)<br/><br/>More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#recoding-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>} 
                                                      
                                                      > 
                                                                <IconButton>
                                                                  <HelpOutlineIcon fontSize="small"/>
                                                                </IconButton>
                                                      </CustomWidthTooltip>
                                                    </Typography>
                                                </Box>

                                                <RadioGroup
                                                  aria-labelledby="demo-radio-buttons-group-label"
                                                  // defaultValue="recoding_all"
                                                  name="radio-buttons-group"
                                                  value={recodeIntensityToChildren}
                                                  onChange={handleRecodeIntensityChange}
                                                  size="small" 
                                                  sx={{mt:0, ml:4, mb: 0 }}
                                                >
                                                  <FormControlLabel value="full" control={<BpRadio  />} label={
                                                    <p> Full
                                                      <Tooltip title={<p>Recode both the gRNA sequence and sequence between the gRNA cut site and the edit site<br/><br/>More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#recoding-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}> 
                                                            <IconButton>
                                                              <HelpOutlineIcon fontSize="small"/>
                                                            </IconButton>
                                                      </Tooltip>
                                                    </p>}
                                                  />   

                                                  <FormControlLabel value="stop_recut_only" control={<BpRadio  />} label={
                                                    <p> Prevent recut
                                                      <Tooltip title={<p>Recode only the gRNA sequence to prevent recut<br/><br/>More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#recoding-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}> 
                                                            <IconButton>
                                                              <HelpOutlineIcon fontSize="small" />
                                                            </IconButton>
                                                      </Tooltip>
                                                    </p>}
                                                  />
                                                  <FormControlLabel value="off" control={<BpRadio  />} label="None" />
                                                </RadioGroup>
                                        </>
                                      
                                      {/* recode only in coding region */}
                                      <>
                                      <Box sx={{mt:1, mb:-1}}>
                                                    <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
                                                    <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/> 
                                                    <Checkbox sx={{ml:-1}}
                                                            checked = {RecodeOnlyInCodingRegionToChildren}
                                                            onChange = {HandleRecodeOnlyInCodingRegionChange} />
                                                    Recode only in coding region 
                                                      <CustomWidthTooltip title={<p>Limit recoding activity to introducing synonmous codon changes to protein coding sequence</p>} 
                                                      
                                                      > 
                                                                <IconButton>
                                                                  <HelpOutlineIcon fontSize="small"/>
                                                                </IconButton>
                                                      </CustomWidthTooltip>
                                                    </Typography>
                                                </Box>


                                      </>

                                      {/* Recut cfd threshold */}
                                      <> 
                                              <Typography nowrap = "true" variant="body" align="left" gutterBottom="true">
                                              <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/> Recut potential threshold
                                                                                                <Tooltip sx={{mt:0, ml:0}} title={<p>This option is in effect only if the recoding intensity is set to "Full" or "Prevent recut", protoSpaceJAM will attempt to lower the recut potential to this threshold.<br/> 
                                                                                                <br/>The default threshold is 0.03, which means that any CFD values lower than the threshold will be considered not suceptible to being recut anymore, and protoSpaceJAM will stop recoding immediately once this threshold is reached<br/>
                                                                                                <br/>The recut potential is measured by CFD score comparing the gRNA sequence in the genome to that in the donor. Recut potential ranges from 0 to 1, and 1 means perfect match, thus it is highly likely to result in recutting of the repaired genome.</p>}> 
                                                                                                      <IconButton>
                                                                                                        <HelpOutlineIcon fontSize="small"/>
                                                                                                      </IconButton>
                                                                                                </Tooltip>
                                              </Typography>
                                                    <Box >
                                                          <FormControl sx={{ mt:-2, ml:3, mb: 1 }} dir="ltr">
                                                                                                                                      
                                                                                        <Grid sx={{mt:0, ml:-2}} container spacing={5} alignItems="center">
                                                                                          <Grid item >
                                                                                              <Slider sx={{ width: 120 }} 
                                                                                                        value={cfdThresToChildren}
                                                                                                        onChange={handlecfdThresChange()}
                                                                                                        aria-labelledby="input-slider"
                                                                                                        step={0.01}
                                                                                                        marks={cfdMarks}
                                                                                                        min={0}
                                                                                                        max={0.2}
                                                                                                      />
                                                                                          </Grid> 

                                                                                          <Grid item xs>
                                                                                              <TextField 
                                                                                                sx={{width: 40 }}
                                                                                                required          
                                                                                                rows={1} 
                                                                                                id="outlined-basic" 
                                                                                                variant="standard"
                                                                                                size="small"
                                                                                                value = {cfdThresToChildren}
                                                                                                onChange={handlecfdThresChange()}
                                                                                                />

                                                                                              </Grid>
                                                                                          </Grid>
                                                        </FormControl>
                                                        <br />
                                                      </Box>
                                      </>

                                  {/* Recut cfd threshold */}
                                  <>
                                        {/* {ShowMutateOrder ?
                                        ( <> */}
                                          <Typography>
                                          <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/> Prioritize recoding in :
                                              <Tooltip title={<p>Choose whether protoSpaceJAM should start recoding in PAM or the protospacer.<br/><br/>Recoding in PAM first will likely result in using less mutations to prevent recut, but increases the chance of the ssODN donor to be recut in a PAM-independent way.<br/><br/>More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#recoding-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}> 
                                                        <IconButton>
                                                          <HelpOutlineIcon fontSize="small"/>
                                                        </IconButton>
                                              </Tooltip>
                                          </Typography> 

                                          <Stack direction="row" spacing={1} alignItems="center" sx={{ml:2}}>
                                          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;PAM</Typography>
                                            <AntSwitch checked = {!MutateOrderPAMfirstToChildren} inputProps={{ 'aria-label': 'ant design' }} 
                                                      onChange={handleMutateOrderChange}
                                                      disabled={false} />
                                            <Typography>Protospacer</Typography>
                                          </Stack>
                                        {/* </>) : null } */}
                                  </>
                                </FormControl>

                            </Box>
                      </Box>

                      {/* DNA donor type */}
                      <Box sx={{ mt:1, ml: 2,  mb: 1, mr:1, minWidth: 350,  boxShadow:5, bgcolor: '#edf4f7',}} dir="ltr" >
                            <Box >
                                  <FormControl sx={{ mt:2, ml:3, mb: 2 }} dir="ltr">
                                  
                                  <Typography nowrap = "true" variant="subtitle1" align="left" gutterBottom="true">
                                  DNA donor type
                                  <Tooltip title={<p>Please select the desired type of DNA donors<br/>This choice affects many other parameters!<br/><br/>More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#dna-donor-processing-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}> 
                                              <IconButton>
                                                <NewReleasesIcon fontSize="medium"  style={{color: '#2CACE2'}}/>
                                              </IconButton>
                                   </Tooltip>
                                    {/* <CustomWidthTooltip title={<p>Introduce synonmous changes to the donor DNA to:<br/>(1) Prevent donor and the repaired loci from being cut again.<br/>(2) Facilitate donor integration.</p>}
                                    
                                    > 
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                    </CustomWidthTooltip> */}
                                  </Typography>

                                  <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label2"
                                    // defaultValue="recoding_all"
                                    name="radio-buttons-group2"
                                    value={DonorSSDSToChildren}
                                    onChange={handleDonorSSDSChange}
                                    size="small" 
                                    sx={{ml:2, mt:-1}}
                                  >
                                    <FormControlLabel value="ssODN" control={<BpRadio  />} label={
                                      <p>ssODN
                                        <Tooltip title={<p>This option will load optimize settings for single-stranded oligonucleotide (ssODN) donors:<br /><br/>(1) Set maximum donor length to 200bp.<br />(2) Automatically select the best strand to maximize HDR success rate (Other strand options are available).<br/><br/> Read more details here: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#dna-donor-processing-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}> 
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small"/>
                                              </IconButton>
                                        </Tooltip>
                                      </p>}
                                    />   

                                    <FormControlLabel value="dsDNA" control={<BpRadio  />} label={
                                      <p> dsDNA
                                        <Tooltip title={<p>This option will load optimized settings for double-stranded DNA (dsDNA) donors:<br /><br/>(1) Set homology arm length to 500bp.<br />(2) Check and trim (gBlock) synthesis constraints (e.g. presence of homopolyers).<br/> (3) Set minimum dsDNA homology arm length to 200 bp.<br/><br/> More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#dna-donor-processing-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}> 
                                              <IconButton>
                                                <HelpOutlineIcon fontSize="small" />
                                              </IconButton>
                                        </Tooltip>
                                      </p>}
                                    />
                                    
                                  </RadioGroup>
                                </FormControl>

                                <br />


                            </Box>
                      </Box>

                      {!ShowStrandselectionToChildren ?
                      ( <>
                                  {/* Donor trimming */}
                                  <Box sx={{ mt:1, ml: 2,  mb: 1, mr:1, minWidth: 360,  boxShadow:5, bgcolor: '#edf4f7',}} dir="ltr" >
                                        <Box >
                                              <FormControl sx={{ mt:2, ml:3, mb: 0 }} dir="ltr">

                                                  <Typography nowrap = "true" variant="subtitle1" align="left" gutterBottom="true">
                                                    Donor trimming (dsDNA)
                                                    <CustomWidthTooltip title={<p>Trim the dsDNA donor to remove problematic sequences such as homopolyer and restriction enzyme recognition sites.<br/><br/>
                                                                                  Both trimmed and untrimmed DNA donor will be included in the results
                                                                              </p>}
                                                    > 
                                                              <IconButton>
                                                                <HelpOutlineIcon fontSize="small"/>
                                                              </IconButton>
                                                    </CustomWidthTooltip>
                                                  </Typography>
                                               </FormControl>
                                              {/* Minimum dsDNA arm length */}
                                              <Box sx={{ ml:5, p: 0, pb: 0 ,width: 300 }} >
                                              <Typography  nowrap = "true" align="left" gutterBottom="true">
                                                      <p  sx={{mt:1, ml:0}} className="indent-second-line"><BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/>&nbsp;&nbsp;Stop trimming if homology arms become shorter than:
                                                                                  <Tooltip title={<p>This option is for dsDNA donor only.<br/><br/>Note that the length is for a homology arm on one side<br/><br/>
                                                                                                  ProtoSpaceJAM will stop trimming if the homology arm length falls below this length. Problematic sequences are homopolyers of length 8+ and sequences defined in the "Donor synthesis constraints" section.<br/><br/>
                                                                                                  Setting this parameter to 0 will disable trimming (problems will be flagged)
                                                                                                  <br/><br/> More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#dna-donor-processing-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a>
                                                                                                  </p>}> 
                                                                                        <IconButton>
                                                                                          <HelpOutlineIcon fontSize="small"/>
                                                                                        </IconButton>
                                                                                  </Tooltip>
                                                      </p>
                                                </Typography>
                                                </Box>

                                                <Box display="flex" alignItems="center" justifyContent="flex-start">
                                                <TextField 
                                                                            sx={{width: 60, ml:7, mb:1, mt:-1 }}
                                                                            rows={1} 
                                                                            value={MinArmLenPostTrimToChildren}
                                                                            // defaultValue=""
                                                                            id="outlined-basic" 
                                                                            size="small"
                                                                            variant="standard"
                                                                            InputProps={{endAdornment: <InputAdornment  position="end">bp</InputAdornment>,}}
                                                                            onChange={handleMinArmLenPostTrimChange}
                                                                            disabled={EnforceMaxDonLenToChildren}
                                                /> <FormHelperText sx={{ml:2, mb:1,pb:1}}>(set to 0 to disable trimming)</FormHelperText>
                                                </Box>
                                                
                                            {/* trim the following: */}
                                            <Box sx={{ ml:3, p: 0, pb: 0 ,width: 300 }} >
                                                <Typography sx={{mt:1, ml:0}} nowrap = "true" align="left" gutterBottom="true">
                                                <BuildIcon sx={{ color: '#28A6D1' }} fontSize="small"/>&nbsp;&nbsp;Trim the following:
                                                </Typography>
                                            </Box>


                                              <Typography sx={{mt:1, ml:3}} nowrap = "true" align="left" gutterBottom="true">
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                }}>
                                                    <ArrowRightAltIcon sx={{ color: '#28A6D1' }} fontSize="medium"/>
                                                    <span>Restriction enzyme recognition sites:</span>
                                                </div>  
                                              </Typography>
                                              <FormControl sx={{mt:0, ml: 6, width: 280 }}>
                                                        <InputLabel id="demo-multiple-name-label">Select restriction enzyme(s)</InputLabel>
                                                          <Select
                                                            labelId="demo-multiple-chip-label"
                                                            id="demo-multiple-chip"
                                                            multiple
                                                            value={SelectedEnzymeToChildren}
                                                            onChange={handleSelectedEnzymeChange}
                                                            input={<OutlinedInput id="select-multiple-chip" label="Select restriction enzyme(s)" />}
                                                            renderValue={(selected) => (
                                                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                {selected.map((value) => (
                                                                  <Chip key={value} label={value} />
                                                                ))}
                                                              </Box>
                                                            )}
                                                            MenuProps={MenuProps}
                                                          >
                                                          {EnzymeNames.map((name) => (
                                                            <MenuItem
                                                              key={name}
                                                              value={name}
                                                              style={getStyles(name, SelectedEnzymeToChildren, theme)}
                                                            >
                                                              {name}
                                                            </MenuItem>
                                                          ))}
                                                        </Select>
                                                        <FormHelperText>Click again to deselect</FormHelperText>
                                                </FormControl>

                                                <Typography sx={{mt:2, ml:3, mb:2}} nowrap = "true" align="left" gutterBottom="true">
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                }}>
                                                    <ArrowRightAltIcon sx={{ color: '#28A6D1' }} fontSize="medium"/>
                                                    <span>Homopolymeric runs of 10 or more As<br/>and Ts or 6 or more Gs and Cs </span>
                                                </div>  
                                                </Typography>

                                                <Typography sx={{mt:0, ml:3}} nowrap = "true" align="left" gutterBottom="true">
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                }}>
                                                    <ArrowRightAltIcon sx={{ color: '#28A6D1' }} fontSize="medium"/>
                                                    <span>Custom sequences:</span>
                                                </div>  
                                                </Typography>
                                                <FormControl  sx={{mt:0, ml: 6, mb:2, width: 280 }} dir="ltr">
                                                    <TextField 
                                                        multiline
                                                        rows={2} 
                                                        value={CustomSeq2AvoidToChildren}
                                                        // defaultValue=""
                                                        id="outlined-basic" 
                                                        label="Enter Sequence(s)"
                                                        placeholder=""
                                                        variant="outlined"
                                                        // helperText="or upload a file"
                                                        onChange={handleCustomSeq2AvoidChange}
                                                        />
                                                    <FormHelperText>Only ATCGatcg letters are allowed<br/>Use comma to separate sequences</FormHelperText>
                                                </FormControl>

                                        </Box>
                                  </Box>
                      </>) : null }
                      
                      {ShowStrandselectionToChildren ?
                                  ( <>
                                    {/*  strand selection options  */}
                                    <Box sx={{ mt:1, ml: 2,  mb: 1, mr:1, minWidth: 360,  boxShadow:5, bgcolor: '#edf4f7',}} dir="ltr" >
                                        <Box >
                                              <FormControl sx={{ mt:2, ml:3, mb: 2 }} dir="ltr">
                                              <Box sx={{mt:0, mb:-1}}>
                                                    <Typography nowrap = "true" variant="subtitle1" align="left" gutterBottom="true">
                                                    Donor strand selection (ssODN)
                                                      <CustomWidthTooltip title={<p>This option determines the how the strand is chosen for the single-stranded DNA donor<br/><br/> More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#dna-donor-processing-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a></p>}
                                                      
                                                      > 
                                                                <IconButton>
                                                                  <HelpOutlineIcon fontSize="small"/>
                                                                </IconButton>
                                                      </CustomWidthTooltip>
                                                    </Typography>
                                              </Box>

                                              {/* <Box sx={{ mt:-1, mb:0, ml:-1, width:"100%",}} >
                                                <Button variant="text" onClick={handleDonorStrandSelectionShowAllChange}> {DonorStrandSelectionShowAllChangeButtonLabel} </Button>
                                              </Box> */}
                                                                  <RadioGroup
                                                                                aria-labelledby="demo-radio-buttons-group-label3"
                                                                                // defaultValue="recoding_all"
                                                                                name="radio-buttons-group3"
                                                                                value={strandChoiceToChildren}
                                                                                onChange={handleStrandChoiceChange}
                                                                                size="small" 
                                                                                sx={{ml:2}}
                                                                              >
                                                                                <FormControlLabel value="auto" control={<BpRadio  />} label={
                                                                                  <p> Automatic
                                                                                    <Tooltip title={<p>The rules are as follows:<br />If the edit site is on the 5' side of the cut site, use the '+'' strand.<br/>If edit site is on the 3' side of the cut site, use the '-' strand<br/> More details: <a href="https://duopeng-protospacex-readthedocs.readthedocs.io/en/latest/algorithm.html#dna-donor-processing-strategy" target="_blank" rel="noopener noreferrer" style={{color: '#2CACE2'}}>here</a>  </p>}> 
                                                                                          <IconButton>
                                                                                            <HelpOutlineIcon fontSize="small"/>
                                                                                          </IconButton>
                                                                                    </Tooltip>
                                                                                  </p>}
                                                                                />  
                                                                                {/* {DonorStrandSelectionShowAll ?
                                                                                  ( <> */}
                                                                                              <FormControlLabel value="NonTargetStrand" control={<BpRadio  />} label={
                                                                                                <p>Non-target strand
                                                                                                  {/* <Tooltip title={<p>Optimize settings for double-stranded DNA donors:<br />(1) Set homology arm length to 500bp.<br />(2) Turn off maximum donor length<br />(3) Check (gBlock) synthesis constraints.</p>}> 
                                                                                                        <IconButton>
                                                                                                          <HelpOutlineIcon fontSize="small" />
                                                                                                        </IconButton>
                                                                                                  </Tooltip> */}
                                                                                                </p>}
                                                                                              />
                                                                                              <FormControlLabel value="TargetStrand" control={<BpRadio  />} label={
                                                                                                <p>Target strand
                                                                                                  {/* <Tooltip title={<p>Optimize settings for double-stranded DNA donors:<br />(1) Set homology arm length to 500bp.<br />(2) Turn off maximum donor length<br />(3) Check (gBlock) synthesis constraints.</p>}> 
                                                                                                        <IconButton>
                                                                                                          <HelpOutlineIcon fontSize="small" />
                                                                                                        </IconButton>
                                                                                                  </Tooltip> */}
                                                                                                </p>}
                                                                                              />
                                                                                              <FormControlLabel value="NonCodingStrand" control={<BpRadio  />} label={
                                                                                                <p>Non-coding strand
                                                                                                  {/* <Tooltip title={<p>Optimize settings for double-stranded DNA donors:<br />(1) Set homology arm length to 500bp.<br />(2) Turn off maximum donor length<br />(3) Check (gBlock) synthesis constraints.</p>}> 
                                                                                                        <IconButton>
                                                                                                          <HelpOutlineIcon fontSize="small" />
                                                                                                        </IconButton>
                                                                                                  </Tooltip> */}
                                                                                                </p>}
                                                                                              />

                                                                                              <FormControlLabel value="CodingStrand" control={<BpRadio  />} label={
                                                                                                <p>Coding strand
                                                                                                  {/* <Tooltip title={<p>Optimize settings for double-stranded DNA donors:<br />(1) Set homology arm length to 500bp.<br />(2) Turn off maximum donor length<br />(3) Check (gBlock) synthesis constraints.</p>}> 
                                                                                                        <IconButton>
                                                                                                          <HelpOutlineIcon fontSize="small" />
                                                                                                        </IconButton>
                                                                                                  </Tooltip> */}
                                                                                                </p>}
                                                                                              />

                                                                                    {/* </>) : null 
                                                                                    } */}
                                                                    </RadioGroup>

                                            </FormControl>


                                            <br />


                                            </Box>
                                        </Box>
                                    </>) : null 
                                    }

                </Box>
                </>) : null }

        </Box>
    </Card>
  );
}
AppDNAdonor.propTypes = {
  HAlenToParent: PropTypes.func,
  recodeIntensityToParent: PropTypes.func,
  DonorSSDStoParent: PropTypes.func,
  enforceMaxDonLenToParent: PropTypes.func,
  MaxDonLenToParent: PropTypes.func,
  TagToParent: PropTypes.func,
  LinkerToParent: PropTypes.func,
  PayloadModeToParent: PropTypes.func,
  StrandChoiceToParent: PropTypes.func,
  tagLinkerOrderToParent: PropTypes.func,
  NpayloadToParent: PropTypes.func,
  CpayloadToParent: PropTypes.func,
  PosPayloadToParent: PropTypes.func,
  PayloadSeqtoParent: PropTypes.func,
  ShowStrandselectionToParent: PropTypes.func,
  MutateOrderChangeToParent: PropTypes.func,
  ShowMutateOrder: PropTypes.bool,
  ShowStrandselection: PropTypes.bool,
  ShowOnePayloadInput: PropTypes.bool,
  ShowTwoPayloadInput: PropTypes.bool,
  ShowTagAndLinkerPayloadInput: PropTypes.bool,
  EnforceMaxDonLenToChildren: PropTypes.bool,
  NpayloadToChildren: PropTypes.string,
  CpayloadToChildren: PropTypes.string,
  PosPayloadToChildren: PropTypes.string,
  DonorSSDS: PropTypes.string,
  PayloadMode: PropTypes.string,
  MaxDonLen: PropTypes.number,
  
};