import React from 'react';
import { Table } from 'react-bootstrap';

function TransactionsTable({ transactions }) {
  return (
    <>
      <h4>Transactions</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td>{tx.title}</td>
              <td>{tx.description}</td>
              <td>${tx.price}</td>
              <td>{new Date(tx.dateOfSale).toLocaleDateString()}</td>
              <td>{tx.category}</td>
              <td>{tx.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default TransactionsTable;
