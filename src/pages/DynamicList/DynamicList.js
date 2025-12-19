import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { useLocation } from 'react-router-dom';
import DataGridComponent from '../../components/DataGrid/DataGridComponent';
import { getStates } from '../../nest_api';

export default function DynamicList({ apiPath, title = 'List', columns = [], transform }) {
  const [tableData, setTableData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const location = useLocation();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = location.search ? location.search.replace(/^\?/, '') : '';
        const path = query ? `${apiPath}?${query}` : apiPath;
        const resultRaw = await getStates(path);
        const data = (resultRaw || []).map((item, index) => {
          try {
            return transform ? transform(item, index) : { id: item.id || index, ...item };
          } catch (err) {
            return { id: item.id || index, ...item };
          }
        });
        setTableData(data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiPath, location.search, transform]);

  const totalAmount = tableData.reduce((sum, row) => sum + (row.pendingTransactions || 0), 0);
  const totalInterest = tableData.reduce((sum, row) => sum + (row.interesetAmount || 0), 0);
  const grandTotal = totalAmount + totalInterest;

  return (
    <Card sx={{ maxWidth: '100%',pb:0 }}>
      <CardHeader
       sx={{ pb:0,mb:0}}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="list">
            {title?.charAt(0) || 'L'}
          </Avatar>
         
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={title}
      />

      <CardContent>
        {error && <Typography color="error">{error}</Typography>}
        <DataGridComponent tableData={tableData} columns={columns} loading={loading} />

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            background: '#fff',
            padding: 2,
            borderTop: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body1">💰 Total Amount: {totalAmount}</Typography>
          <Typography variant="body1">📈 Interest: {totalInterest}</Typography>
          <Typography variant="body1">🟢 Grand Total: {grandTotal}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
