const Question = require("../models/Question");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const getAllQuestions = asyncErrorWrapper(async(req,res,next) => {
    return res.status(200).json(res.queryResults);
});


const getSingleQuestion = asyncErrorWrapper(async(req,res,next) => {
    return res.status(200).json(res.queryResults);
});


const askNewQuestion = asyncErrorWrapper(async(req,res,next) => {
    const info = req.body;

    const question = await Question.create({
        ...info,
        user: req.user.id
    });

    res.status(200)
    .json({
        success: true,
        data: question
    });
});


const editQuestion = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;
    const {title,content} = req.body;
    let question = await Question.findById(id);

    question.title = title;
    question.content = content;
    question = await question.save();

    return res.status(200)
    .json({
        success: true,
        data: question
    });
});


const deleteQuestion = asyncErrorWrapper(async(req,res,next) => {
    const{id} = req.params;
    await Question.findByIdAndDelete(id);

    res.status(200)
    .json({
        success: true,
        message: "Question is successfully deleted"
    });
});


const likeQuestion = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;
    const question = await Question.findById(id);

    if(question.likes.includes(req.user.id)){
        return next(new CustomError("You already liked this question",400));
    }

    question.likes.push(req.user.id);
    question.likeCount = question.likes.length;
    await question.save();

    return res.status(200)
    .json({
        success: true,
        data: question
    });
});


const undoLikeQuestion = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;
    const question = await Question.findById(id);

    if(!question.likes.includes(req.user.id)){
        next(new CustomError("You can not undo like operation for this question.",400));
    }
    
    const index = question.likes.indexOf(req.user.id);

    question.likes.splice(index);
    question.likeCount = question.likes.length;
    await question.save();

    return res.status(200)
    .json({
        success: true,
        data: question
    });
});



module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
}