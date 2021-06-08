const User = require("../models/auth.model");
const ActivationLink = require("../models/activationlink.model");
// const expressJwt = require("express-jwt");
// const _ = require("lodash");
// const { OAuth2Client } = require("google-auth-library");
// const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
// const jwt = require("jsonwebtoken");
//custom error handler
const { errorHandler } = require("../helpers/dbErrorHandling");
const { Mongoose, Types } = require("mongoose");
const ObjectId = Types.ObjectId
const StudentMap = require('../models/studentmap.model');
const UserProfile = require("../models/userprofile.model");
const Feedback = require("../models/feedback.model");
const Syllabus = require("../models/syllabus.model");


exports.classLinkController = (req, res) => {
  const { id, role } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (role === "student") {
      StudentMap.aggregate([
        {
          $match: {
            studentID: ObjectId(id)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "teacherID",
            foreignField: "_id",
            as: "user",
          },
        },

        { $unwind: "$user" },

        {
          $project: {
            _id: 1,
            oppDetails: "$user",
            classLink: 1,
            feesAmount: 1,
            paidAmount: 1,
            feesCurrency: 1,
            courseName: 1,
            isActive: 1
          },
        }

      ]).exec((err, studentmap) => {
        if (!studentmap) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else
          res.json({
            success: true,
            message: "Done",
            classlinks: studentmap,
          });
      });
    } else if (role === "teacher") {
      StudentMap.aggregate([
        {
          $match: {
            teacherID: ObjectId(id)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "studentID",
            foreignField: "_id",
            as: "user",
          },
        },

        { $unwind: "$user" },

        {
          $project: {
            _id: 1,
            oppDetails: "$user",
            classLink: 1,
            feesAmount: 1,
            paidAmount: 1,
            feesCurrency: 1,
            courseName: 1,
            isActive: 1
          },
        }

      ])
        .exec((err, studentmap) => {
          if (!studentmap) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else
            res.json({
              success: true,
              message: "Done",
              classlinks: studentmap,
            });
        });
    }
  }
};

exports.getUsersController = (req, res) => {
  const { role } = req.body;
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.find({
      role,
    }).exec((err, user) => {
      if (!user) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      } else {
        const userOptions = [];
        user.map((user) => {
          userOptions.push({ value: user._id, label: user.name });
        });
        res.json({
          success: true,
          message: "Done",
          user,
          userOptions,
        });
      }
    });
  }
};

exports.getUsersByIdController = (req, res) => {
  const { _id, role } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (role === "teacher") {
      User.aggregate([
        {
          $match: {
            _id: ObjectId(_id)
          }
        },
        {
          $lookup: {
            from: "studentmaps",
            localField: "_id",
            foreignField: "teacherID",
            as: "studentmap",
          },
        },

        { $unwind: "$studentmap" },

        {
          $project: {
            _id: "$studentmap.studentID",
            studentMap: "$studentmap",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "student",
          },
        },
        { $unwind: "$student" },
        {
          $project: {
            _id: "$student._id",
            name: "$student.name",
            role: "$student.role",
            email: "$student.email",
            imagePath: "$student.imagePath",
            studentMap: 1,
          },
        },

      ])

        .exec((err, user) => {
          if (!user) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else {


            res.json({
              success: true,
              message: "Done",
              user,

            });





          }
        });
    } else if (role === "student") {
      User.aggregate([
        {
          $match: {
            _id: ObjectId(_id)
          }
        },
        {
          $lookup: {
            from: "studentmaps",
            localField: "_id",
            foreignField: "studentID",
            as: "studentmap",
          },
        },

        { $unwind: "$studentmap" },

        {
          $project: {
            _id: "$studentmap.teacherID",
            studentMap: "$studentmap",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "teacher",
          },
        },
        { $unwind: "$teacher" },
        {
          $project: {
            _id: "$teacher._id",
            name: "$teacher.name",
            role: "$teacher.role",
            email: "$teacher.email",
            imagePath: "$teacher.imagePath",
            studentMap: 1
          },
        },

      ])

        .exec((err, user) => {
          if (!user) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else {

            res.json({
              success: true,
              message: "Done",
              user,

            });



          }
        });
    } else if (role === "admin") {
      User.aggregate([
        {
          $lookup: {
            from: "studentmaps",
            localField: "_id",
            foreignField: "studentID",
            as: "studentmap",
          },
        },

        { $unwind: "$studentmap" },

        {
          $project: {
            teacherId: "$studentmap.teacherID",
            studentMap: "$studentmap",
            studentId: "$_id",
            name: 1,
            role: 1,
            email: 1,
            imagePath: 1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "teacherId",
            foreignField: "_id",
            as: "teacher",
          },
        },
        { $unwind: "$teacher" },
        {
          $project: {
            _id: "$studentMap._id",
            teacher: {
              _id: "$teacher._id",
              name: "$teacher.name",
              role: "$teacher.role",
              email: "$teacher.email",
              imagePath: "$teacher.imagePath",
            },
            student: {
              _id: "$studentId",
              name: "$name",
              role: "$role",
              email: "$email",
              imagePath: "$imagePath",
              studentMap: "$studentMap",
            }

          },
        },

      ])


        .exec((err, user) => {
          if (!user) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else {

            res.json({
              success: true,
              message: "Done",
              user,

            });
          }
        });
    }
  }
};



