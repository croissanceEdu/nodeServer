
//   const { v4: uuidv4 } = require('uuid');
const User = require("../models/auth.model");
const StudentMap = require('../models/studentmap.model')
const PaymentSchedule = require('../models/paymentschedule.model');
const { errorHandler } = require("../helpers/dbErrorHandling");
const { validationResult } = require("express-validator");
const FeePayment = require("../models/feepayment.model");
const FeePaymentRequest = require("../models/feepaymentrequest.model");


const Razorpay = require("razorpay");

const RazorpayPayment = require("../models/razorpaypayment.model");
// const razorpay = new Razorpay({ key_id: "rzp_test_MnEJfm6ScoCpw7", key_secret: "QPY9aPXaU0asdTmDnTgchDNV" })

// exports.getOrder = (req, res) => {
//   let options = {
//     amount: req.body.amount, // amount in the smallest currency unit
//     currency: "INR",
//     receipt: "order_rcptid_11", //+uuidv4();
//   };
//   razorpay.orders.create(options, function (err, order) {
//     console.log(order);
//   });
// };

exports.getOrder = async (req, res) => {

  try {
    const { amount, currency } = req.body


    const instance = new Razorpay({
      key_id: process.env[process.env.RAZORPAY_API_KEY_SELECT],
      key_secret: process.env[process.env.RAZORPAY_API_SEC_SELECT],
    });

    const options = {
      amount, // amount in smallest currency unit
      currency,
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }

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
    if (myRole === "teacher" || true) {
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
            balanceAmount: studentMap.feesAmount - studentMap.paidAmount - ScheduledAmount,
            feeAmount: studentMap.feesAmount,
            paidAmount: studentMap.paidAmount
          })
        }).catch(err => {

          res.status(202).json({
            success: true,
            message: 'Loaded Sucessfully',
            paymentSchedule: [],
            balanceAmount: studentMap.feesAmount - studentMap.paidAmount,
            feeAmount: studentMap.feesAmount,
            paidAmount: studentMap.paidAmount
          })
        }).catch(err => res.status(400).json({ error: errorHandler(err) }));
      }).catch(err => res.status(400).json({ error: errorHandler(err) }));

    } else {
      return res.status(400)({ error: "Not Allowed" })
    }
  }
}

exports.getHistory = (req, res) => {
  const { myId, myRole, oppoId, mapId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (myRole === "teacher" || true) {
      StudentMap.findById(mapId).then((studentMap) => {
        FeePayment.find({ studentMapID: mapId, isActive: true })
          .then((feePayment) => {
            res.status(201).json({
              success: true,
              message: 'Loaded Sucessfully',
              feePayment
            })
          }).catch(err => {

            res.status(202).json({
              success: true,
              message: 'Loaded Sucessfully',
              feePayment: []
            })
          }).catch(err => res.status(400).json({ error: errorHandler(err) }));
      }).catch(err => res.status(400).json({ error: errorHandler(err) }));

    } else {
      return res.status(400)({ error: "Not Allowed" })
    }
  }
}


exports.getRequests = (req, res) => {
  const { myId, myRole, oppoId, mapId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (myRole === "teacher" || true) {
      FeePaymentRequest.find({ studentMapID: mapId, isPaid: false, isActive: true })
        .then((feePaymentRequest) => {
          res.status(201).json({
            success: true,
            message: 'Loaded Sucessfully',
            feePaymentRequest
          })
        }).catch(err => {
          res.status(202).json({
            success: true,
            message: 'Loaded Sucessfully',
            feePaymentRequest: []
          })
        }).catch(err => res.status(400).json({ error: errorHandler(err) }));

    } else {
      return res.status(400)({ error: "Not Allowed" })
    }
  }
}



exports.addNewShedule = (req, res) => {
  const { studentMapID, userID, userRole, requestAmount, comment, warningDate, lastDate, currency } = req.body;
  console.log(userRole, 1)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {

    if (userRole === "admin") {
      const paymentSchedule = new PaymentSchedule({ studentMapID, userID, requestAmount, comment, warningDate, lastDate, currency })
      paymentSchedule.save((err, schedule) => {
        if (err) {
          return res.status(401).json({
            error: errorHandler(err),
          });
        } else {
          res.json({
            success: true,
            message: 'Added Sucessfully',
          })
        }
      })

    } else {

      return res.status(400)({ error: "Not Allowed" });
    }
  }
}



