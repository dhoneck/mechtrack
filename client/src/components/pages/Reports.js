import {
  Box,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import NavBar from '../layout/NavBar';
import './Reports.css';

function ReportCard({title, content}) {
  return (
    <Card variant='outlined' sx={{ borderRadius:'15px' }}>
      <CardContent>
        <Typography variant='h3' fontSize='22px'>
          {title}
        </Typography>
        <br />
        <Typography>
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
}

const pickReport = (
  <>
    <FormControl>
      <RadioGroup
        aria-labelledby='demo-radio-buttons-group-label'
        defaultValue='Sale'
        name='radio-buttons-group'
      >
        <FormControlLabel value='Sales Breakdown' control={<Radio size='small' />} label='Sales Breakdown' />
        <FormControlLabel value='Customer Export' control={<Radio size='small' />} label='Customer Export' />
        <FormControlLabel value='Vehicle Export' control={<Radio size='small' />} label='Vehicle Export' />
        <FormControlLabel value='Service Export' control={<Radio size='small' />} label='Service Export' />
      </RadioGroup>
    </FormControl>
  </>
);

const preDefinedRanges = [
  'This month',
  'This week',
  'This year',
  'Last week',
  'Last month',
  'Last year',
  'This year - Q1',
  'This year - Q2',
  'This year - Q3',
  'This year - Q4',
  'Last year - Q1',
  'Last year - Q2',
  'Last year - Q3',
  'Last year - Q4',
];

const pickDateRange = (
  <Box sx={{ display:'flex', justifyContent:'space-between', gap:'15px' }}>
    <Box>
      <Typography>Pre-Defined Range</Typography>
      <FormControl sx={{ my:'10px', display:'block' }}>
        <Select
          value={'This month'}
          // onChange={handleChange}
        >
          {preDefinedRanges.map((range, index) => (
            <MenuItem key={index} value={range}>{range}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    <Typography>OR</Typography>
    <Box>
      <Typography>Custom Range</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Start Date" sx={{ my:'10px', display:'block' }} />
        <DatePicker label="End Date" sx={{ my:'10px', display:'block' }} />
      </LocalizationProvider>
    </Box>
  </Box>
);

const pickOutput = (
<>
    <FormControl>
      <RadioGroup
        aria-labelledby='demo-radio-buttons-group-label'
        defaultValue='PDF'
        name='radio-buttons-group'
      >
        <FormControlLabel value='PDF' control={<Radio size='small' />} label='PDF' sx={{ marginBottom:'15px' }}/>
        <FormControlLabel value='CSV' control={<Radio size='small' />} label='CSV' sx={{ marginBottom:'15px' }}/>
      </RadioGroup>
      <Button variant='contained' sx={{ marginTop:'10px' }}>Execute</Button>
    </FormControl>
  </>
);

export default function Reports() {
  return (
    <Box>
      <Typography variant='h2' align='center'>Reports</Typography>
      <NavBar active='Reports' />
      <Box sx={{ display:'flex', justifyContent:'center', gap:'15px', flexWrap:'wrap' }}>
        <ReportCard title='Step #1 - Pick Report' content={pickReport}></ReportCard>
        <ReportCard title='Step #2 - Pick Date Range' content={pickDateRange}></ReportCard>
        <ReportCard title='Step #3 - Pick Output' content={pickOutput}></ReportCard>
      </Box>
    </Box>
  );
}