exports.getUserPairController = (req, res) => {
  const { role } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (role === "admin") {
      StudentMap.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "teacherID",
            foreignField: "_id",
            as: "teacher",
          },
        },
        { $unwind: "$teacher" },
        {
          $lookup: {
            from: "users",
            localField: "studentID",
            foreignField: "_id",
            as: "student",
          },
        },
        { $unwind: "$student" },
        { $project: {} }


      ])

        .exec((err, user) => {
          if (!user) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else {
            const userOptions = [];
            user.map((user) => {
              userOptions.push({ value: user._id, label: user.student.name + "-" + user.teacher.name, studentID: user.student._id, teacherID: user.teacher._id });
            });

            res.json({
              success: true,
              message: "Done",
              user,
              userOptions,
            });
          }
        });
    }
  }
};



exports.setProfilePicByIdController = (req, res) => {
  const id = req.params.id
  // const { v4: uuidv4 } = require('uuid');


  // console.log(req.files)

  let croppedImage = req.files.croppedImage;
  //keep all images
  // let imagePath = 'img' + uuidv4() + new Date().getTime() + croppedImage.name;
  //replace unwanted images (save memory) 
  let imagePath = 'img' + id.toString() + croppedImage.name;

  let uploadPath = process.env.UPLOADS_FOLDER + imagePath;

  // console.log(__dirname)
  croppedImage.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  })


  User.findById(id)
    .then((user) => {
      user.imagePath = imagePath

      user.save().then(() =>
        res.status(200).json({
          success: true,
          message: 'Image Uploaded',
          File: req.files,
          imagePath
        })
      )
    }).catch(err => res.status(400).json({ error: errorHandler(err) }));

}


exports.getUserDetailsByIdController = (req, res) => {
  const { id } = req.body

  User.findById(id)
    .then((user) => {
      UserProfile.findOne({ userId: id }).then((userProfile) => {
        res.status(200).json({
          success: true,
          message: 'Got Image Sucessfully',
          user,
          userProfile
        })
      }).catch(err => {
        res.status(200).json({
          success: true,
          message: 'Got Image Sucessfully',
          user, userProfile: false
        })
      })
    }).catch(err => res.status(400).json({ error: errorHandler(err) }));


}


exports.setUserProfileByIdController = (req, res) => {

  const { id, dateOfBirth, contactNumber, fullAddress, gender, qualification } = req.body;
  User.findById(id)
    .then((user) => {
      UserProfile.findOne({ userId: id }).then((userProfile) => {
        userProfile.dateOfBirth = dateOfBirth
        userProfile.contactNumber = contactNumber
        userProfile.fullAddress = fullAddress
        userProfile.gender = gender
        userProfile.qualification = qualification

        userProfile.save().then(() =>
          res.status(200).json({
            success: true,
            message: 'Profile Updated',
            user,
            userProfile,
          })
        ).catch(err => res.status(400).json({ error: errorHandler(err) }));

      }).catch(err => {
        const userProfile = new UserProfile({
          userId: id, dateOfBirth, contactNumber, fullAddress, gender, qualification
        })
        userProfile.save().then(() =>
          res.status(200).json({
            success: true,
            message: 'Profile Updated',
            user,
            userProfile,
          })
        )
      })
    }).catch(err => res.status(400).json({ error: errorHandler(err) }));
}



exports.clearProfilePicByIdController = (req, res) => {
  const { id } = req.body

  User.findById(id)
    .then((user) => {
      user.imagePath = ""

      user.save().then(() =>
        res.status(200).json({
          success: true,
          message: 'Image Removed',
          imagePath: user.imagePath
        })
      )
    }).catch(err => res.status(400).json({ error: errorHandler(err) }));

}

exports.getNotificationController = (req, res) => {
  const { _id, role } = req.body
  const notifications = { feedback: [], activationLinks: [], syllabus: [], joinClass: [] }
  if (role === "admin") {
    ActivationLink.find({
      activated: false,
      cancelled: false
    }).then((activationLinks) => {
      notifications.activationLinks = activationLinks

      User.findById(_id)
        .then((user) => {
          res.status(200).json({
            success: true,
            message: 'Loaded Sucessfully',
            imagePath: user.imagePath,
            notifications
          })
        }).catch(err => res.status(400).json({ error: errorHandler(err) }));
    }).catch(err => res.status(400).json({ error: errorHandler(err) }));

  } else {
    Feedback.find({
      toID: _id,
      isReadStatus: false,
    }).then((feedback) => {

      notifications.feedback = feedback;

      feedback.map((fb) => {
        fb.isDeliverStatus = true;
        fb.save().catch(err => res.status(400).json({ error: errorHandler(err) }));
      });
      if (role === "student") {
        Syllabus.find({
          studentID: _id,
          isNewStatus: true
        }).exec((err, syllabus) => {
          if (!syllabus) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else {
            notifications.syllabus = syllabus
            User.findById(_id)
              .then((user) => {
                res.status(200).json({
                  success: true,
                  message: 'Loaded Sucessfully',
                  imagePath: user.imagePath,
                  notifications
                })
              }).catch(err => res.status(400).json({ error: errorHandler(err) }));
          }
        });
      }

      else {
        User.findById(_id)
          .then((user) => {

            res.status(200).json({
              success: true,
              message: 'Loaded Sucessfully',
              imagePath: user.imagePath,
              notifications
            })
          }).catch(err => res.status(400).json({ error: errorHandler(err) }));
      }
    }).catch(err => res.status(400).json({ error: errorHandler(err) }));
  }


}

