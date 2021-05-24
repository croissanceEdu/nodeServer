const User = require("../models/auth.model");
const { validationResult } = require("express-validator");
//custom error handler
const { errorHandler } = require("../helpers/dbErrorHandling");

const Feedback = require("../models/feedback.model");
const { count, where } = require("../models/auth.model");
const { Mongoose } = require("mongoose");

exports.getFeedbackNotificationController = (req, res) => {
  const { _id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    Feedback.find({
      toID: _id,
      isReadStatus: false,
    }).exec((err, feedback) => {
      if (!feedback) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      } else {
        feedback.map((fb) => {
          fb.isDeliverStatus = true;
          fb.save().catch((err) => {
            res.status(400).json({
              error: "Error: " + err,
            });
          });
        });
        res.json({
          success: true,
          message: "Done",
          feedback,
        });
      }
    });
  }
};

exports.getFeedbackController = (req, res) => {
  const { fromID, toID, isSender, studentMapID } = req.body;
  console.log(studentMapID)
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    Feedback.find({
      toID,
      fromID,
      studentMapID,
    })
      .sort({ _id: -1 })
      .exec((err, feedback) => {
        if (!feedback) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          const newFeedback = [];
          if (!isSender) {
            feedback.map((feedback) => {
              newFeedback.push(feedback.toObject());
              feedback.isReaded = feedback.isReadStatus;
              feedback.isDeliverStatus = true;
              feedback.isReadStatus = true;
              feedback.save().catch((err) => {
                res.status(400).json({
                  error: "Error: " + err,
                });
              });
            });
          }
          res.json({
            success: true,
            message: "Done",
            feedback,
            newFeedback,
          });
        }
      });
  }
};

exports.sendFeedbackController = (req, res) => {
  const { titleName, messageContent, fromID, toID, studentMapID } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    const feedback = new Feedback({
      titleName,
      messageContent,
      fromID,
      toID,
      studentMapID
    });

    feedback.save((err, feedback) => {
      if (err) {
        return res.status(401).json({
          error: errorHandler(err),
        });
      } else {
        Feedback.find({
          toID: fromID,
        }).exec((err, feedback) => {
          if (!feedback) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else
            res.json({
              success: true,
              message: "Done",
              feedback,
            });
        });
      }
    });
  }
};

exports.getUsersWithFeedbackController = (req, res) => {
  const { _id, role } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    Feedback.find({
      toID: _id,
      isReadStatus: false,
    })
      .exec((err, feedback) => {
        if (!feedback) {
          return res.status(400).json({
            error: "Error",
          });
        } else {
          User.find({ role: role }).exec((err, user) => {
            if (!user) {
              return res.status(400).json({
                error: "Error",
              });
            } else {
              const userOptions = [];
              user.map((user) => {

                let count = 0
                feedback.map(feedback => {
                  if (feedback.toObject().fromID == user.toObject()._id) {
                    count++
                  }
                })
                userOptions.push({
                  value: user._id,
                  label: user.name,
                  count: count
                });
              });
              userOptions.concat(feedback)
              res.json({
                success: true,
                message: "Done",
                //  user,
                //  feedback,
                userOptions
              });
            }
          });
        }
      });
  }
};
