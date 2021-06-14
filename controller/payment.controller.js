// const Razorpay = require("razorpay");
//   const { v4: uuidv4 } = require('uuid');
const User = require("../models/auth.model");
const StudentMap = require('../models/studentmap.model')
const PaymentSchedule = require('../models/payment-schedule.model');
const { errorHandler } = require("../helpers/dbErrorHandling");
const { validationResult } = require("express-validator");

// const razorpay = new Razorpay({ key_id: "rzp_test_gfhfgg4tr4", key_secret: "sdsdsdsdopopopcv" })

exports.getOrder = (req, res) => {
  //   let options = {
  //     amount: 50000, // amount in the smallest currency unit
  //     currency: "INR",
  //     receipt: "order_rcptid_11", //+uuidv4();
  //   };
  //   razorpay.orders.create(options, function (err, order) {
  //     console.log(order);
  //   });
};

exports.getShedules = (req, res) => {
  const { myId, myRole, oppoId, mapId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (myRole === "teacher") {
      StudentMap.findById(mapId).then((studentMap) => {
        PaymentSchedule.find({ studentMapID: mapId, isActive: true }).then((paymentSchedule) => {
          let ScheduledAmount = 0
          paymentSchedule.forEach(el => {
            ScheduledAmount += el.requestAmount
          });
          res.status(201).json({
            success: true,
            message: 'Loaded Sucessfully',
            paymentSchedule,
            balanceAmount: studentMap.feesAmount - studentMap.paidAmount - ScheduledAmount
          })
        }).catch(err => {

          res.status(202).json({
            success: true,
            message: 'Loaded Sucessfully',
            paymentSchedule: [],
            balanceAmount: studentMap.feesAmount - studentMap.paidAmount
          })
        }).catch(err => res.status(400).json({ error: errorHandler(err) }));
      }).catch(err => res.status(400).json({ error: errorHandler(err) }));

    } else {
      return res.status(400)({ error: "Not Allowed" })
    }
  }
}


exports.addNewShedule = (req, res) => {
  const { studentMapID, userID, userRole, requestAmount, comment, warningDate, lastDate, } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (userRole === "teacher") {
      const paymentSchedule = new PaymentSchedule({ studentMapID, userID, requestAmount, comment, warningDate, lastDate, })

      paymentSchedule.save((err, feedback) => {
        if (err) {
          return res.status(401).json({
            error: errorHandler(err),
          });
        } else {
          res.status(200).json({
            success: true,
            message: 'Added Sucessfully',
          })
        }
      })

    } else {
      return res.status(400)({ error: "Not Allowed" })
    }
  }
}


exports.getPendingShedules = (req, res) => {
  const { myId, myRole, oppoId, mapId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (myRole === "teacher") {
      PaymentSchedule.find({ studentMapID: mapId, isPaid: false, isActive: true }).then((paymentSchedule) => {
        res.status(201).json({
          success: true,
          message: 'Loaded Sucessfully',
          paymentSchedule
        })
      }).catch(err => {
        res.status(202).json({
          success: true,
          message: 'Loaded Sucessfully',
          paymentSchedule: [],
        })
      }).catch(err => res.status(400).json({ error: errorHandler(err) }));
    }
  }
}


exports.getPendings = (req, res) => {
  const { _id, role } = req.body;
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {

    switch (role) {
      case "admin":

        break;
      case "student":

        break;
      case "teacher":
        StudentMap.aggregate([
          {
            $match: {
              teacherID: ObjectId(_id)
            }
          },
          {
            $lookup: {
              from: "paymentschedules",
              localField: "_id",
              foreignField: "studentMapId",
              as: "paymentschedule",
            },
          },
          { $unwind: "$paymentschedule" },
          {
            $project: {
              _id: 1,
              pending: "$paymentschedule",
              classLink: 1,
              feesAmount: 1,
              paidAmount: 1,
              feesCurrency: 1,
              courseName: 1,
              isActive: 1
            },
          }

        ])
        break;

      default:
        break;
    }

  }


}
