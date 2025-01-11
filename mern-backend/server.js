// Backend: MERN Stack Coding Challenge Solution

// 1. Import required modules
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// 2. Initialize the app
const app = express();
app.use(express.json());
app.use(cors());

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// 4. Define Mongoose Schema
const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    category: String,
    sold: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);


// Enable CORS for all routes
app.use(cors());

// Example route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
app.listen(5001, () => {
  console.log('Server is running on http://localhost:5001');
});


// 5. API to initialize the database
app.get('/api/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.deleteMany({});
        await Transaction.insertMany(response.data);
        res.status(200).json({ message: 'Database initialized with seed data.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. API to list all transactions with search and pagination
app.get('/api/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const query = {
        $expr: {
            $eq: [{ $month: "$dateOfSale" }, new Date(`${month} 1, 2000`).getMonth() + 1]
        },
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ]
    };

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. API for statistics
app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;
    try {
        const data = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, new Date(`${month} 1, 2000`).getMonth() + 1]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSale: { $sum: { $cond: ['$sold', "$price", 0] } },
                    soldItems: { $sum: { $cond: ['$sold', 1, 0] } },
                    unsoldItems: { $sum: { $cond: ['$sold', 0, 1] } }
                }
            }
        ]);
        res.status(200).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. API for bar chart
app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;
    const ranges = [
        [0, 100], [101, 200], [201, 300], [301, 400], [401, 500],
        [501, 600], [601, 700], [701, 800], [801, 900], [901, Infinity]
    ];

    try {
        const data = await Promise.all(ranges.map(async ([min, max]) => {
            const count = await Transaction.countDocuments({
                price: { $gte: min, $lt: max },
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, new Date(`${month} 1, 2000`).getMonth() + 1]
                }
            });
            return { range: `${min}-${max === Infinity ? 'above' : max}`, count };
        }));
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. API for pie chart
app.get('/api/pie-chart', async (req, res) => {
    const { month } = req.query;
    try {
        const data = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, new Date(`${month} 1, 2000`).getMonth() + 1]
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. Combined API
app.get('/api/combined', async (req, res) => {
    const { month } = req.query;
    try {
        const [stats, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:5001/api/statistics?month=${month}`),
            axios.get(`http://localhost:5001/api/bar-chart?month=${month}`),
            axios.get(`http://localhost:5001/api/pie-chart?month=${month}`)
        ]);

        res.status(200).json({
            statistics: stats.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 11. Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
