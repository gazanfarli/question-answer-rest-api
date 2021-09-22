const asyncErrorWrapper = require("express-async-handler");
const {
    searchHelper,
    paginateHelper
} = require("./queryMiddlewareHelpers");


const userQueryMiddleware = function (model,options) {
    return asyncErrorWrapper(async(req,res,next) => {
        let query = model.find();
        // search by name
        query = searchHelper("name",query,req);
        // paginate
        const total = await model.countDocuments();
        const paginationResult = await paginateHelper(total,query,req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResults = await query;
        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        }

        next();
    });
}

module.exports = userQueryMiddleware;