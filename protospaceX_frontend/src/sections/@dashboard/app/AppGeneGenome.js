import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import * as React from 'react';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppGeneGenome.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  // chartData: PropTypes.array.isRequired,
  // chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppGeneGenome({ title, subheader,GenomeToParent,GenesToParent,parentToChildGenes, parentToChildGenome,  ...other }) {
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

    const CustomWidthTooltip = styled(({ className, ...props }) => (
      <Tooltip {...props} classes={{ popper: className }} />
    ))({
      [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 380,
      },
    });

    // Genome selection
    const [Genome, setGenome] = React.useState('GRCh38');
    const handleGenomeChange = (event: SelectChangeEvent) => {
      setGenome(event.target.value);
      GenomeToParent(event.target.value)
    };

    // input genes
    const [Genes, setGenes] = React.useState('');
    const handleGenesChange = (event) => {
      GenesToParent(event.target.value);
      // GenesToParent(event.target.value)
    };

  return (
    <Card variant="outlined" {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mt:3, ml:3, mb: 2, minWidth: 200, display: 'flex', flexDirection: 'row'}}>
      <FormControl  sx={{minWidth: 300 }} dir="ltr">
        <InputLabel id="Genome">Genome</InputLabel>
        <Select
          labelId="Genome"
          id="Genome"
          value={parentToChildGenome}
          onChange={handleGenomeChange}
          // autoWidth
          label="Genome"
        >
          <MenuItem value={"GRCh38"}>Human &nbsp; <font style={{color:'grey', fontSize:"12px"}}>GRCh38 Ensembl</font></MenuItem>
          <MenuItem value={"GRCm39"}>Mouse &nbsp; <font style={{color:'grey', fontSize:"12px"}}>GRCm39 Ensembl</font></MenuItem>
          <MenuItem value={"GRCz11"}>Zebrafish &nbsp; <font style={{color:'grey', fontSize:"12px"}}>GRCz11 Ensembl</font></MenuItem>
        </Select>
        <FormHelperText>&nbsp;&nbsp;&nbsp;&nbsp;* Required</FormHelperText>
      </FormControl>
      
      </Box>


      <Box sx={{ mt:2, ml:3, mb: 3, minWidth: 300 , display: 'flex', flexDirection: 'row'}} autoComplete="off">
            <FormControl  sx={{width: 300 }} dir="ltr">
                <TextField 
                    required          
                    multiline
                    rows={5} 
                    value={parentToChildGenes}
                    // defaultValue=""
                    id="outlined-basic" 
                    label="Ensembl transcript ID, terminus or chr:position" 
                    placeholder="ENST00000489081,N&#10;ENST00000453996,C&#10;ENST00000410067,N&#10;ENST00000305321,16:30193791&#10;"
                    variant="outlined"
                    // helperText="or upload a file"
                    onChange={handleGenesChange}
                    />
                <FormHelperText>&nbsp;&nbsp;&nbsp;&nbsp;* Required <br/>
                
                {/* <CustomWidthTooltip  title={<span><p>To apply custom offsets to terminus (e.g. two codons after ATG), following these steps:</p>
                <p>(1) Run the prediction with desired terminus, and download both the submission and the result csv files</p>
                (2) In the results csv file, locate the 'edit_pos' column (genomic coordinate of the desired terminus) and apply desired offsets.<br/>
                (3) Copy the 'edit_pos' (edited) and 'chr' columns to replace the "Coordinate" and "Chromosome" columns respectively in the submission csv file.<br/>
                (4) Clear the contents of the "Terminus" column in the submission csv file, and upload the submission spreadsheet in a new prediction request.<br/>
                </span>}> 
                <IconButton>
                  <InfoOutlinedIcon fontSize="small"/>
                </IconButton>
                </CustomWidthTooltip>Terminus offsets  */}

                </FormHelperText>

            </FormControl>

            {/* <Stack spacing={1} direction="row"  sx={{ mt:1}}  >

                <Button variant="contained" size="small" component="label" endIcon={<DriveFolderUploadIcon />} sx={{ textTransform: 'none' }}>
                  Upload .csv
                  <input hidden accept=".csv" multiple type="file" />
                </Button>

            </Stack> */}
    </Box>





    </Card>
  );
}
