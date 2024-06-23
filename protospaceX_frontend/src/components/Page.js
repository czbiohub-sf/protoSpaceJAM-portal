import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = 'protoSpaceJAM', meta, ...other }, ref) => (
  <>
    <Helmet>
      <title>{`protoSpaceJAM | CZ Biohub`}</title>
      {meta}
    </Helmet>

    <Box ref={ref} alignItems="center" justifyContent="center" sx={{m:"auto"}} {...other}>
      {children}
    </Box>
  </>
));

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
