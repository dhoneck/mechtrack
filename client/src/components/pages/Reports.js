import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';

import {useState} from 'react';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

import NavBar from '../layout/NavBar';
import './Reports.css';
import {Link} from "react-router-dom";

/** Card template to store different steps in the report creation process  **/
function ReportCard({ title, content }) {
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

export default function Reports() {
  // Store report type
  const [selectedReport, setSelectedReport] = useState('Sales Breakdown');

  // Store report date range
  const [selectedDateRange, setSelectedDateRange] = useState('This month');
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);

  // Store report file type
  const [selectedOutput, setSelectOutput] = useState('PDF');

  // Store whether the date range step displays
  const [hideDateRangeStep, setHideDateRangeStep] = useState(false);

  // Store the output step's title as it varies depending on if date range step is displayed
  const [outputStepTitle, setOutputStepTitle] = useState('Step #3 - Pick Output');

  // Adjust variables when the report type changes
  const handleReportChange = (event) => {
    let newReport = event.target.value;
    console.log(`Report change: ${newReport}`);
    setSelectedReport(newReport);

    // Store whether date range step should be hidden and what the output step should be titled
    if (newReport == 'Sales Breakdown') {  // Do not hide date range step and update output step title
      setHideDateRangeStep(false);
      setOutputStepTitle('Step #3 - Pick Output');
    } else {  // Hide date range step and update output step title
      setHideDateRangeStep(true);
      setOutputStepTitle('Step #2 - Pick Output')
    }
  };

  // Adjust variables when the date range changes
  const handleDateRangeChange = (newDate, source) => {
    if (source === 'predefinedRange') {
      console.log(newDate.target.value);
      setSelectedDateRange(newDate.target.value);
    } else if (source === 'startDate') {
      console.log(newDate);
      setSelectedDateStart(newDate);
    } else if (source === 'endDate') {
      console.log(newDate);
      setSelectedDateEnd(newDate);
    }
  };

  // Adjust variables when the file type changes
  const handleOutputChange = (event) => {
    console.log(`Output change: ${event.target.value}`);
    setSelectOutput(event.target.value);
  };

  // Attempts to generate a report based on user input
  const executeReport = async () => {
    console.log('Executing the report...');
    const reportValues = {
      'report': selectedReport,
      'dateRange': selectedDateRange,
      'dateStart': selectedDateStart,
      'dateEnd': selectedDateEnd,
      'output': selectedOutput,
    }

    // Handle sales breakdown report
    // TODO: Make Axios call to get sales info

    // Handle export report
    let url = 'http://localhost:8000/api/export/'
    if (reportValues.report === 'Customer Export') {
      url += 'customers/';
    } else if (reportValues.report === 'Vehicle Export') {
      url += 'vehicles/';
    } else if (reportValues.report === 'Service Export') {
      url += 'services/';
    }

    if (reportValues.output === 'PDF') {
      url += 'pdf/'
    } else if (reportValues.output === 'CSV') {
      url += 'csv/'
    }
    window.location.href = url;
  }

  // Date ranges for reports
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

  /** Content for report type step **/
  const pickReport = (
    <>
      <FormControl>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          value={selectedReport}
          onChange={handleReportChange}
          name='radio-buttons-group'
        >
          <FormControlLabel
            value='Sales Breakdown'
            control={<Radio size='small' />}
            label='Sales Breakdown'
          />
          <FormControlLabel
            value='Customer Export'
            control={<Radio size='small' />}
            label='Customer Export'
          />
          <FormControlLabel
            value='Vehicle Export'
            control={<Radio size='small' />}
            label='Vehicle Export'
          />
          <FormControlLabel
            value='Service Export'
            control={<Radio size='small' />}
            label='Service Export'
          />
        </RadioGroup>
      </FormControl>
    </>
  );

  /** Content for date range step **/
  const pickDateRange = (
    <Box sx={{ display:'flex', justifyContent:'space-between', gap:'15px' }}>
      <Box>
        <Typography>Predefined Range</Typography>
        <FormControl sx={{ my:'10px', display:'block' }}>
          <Select
            value={selectedDateRange}
            onChange={(newDate) => handleDateRangeChange(newDate, 'predefinedRange')}
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
          <DatePicker
            label="Start Date"
            value={selectedDateStart}
            onChange={(newDate) => handleDateRangeChange(newDate, 'startDate')}
            sx={{ my:'10px', display:'block' }}
          />
          <DatePicker
            label="End Date"
            value={selectedDateEnd}
            onChange={(newDate) => handleDateRangeChange(newDate, 'endDate')}
            sx={{ my:'10px', display:'block' }}
          />
        </LocalizationProvider>
      </Box>
    </Box>
  );

  /** Content for file type step **/
  const pickOutput = (
  <>
      <FormControl>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          defaultValue='PDF'
          value={selectedOutput}
          onChange={handleOutputChange}
          name='radio-buttons-group'
        >
          <FormControlLabel value='PDF' control={<Radio size='small' />} label='PDF' sx={{ marginBottom:'15px' }}/>
          <FormControlLabel value='CSV' control={<Radio size='small' />} label='CSV' sx={{ marginBottom:'15px' }}/>
        </RadioGroup>
        <Button
          variant='contained'
          sx={{ marginTop:'10px' }}
          onClick={executeReport}
        >
          Execute
        </Button>
      </FormControl>
    </>
  );

  return (
    <Box>
      <Typography variant='h2' align='center'>Reports</Typography>
      <NavBar active='Reports'/>
      <Box sx={{display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap'}}>
        <ReportCard title='Step #1 - Pick Report' content={pickReport}></ReportCard>
        {!hideDateRangeStep && <ReportCard title='Step #2 - Pick Date Range' content={pickDateRange}></ReportCard>}
        <ReportCard title={outputStepTitle} content={pickOutput}></ReportCard>
      </Box>
    </Box>
  );
}