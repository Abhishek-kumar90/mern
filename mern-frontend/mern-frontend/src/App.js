import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

function App() {
  const [month, setMonth] = useState('March');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [statistics, setStatistics] = useState({});
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchTransactions();
    fetchCombinedData();
  }, [month, page, search]); // UseEffect will trigger data fetching whenever month, page, or search changes

  // Highlighted section: Fetching transactions based on month, page, and search
  const fetchTransactions = async () => {
    const response = await axios.get(`http://localhost:5001/api/transactions`, {
      params: { month, page, search }
    });
    setTransactions(response.data);  // Update state with the fetched transactions
  };

  // Highlighted section: Fetching combined data (statistics, bar chart, and pie chart)
  const fetchCombinedData = async () => {
    const response = await axios.get(`http://localhost:5001/api/combined`, {
      params: { month }
    });
    setStatistics(response.data.statistics);  // Update state with fetched statistics
    setBarData(response.data.barChart);  // Update state with bar chart data
    setPieData(response.data.pieChart);  // Update state with pie chart data
  };

  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePrevPage = () => setPage(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col md={4}>
          <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search Transactions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <TransactionsTable transactions={transactions} />

      <Button onClick={handlePrevPage} disabled={page === 1}>Previous</Button>
      <Button onClick={handleNextPage} className="ms-2">Next</Button>

      <StatisticsBox statistics={statistics} />

      <Row className="mt-5">
        <Col md={6}><BarChart data={barData} /></Col>
        <Col md={6}><PieChart data={pieData} /></Col>
      </Row>
    </Container>
  );
}

export default App;
