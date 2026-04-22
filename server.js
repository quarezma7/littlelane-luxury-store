import express from 'express';
import productsHandler from './api/products.js';
import ordersHandler from './api/orders.js';
import usersHandler from './api/users.js';
import promosHandler from './api/promos.js';
import seedHandler from './api/seed.js';
import emailHandler from './api/email.js';

const app = express();

// Parse JSON bodies
app.use(express.json());

// Helper function to bridge Express and Vercel Serverless signature
const runHandler = (handler) => async (req, res) => {
  // Vercel serverless functions parse query string into req.query natively, express does too.
  await handler(req, res);
};

app.all('/api/products', runHandler(productsHandler));
app.all('/api/orders', runHandler(ordersHandler));
app.all('/api/users', runHandler(usersHandler));
app.all('/api/promos', runHandler(promosHandler));
app.all('/api/seed', runHandler(seedHandler));
app.all('/api/email', runHandler(emailHandler));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n==========================================`);
  console.log(`🚀 Local Database API running on port ${PORT}`);
  console.log(`==========================================\n`);
});