exports.deleteShedule = (req, res) => {
  PaymentSchedule.findById(req.params.id).then(paymentSchedule => {
    paymentSchedule.isActive = false;
    paymentSchedule.save().then(() =>
      res.json({
        success: true,
        message: 'Successfully Deleted',
        paymentSchedule
      }))
      .catch(err => res.status(400).json({ error: errorHandler(err) }));
  })
}


exports.addRecord = (req, res) => {
  const { userId, userRole, myId, myRole, oppId, paymentSchedule, comment, paymentMethod, shiftId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (userRole === "admin") {
      const feePayment = new FeePayment({
        userID: userId,
        shiftID: shiftId,
        studentMapID: paymentSchedule.studentMapID,
        paymentScheduleID: paymentSchedule._id,
        senderID: oppId,
        receiverID: myId,
        paidAmount: paymentSchedule.requestAmount,
        currency: paymentSchedule.currency,
        paymentMethod,
        comment,
      })
      feePayment.save().then(() => {

        PaymentSchedule.findById(paymentSchedule._id).then((shed) => {
          shed.isPaid = true;
          shed.save().then(() => {
            StudentMap.findById(paymentSchedule.studentMapID).then(studentMap => {
              studentMap.paidAmount += paymentSchedule.requestAmount;
              studentMap.save().then(() => {
                res.status(200).json({
                  success: true,
                  message: 'Added Sucessfully',
                })
              }).catch(err => res.status(400).json({ error: errorHandler(err) }));
            }).catch(err => res.status(400).json({ error: errorHandler(err) }));
          }).catch(err => res.status(400).json({ error: errorHandler(err) }));
        }).catch(err => res.status(400).json({ error: errorHandler(err) }));
      }).catch(err => res.status(400).json({ error: errorHandler(err) }));
    } else if (userRole === "teacher" || userRole === "student") {
      if (myRole === "teacher") {
        const feePaymentRequest = new FeePaymentRequest({
          userID: userId,
          shiftID: shiftId,
          studentMapID: paymentSchedule.studentMapID,
          paymentScheduleID: paymentSchedule._id,
          senderID: oppId,
          receiverID: myId,
          paidAmount: paymentSchedule.requestAmount,
          currency: paymentSchedule.currency,
          paymentMethod,
          comment,
        })
        feePaymentRequest.save().then(() => {
          PaymentSchedule.findById(paymentSchedule._id).then((shed) => {
            shed.isRequested = true;
            shed.save().then(() => {
              res.status(200).json({
                success: true,
                message: 'Request Submitted Sucessfully',
              })
            }).catch(err => res.status(400).json({ error: errorHandler(err) }));
          }).catch(err => res.status(400).json({ error: errorHandler(err) }));
        }).catch(err => res.status(400).json({ error: errorHandler(err) }));
      }
      else if (myRole === "student") {
        const feePaymentRequest = new FeePaymentRequest({
          userID: userId,
          shiftID: shiftId,
          studentMapID: paymentSchedule.studentMapID,
          paymentScheduleID: paymentSchedule._id,
          senderID: myId,
          receiverID: oppId,
          paidAmount: paymentSchedule.requestAmount,
          currency: paymentSchedule.currency,
          paymentMethod,
          comment,
        })
        feePaymentRequest.save().then(() => {
          PaymentSchedule.findById(paymentSchedule._id).then((shed) => {
            shed.isRequested = true;
            shed.save().then(() => {
              res.status(200).json({
                success: true,
                message: 'Request Submitted Sucessfully',
              })
            }).catch(err => res.status(400).json({ error: errorHandler(err) }));
          }).catch(err => res.status(400).json({ error: errorHandler(err) }));
        }).catch(err => res.status(400).json({ error: errorHandler(err) }));
      } else {
        return res.status(400)({ error: "Problem with user Selection" })
      }
    } else {
      return res.status(400)({ error: "Not Allowed" })
    }
  }
}



