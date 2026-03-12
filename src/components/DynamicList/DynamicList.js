import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import { AppBar, Toolbar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';
import DataGridComponent from '../../components/DataGrid/DataGridComponent';
import { getApiCall } from '../../nest_api';

export default function DynamicList({ apiPath, title = 'List', columns = [], transform, isTrader = false }) {
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
        const resultRaw = await getApiCall(path);
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
  const totalAmount = tableData.reduce((sum, row) => {
    const amount = Number(row.pendingTransactions) || 0;
    return row.pndTnxType === 'credit' ? sum + amount : sum - amount;
  }, 0);
  const traderGrandTotal = tableData.reduce((sum, row) => {
    const amount = Number(row.totalAmount) || 0;
    return sum + amount;
  }, 0);

  const pendingStock = tableData.reduce((sum, row) => {
    const amount = Number(row.quantity) || 0;
    return sum + amount;
  }, 0);
  const totalInterest = tableData.reduce((sum, row) => {
    const amount = Number(row.interesetAmount) || 0;
    return row.pndTnxType === 'credit' ? sum + amount : sum - amount;
  }, 0);

  const grandTotal = totalAmount + totalInterest;

  return (
    <Card sx={{ maxWidth: '100%', textTransform: 'capitalize' }}>
      <AppBar position="static">
        <Toolbar variant="dense"><Avatar sx={{ bgcolor: red[500], width: 32, height: 32 }} aria-label="list">
          {`${title?.charAt(0)}` || 'L'}
        </Avatar>&nbsp;
          <Typography variant="h6" sx={{ flexGrow: 1 }}>

            {title && `${title} list`}
          </Typography>


        </Toolbar>
      </AppBar>
      {/* <CardHeader
        sx={{ textTransform: 'capitalize' }}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="list">
            {`${title?.charAt(0)}` || 'L'}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`${title} list`}
      /> */}

      <CardContent>
        {error && <Typography color="error">{error}</Typography>}
        <DataGridComponent pageLink={title} tableData={tableData} columns={columns} loading={loading} />

        {isTrader ? <Box
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

          <Typography variant="body1">📈 Pending stock: {pendingStock}</Typography>
          <Typography variant="body1">💰 Grand Total: {traderGrandTotal}</Typography>
        </Box> : <Box
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
        </Box>}
      </CardContent>
    </Card>
  );
}
