const Question = require("../../models/Question");
const asyncErrorWrapper = require("express-async-handler");
const { searchHelper,populateHelper,questionSortHelper,paginateHelper } = require("./queryMiddlewareHelpers");

const questionQueryMiddleware = function(model,options){
    return asyncErrorWrapper(async(req,res,next) => {
        let query = model.find();

        // Searching
        query = searchHelper("title",query,req);
        // Population
        if(options && options.population){
            query = populateHelper(query,options.population);
        }
        // Sorting
        query = questionSortHelper(query,req);
        // Pagination
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

module.exports = questionQueryMiddleware;