exports.approveRecord = (req, res) => {
  const { userId, userRole, myId, myRole, oppId, paymentRequest, shiftId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (userRole === "admin") {
      const feePayment = new FeePayment({
        userID: userId,
        shiftID: shiftId,
        studentMapID: paymentRequest.studentMapID,
        paymentScheduleID: paymentRequest.paymentScheduleID,
        senderID: paymentRequest.senderID,
        receiverID: paymentRequest.receiverID,
        paidAmount: paymentRequest.paidAmount,
        currency: paymentRequest.currency,
        paymentMethod: paymentRequest.paymentMethod,
        comment: paymentRequest.comment
      })
      feePayment.save().then(() => {

        FeePaymentRequest.findById(paymentRequest._id).then((feePayReq) => {
          feePayReq.isPaid = true;
          feePayReq.save().then(() => {
            PaymentSchedule.findById(paymentRequest.paymentScheduleID).then((shed) => {
              shed.isPaid = true;
              shed.save().then(() => {
                StudentMap.findById(paymentRequest.studentMapID).then(studentMap => {
                  studentMap.paidAmount += paymentRequest.paidAmount;
                  studentMap.save().then(() => {
                    res.status(200).json({
                      success: true,
                      message: 'Added Sucessfully',
                    })
                  }).catch(err => res.status(400).json({ error: errorHandler(err) }));
                }).catch(err => res.status(400).json({ error: errorHandler(err) }));
              }).catch(err => res.status(400).json({ error: errorHandler(err) }));
            }).catch(err => res.status(400).json({ error: errorHandler(err) }));
          }).catch(err => res.status(400).json({ error: errorHandler(err) }));
        }).catch(err => res.status(400).json({ error: errorHandler(err) }));
      }).catch(err => res.status(400).json({ error: errorHandler(err) }));
    } else {
      return res.status(400)({ error: "Not Allowed" })
    }

  }
}


exports.rejectRecord = (req, res) => {
  const { userId, userRole, myId, myRole, oppId, paymentRequest, shiftId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (userRole === "admin") {
      FeePaymentRequest.findById(paymentRequest._id).then((feePayReq) => {
        feePayReq.isActive = false;
        feePayReq.save().then(() => {
          PaymentSchedule.findById(paymentRequest.paymentScheduleID).then((shed) => {
            shed.isRequested = false;
            shed.save().then(() => {
              res.status(200).json({
                success: true,
                message: 'Rejected Sucessfully',
              })
            }).catch(err => res.status(400).json({ error: errorHandler(err) }));
          }).catch(err => res.status(401).json({ error: errorHandler(err) }));
        }).catch(err => res.status(402).json({ error: errorHandler(err) }));
      }).catch(err => res.status(403).json({ error: errorHandler(err) }));

    } else {
      return res.status(400)({ error: "Not Allowed" })
    }

  }
}



exports.payWithRazorPay = (req, res) => {
  const { data, userId, userRole, myId, myRole, oppId, paymentSchedule, comment, paymentMethod, shiftId } = req.body;
  const isTestMode = process.env.RAZORPAY_API_KEY_SELECT === "RAZORPAY_TEST_API_KEY";


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (userRole === "student") {
      const feePayment = new FeePayment({
        userID: userId,
        shiftID: shiftId,
        studentMapID: paymentSchedule.studentMapID,
        paymentScheduleID: paymentSchedule._id,
        senderID: myId,
        receiverID: oppId,
        paidAmount: paymentSchedule.requestAmount,
        currency: paymentSchedule.currency,
        paymentMethod,
        comment,
      })
      feePayment.save().then((feepayment) => {

        const razorpayPayment = new RazorpayPayment({
          shiftID: shiftId,
          feePaymentID: feepayment._id,
          orderCreationID: data.orderCreationId,
          razorpayPaymentID: data.razorpayPaymentId,
          razorpayOrderID: data.razorpayOrderId,
          razorpaySignature: data.razorpaySignature,
          isTestPayment: isTestMode
        })
        razorpayPayment.save().then(() => {
          PaymentSchedule.findById(paymentSchedule._id).then((shed) => {
            shed.isPaid = true;
            shed.save().then(() => {
              StudentMap.findById(paymentSchedule.studentMapID).then(studentMap => {
                studentMap.paidAmount += paymentSchedule.requestAmount;
                studentMap.save().then(() => {
                  res.status(200).json({
                    success: true,
                    message: 'Payment Sucessfully',
                  })
                }).catch(err => res.status(400).json({ error: errorHandler(err) }));
              }).catch(err => res.status(400).json({ error: errorHandler(err) }));
            }).catch(err => res.status(400).json({ error: errorHandler(err) }));
          }).catch(err => res.status(400).json({ error: errorHandler(err) }));
        }).catch(err => res.status(400).json({ error: errorHandler(err) }));
      }).catch(err => res.status(400).json({ error: errorHandler(err) }));
    } else {
      return res.status(400)({ error: "Not Allowed" })
    }
  }
}
