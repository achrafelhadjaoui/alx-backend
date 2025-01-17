const express = require('express');
const redis = require('redis');
const app = express();
const port = 1245;

// Redis client setup
const client = redis.createClient();
client.on('error', (err) => {
	    console.error(`Redis connection error: ${err.message}`);
});


client.on('connect', () => {
	console.log('REDIS CONNECTED SUCEFULLY')
})

client.connect();

// Products data
const listProducts = [
	    { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
	    { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
	    { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
	    { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

// Helper functions
const getItemById = (id) => listProducts.find((item) => item.id === id);

const reserveStockById = async (itemId, stock) => {
	    try {
		            await client.set(`item.${itemId}`, stock);
		        } catch (err) {
				        console.error(`Error reserving stock: ${err.message}`);
				    }
};

const getCurrentReservedStockById = async (itemId) => {
	    try {
		            const stock = await client.get(`item.${itemId}`);
		            return stock ? parseInt(stock, 10) : null;
		        } catch (err) {
				        console.error(`Error getting reserved stock: ${err.message}`);
				        return null;
				    }
};

// Initialize stock in Redis
const initializeStockInRedis = async () => {
	    for (const product of listProducts) {
		            await reserveStockById(product.id, 0); // nitialize reserved stock to 0
		        }
};
initializeStockInRedis();

// Routes
app.get('/list_products', (req, res) => {
	    const products = listProducts.map((product) => ({
		            itemId: product.id,
		            itemName: product.name,
		            price: product.price,
		            initialAvailableQuantity: product.stock,
		        }));
	    res.json(products);
});

app.get('/list_products/:itemId', async (req, res) => {
	    const itemId = parseInt(req.params.itemId, 10);
	    const product = getItemById(itemId);

	    if (!product) {
		            return res.status(404).json({ status: 'Product not found' });
		        }

	    const reservedStock = await getCurrentReservedStockById(itemId);
	    const currentStock = product.stock - (reservedStock || 0);

	    res.json({
		            itemId: product.id,
		            itemName: product.name,
		            price: product.price,
		            initialAvailableQuantity: product.stock,
		            currentQuantity: currentStock,
		        });
});

app.get('/reserve_product/:itemId', async (req, res) => {
	    const itemId = parseInt(req.params.itemId, 10);

	    if (isNaN(itemId)) {
		            return res.status(400).json({ status: 'Invalid itemId' });
		        }

	    const product = getItemById(itemId);

	    if (!product) {
		            return res.status(404).json({ status: 'Product not found' });
		        }

	    const reservedStock = await getCurrentReservedStockById(itemId);
	    const availableStock = product.stock - (reservedStock || 0);

	    if (availableStock <= 0) {
		            return res.json({ status: 'Not enough stock available', itemId });
		        }

	    await reserveStockById(itemId, (reservedStock || 0) + 1);
	    res.json({ status: 'Reservation confirmed', itemId });
});

// Start server
app.listen(port, () => {
	    console.log(`Server is running on port: ${port}`);
});

