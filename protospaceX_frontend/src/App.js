// GA tracking
import TagManager from 'react-gtm-module'

// theme
// components
import {ThemeProvider as ThemeProviderCZB, NavBarAndFooterPlacer} from '@czb-ui/core';
import {Typography, Box } from '@mui/material';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
// import AlertTemplate from 'react-alert-template-basic'
// import InfoIcon from 'react-alert-template-basic/src/icons/InfoIcon'
// import SuccessIcon from 'react-alert-template-basic/src/icons/SuccessIcon'
// import ErrorIcon from 'react-alert-template-basic/src/icons/ErrorIcon'
// import CloseIcon from 'react-alert-template-basic/src/icons/CloseIcon'
import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import ThemeProvider from './theme';
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
// ----------------------------------------------------------------------
// routes
// import Router from './routes';
// deleted <ScrollToTop /> <BaseOptionChartStyle />
// deleted <Router />
import DashboardApp from './pages/DashboardApp';
import NavBar from './components/HeaderAndFooter/NavBar';
import Footer from './components/HeaderAndFooter/Footer';
// Import fonts at their various weights
// 400 is normal, 700 is bold
import "@fontsource/barlow/700.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";

// GA tracking
const tagManagerArgs = {
  gtmId: 'G-XXXXXXXXXX'
}
TagManager.initialize(tagManagerArgs)

// Alert configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 8000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.FADE
}

// The below is from  react-alert-template-basic
const BaseIcon = ({ color, pushRight = true, children }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    style={{ marginRight: pushRight ? '20px' : '0', minWidth: 24 }}
  >
    {children}
  </svg>
)

const CloseIcon = () => (
  <BaseIcon color='#FFFFFF' pushRight={false}>
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </BaseIcon>
)

const ErrorIcon = () => (
  <BaseIcon color='#FF0040'>
    <circle cx='12' cy='12' r='10' />
    <line x1='12' y1='8' x2='12' y2='12' />
    <line x1='12' y1='16' x2='12' y2='16' />
  </BaseIcon>
)

const InfoIcon = () => (
  <BaseIcon color='#2E9AFE'>
    <circle cx='12' cy='12' r='10' />
    <line x1='12' y1='16' x2='12' y2='12' />
    <line x1='12' y1='8' x2='12' y2='8' />
  </BaseIcon>
)

const SuccessIcon = () => (
  <BaseIcon color='#31B404'>
    <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
    <polyline points='22 4 12 14.01 9 11.01' />
  </BaseIcon>
)

const alertStyle = {
  backgroundColor: '#151515',
  color: 'white',
  padding: '10px',
  textTransform: 'uppercase',
  borderRadius: '3px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Arial',
  width: '450px',
  boxSizing: 'border-box'
}
const buttonStyle = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF'
}

const AlertTemplate = ({ message, options, style, close }) => {
  return (
    <div style={{ ...alertStyle, ...style }}>
      {options.type === 'info' && <InfoIcon />}
      {options.type === 'success' && <SuccessIcon />}
      {options.type === 'error' && <ErrorIcon />}
      <span style={{ flex: 2 }}>{message}</span>
      <button onClick={close} style={buttonStyle}>
        <CloseIcon />
      </button>
    </div>
  )
}  



export default function App({Component, pageProps}) {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <ThemeProviderCZB>
        <NavBarAndFooterPlacer topBar={<NavBar/>} bottomBar={<Footer/>}>
      
            <ThemeProvider>
            {/* <div style={{backgroundColor: '#edf7ff'}}> */}
                  {/* <DashboardLayout>  */}
                   {/* <DashboardApp {...pageProps} />  */}
                  {/* </DashboardLayout>  */}

                  {/* <Router /> */}
                  <DashboardApp />

                  {/* creates the padding before the footer */}
                  <Box sx = {{bm:5, bp:5}} > 
                    <Typography nowrap = "true" variant="subtitle1" align="center" gutterBottom="true" color="#edf4f7">
                      protoSpaceJAM
                    </Typography>
                  </Box>
              {/* </div> */}
            </ThemeProvider>
      
        </NavBarAndFooterPlacer>
      </ThemeProviderCZB>
    </AlertProvider>
  );
}
