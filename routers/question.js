const express = require("express");
const answers = require("./answer");
const Question = require("../models/Question");
const { 
    getAllQuestions,
    askNewQuestion,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
         } = require("../controllers/question");
const { getAccessToRoute,getQuestionOwnerAccess } = require("../middlewares/authorization/auth");
const { checkQuestionExist } = require("../middlewares/database/databaseErrorHelpers");
const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleware");
const answerQueryMiddleware = require("../middlewares/query/answerQueryMiddleware");

const router = express.Router();

router.get("/",questionQueryMiddleware(Question,{
    population: { 
        path: "user",
        select: "name profile_image"
}
}),getAllQuestions);
router.get("/:id/like",[getAccessToRoute,checkQuestionExist],likeQuestion);
router.get("/:id/undo_like",[getAccessToRoute,checkQuestionExist],undoLikeQuestion);
router.get("/:id",checkQuestionExist,answerQueryMiddleware(Question,{
    population: [
        {
            path: "user",
            select: "name profil_image"
        },
        {
            path: "answers",
            select: "content"
        }
    ]
}),getSingleQuestion);
router.post("/ask",getAccessToRoute,askNewQuestion);
router.put(
    "/:id/edit",
    [getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],
    editQuestion);
router.delete(
    "/:id/delete",
    [getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],
    deleteQuestion);


router.use("/:question_id/answers",checkQuestionExist,answers);


module.exports = router;