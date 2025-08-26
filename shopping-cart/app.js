const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session for user cart
app.use(session({
    secret: 'cartSecret',
    resave: false,
    saveUninitialized: true
}));

// Load JSON data
let categories = JSON.parse(fs.readFileSync('./data/categories.json'));
let products = JSON.parse(fs.readFileSync('./data/products.json'));

// -------- ADMIN ROUTES --------
app.get('/admin', (req, res) => {
    res.render('admin/dashboard', { categories, products });
});

// Add category
app.get('/admin/add-category', (req, res) => {
    res.render('admin/add-category', { categories });
});
app.post('/admin/add-category', (req, res) => {
    const { name, parent } = req.body;
    const id = Date.now();
    categories.push({ id, name, parent: parent || null });
    fs.writeFileSync('./data/categories.json', JSON.stringify(categories, null, 2));
    res.redirect('/admin');
});

// Add product
app.get('/admin/add-product', (req, res) => {
    res.render('admin/add-product', { categories });
});
app.post('/admin/add-product', (req, res) => {
    const { name, price, category } = req.body;
    const id = Date.now();
    products.push({ id, name, price, category });
    fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
    res.redirect('/admin');
});

// -------- USER ROUTES --------
app.get('/', (req, res) => {
    res.render('user/index', { categories, products, cart: req.session.cart || [] });
});

// Add to cart
app.post('/add-to-cart', (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id == productId);
    if (!req.session.cart) req.session.cart = [];
    req.session.cart.push(product);
    res.redirect('/');
});

// View cart
app.get('/cart', (req, res) => {
    res.render('user/cart', { cart: req.session.cart || [] });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
