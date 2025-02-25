const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

const getProduct = asyncHandler(async(req, res) => {
    const  {pid} = req.params;
    const product = Product.findById(pid);
    return res.status(200).json({
      success: product ? true : false,
      data: product ? product : 'Không tìm thấy sản phẩm'
    });
  });

const getProducts = asyncHandler(async(req, res) => {
    const queries = {...req.query};
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el])

    // Định dạng lại các operatirs cho đúng cú pháp của moogose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const  formatQueries = JSON.parse(queryString);

    // Lọc
    let queryObject = {}
    if(queries?.q){
        delete formatQueries.q;
        queryObject = {
        $or: [
            {name: {$regex: queries.q, $options: 'i'}},
            {category: {$regex: queries.q, $options: 'i'}},
        ]
        }
    }
    const qr = {...formatQueries, ...queryObject};

    let queryCommand = Product.find(qr);

    //sắp xếp
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }
    // giới hạn
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    // phân trang
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    // thực thi
    const queryExecute = await queryCommand.exec();
    const counts = await Product.countDocuments(formatQueries);
    return res.status(200).json({
        success: queryExecute.length > 0,
        data: queryExecute,
        counts
    });
});
module.exports = {
    getProduct,
    getProducts
}  
  