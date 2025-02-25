const ProductController = require('../controllers/product.controller');
const express = require('express');

const router = express.Router();

router.route('/').get(ProductController.getProducts);
router.route('/:pid').get(ProductController.getProduct);

module.exports = router;

