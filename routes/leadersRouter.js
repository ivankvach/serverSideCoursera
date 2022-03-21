const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Leaders = require('../models/leaders');

const leadersRouter = express.Router();

leadersRouter.use(bodyParser.json());

leadersRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Leaders.find(req.query)
    .populate('comments.author')
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
        console.log(req.body);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('Leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

leadersRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Leaders.findById(req.params.dishId)
    .populate('comments.author')
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// leadersRouter.route('/:dishId/comments')
// .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// .get(cors.cors, (req,res,next) => {
//     Leaders.findById(req.params.dishId)
//     .populate('comments.authtor')
//     .then((leader) => {
//         if (leader != null) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(leader.comments);
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Leaders.findById(req.params.dishId)
//     .then((leader) => {
//         if (leader != null) {
//             req.body.author = req.user._id;
//             leader.comments.push(req.body);
//             leader.save()
//             .then((leader) => {
//                 leaders.findById(leader._id)
//                 .populate('comments.author')
//                 .then((leader) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(leader);
//                 }) 
//             }, (err) => next(err));
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /dishes/'
//         + req.params.dishId + '/comments');
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Leaders.findById(req.params.dishId)
//     .then((leader) => {
//         if (leader != null) {
//             for (var i = (leader.comments.length -1); i >= 0; i--) {
//                 leader.comments.id(leader.comments[i]._id).remove();
//             }
//             leader.save()
//             .then((leader) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(leader);                
//             }, (err) => next(err));
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));    
// });

// leadersRouter.route('/:dishId/comments/:commentId')
// .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// .get(cors.cors, (req,res,next) => {
//     Leaders.findById(req.params.dishId)
//     .populate('comments.author')
//     .then((leader) => {
//         if (leader != null && leader.comments.id(req.params.commentId) != null) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(leader.comments.id(req.params.commentId));
//         }
//         else if (leader == null) {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//         else {
//             err = new Error('Comment ' + req.params.commentId + ' not found');
//             err.status = 404;
//             return next(err);            
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /dishes/'+ req.params.dishId
//         + '/comments/' + req.params.commentId);
// })
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Leaders.findById(req.params.dishId)
//     .then((leader) => {
//         if (leader != null && leader.comments.id(req.params.commentId) != null) {
//             if (req.body.rating) {
//                 leader.comments.id(req.params.commentId).rating = req.body.rating;
//             }
//             if (req.body.comment) {
//                 leader.comments.id(req.params.commentId).comment = req.body.comment;                
//             }
//             leader.save()
//             .then((leader) => {
//                 Leaders.findById(leader._id)
//                 .populate('comments.author')
//                 .then((leader) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(leader); 
//                 })               
//             }, (err) => next(err));
//         }
//         else if (leader == null) {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//         else {
//             err = new Error('Comment ' + req.params.commentId + ' not found');
//             err.status = 404;
//             return next(err);            
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Leaders.findById(req.params.dishId)
//     .then((leader) => {
//         if (leader != null && leader.comments.id(req.params.commentId) != null) {
//             leader.comments.id(req.params.commentId).remove();
//             leader.save()
//             .then((leader) => {
//                 Leaders.findById(dish._id)
//                 .populate('comments.author')
//                 .then((leader) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(leader); 
//                 })               
//             }, (err) => next(err));
//         }
//         else if (leader == null) {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//         else {
//             err = new Error('Comment ' + req.params.commentId + ' not found');
//             err.status = 404;
//             return next(err);            
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });



module.exports = leadersRouter;