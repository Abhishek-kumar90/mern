import React from 'react';
import { Row, Col } from 'react-bootstrap';

function StatisticsBox({ statistics }) {
  return (
    <Row className="mt-5">
      <Col md={4}>
        <h5>Total Sales: ${statistics.totalSale || 0}</h5>
        <h5>Sold Items: {statistics.soldItems || 0}</h5>
        <h5>Unsold Items: {statistics.unsoldItems || 0}</h5>
      </Col>
    </Row>
  );
}

export default StatisticsBox;
