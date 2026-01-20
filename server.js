const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'items.json');

app.use(cors());
app.use(express.json());

// Helper function to read data
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data:", err);
        return [];
    }
};

// Helper function to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing data:", err);
    }
};

// GET /api/items - List all items
app.get('/api/items', (req, res) => {
    const items = readData();
    // Simulate network delay for realism if needed, but not required
    res.json(items);
});

// GET /api/items/:id - Get single item
app.get('/api/items/:id', (req, res) => {
    const items = readData();
    const item = items.find(i => i.id === parseInt(req.params.id));
    
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
});

// POST /api/items - Add new item
app.post('/api/items', (req, res) => {
    const { name, description, price, image } = req.body;
    
    if (!name || !description || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const items = readData();
    const newItem = {
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        name,
        description,
        price: parseFloat(price),
        image: image || 'https://via.placeholder.com/400' // Default image
    };

    items.push(newItem);
    writeData(items);

    res.status(201).json(newItem);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
