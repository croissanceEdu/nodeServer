const User = require('../models/auth.model')
const ActivationLink = require('../models/activationlink.model')
// const expressJwt = require('express-jwt')
// const _ = require('lodash')
// const { OAuth2Client } = require('google-auth-library')
// const fetch = require('node-fetch')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
//custom error handler
const { errorHandler } = require('../helpers/dbErrorHandling')
const Syllabus = require('../models/syllabus.model')
const StudentMap = require('../models/studentmap.model')


exports.getSyllabusController = (req, res) => {
    const {
        _id,
        role,
        oppId,
        mapId
    } = req.body
    const errors = validationResult(req)
    console.log(mapId)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        if (role === "student") {
            Syllabus.find({
                studentID: _id,
                teacherID: oppId,
                studentMapID: mapId
            })
                .exec((err, syllabus) => {
                    if (!syllabus) {
                        return res.status(400).json({
                            error: "Error"
                        })
                    } else {
                        const newSyllabus = []
                        syllabus.map(syllabus => {
                            newSyllabus.push(syllabus.toObject())
                            syllabus.isNewStatus = false;
                            syllabus.save().catch(err => res.status(400).json({ error: errorHandler(err) }));
                        })
                        res.json({
                            success: true,
                            message: "Done",
                            syllabus: newSyllabus
                        })
                    }
                })
        } else if (role === "teacher") {
            Syllabus.find({
                teacherID: _id,
                studentID: oppId,
                studentMapID: mapId,
            }).exec((err, syllabus) => {
                if (!syllabus) {
                    return res.status(400).json({
                        error: "Error"
                    })
                } else res.json({
                    success: true,
                    message: "Done",
                    syllabus
                })
            })
        } else res.json({
            success: false,
            message: "Access not allowed"
        })


    }
}


exports.completeSyllabusController = (req, res) => {
    const { id, role } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        if (role === "student") {
            Syllabus.findById(id).then(syllabus => {
                syllabus.studentComplete = true

                syllabus.save()
                    .then(() => {
                        res.json({
                            success: true,
                            message: "Done",
                            syllabus
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            error: "Error: " + err
                        })
                    })
            })

        } else if (role === "teacher") {
            Syllabus.findById(id).then(syllabus => {
                syllabus.teacherComplete = true


                syllabus.save()
                    .then(() => {

                        res.json({
                            success: true,
                            message: "Done",
                            syllabus
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            error: "Error: " + err
                        })
                    })
            })

        } else res.json({
            success: false,
            message: "Access not allowed"
        })
    }
}


exports.uncheckSyllabusController = (req, res) => {
    const { id, role } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        if (role === "student") {
            Syllabus.findById(id).then(syllabus => {
                syllabus.studentComplete = false

                syllabus.save()
                    .then(() => {
                        res.json({
                            success: true,
                            message: "Done",
                            syllabus
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            error: "Error: " + err
                        })
                    })
            })

        } else if (role === "teacher") {
            Syllabus.findById(id).then(syllabus => {
                syllabus.teacherComplete = false

                syllabus.save()
                    .then(() => {
                        res.json({
                            success: true,
                            message: "Done",
                            syllabus
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            error: "Error: " + err
                        })
                    })
            })

        } else res.json({
            success: false,
            message: "Access not allowed"
        })
    }
}

exports.addSyllabusController = (req, res) => {
    const {
        chapterName,
        moduleName,
        studentID,
        teacherID,
        studentMapID } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        const syllabus = new Syllabus({
            chapterName,
            moduleName,
            studentID,
            teacherID,
            studentMapID
        })

        syllabus.save((err, syllabus) => {
            if (err) {
                return res.status(401).json({
                    error: errorHandler(err)
                })
            } else {

                return res.json({
                    success: true,
                    message: 'Successfully added',
                    syllabus
                })
            }
        })


    }
}


exports.addSyllabusMapController = (req, res) => {
    const {
        studentID,
        teacherID,
        classLink,
        courseName,
        feesAmount,
        feesCurrency,
        paidAmount } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        const studentMap = new StudentMap({
            studentID,
            teacherID,
            classLink,
            courseName,
            feesAmount,
            feesCurrency,
            paidAmount
        })

        studentMap.save((err, studentMap) => {
            if (err) {
                return res.status(401).json({
                    error: errorHandler(err)
                })
            } else {

                StudentMap.aggregate([

                    {
                        $lookup: {
                            from: 'users',
                            localField: 'teacherID',
                            foreignField: '_id',
                            as: 'teacher'
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'studentID',
                            foreignField: '_id',
                            as: 'student'
                        }
                    },
                    { $unwind: '$student' },
                    { $unwind: '$teacher' },
                    {
                        $project: {
                            _id: 1,
                            classLink: 1,
                            teacherID: 1,
                            studentID: 1,
                            courseName: 1,
                            feesAmount: 1,
                            feesCurrency: 1,
                            paidAmount: 1,
                            teacherName: '$teacher.name',
                            studentName: '$student.name'
                        }
                    }


                ])
                    .then((studentMap) => res.json({
                        success: true,
                        message: 'Successfully Added',
                        studentMap
                    }))
                    .catch(err => res.status(400).json({ error: errorHandler(err) }));
            }
        })


    }
}

exports.deleteSyllabusMapController = (req, res) => {
    StudentMap.findByIdAndDelete(req.params.id).then(() => res.json({
        success: true,
        message: 'Successfully deleted'
    }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));

}

exports.getSyllabusMapController = (req, res) => {
    StudentMap.aggregate([

        {
            $lookup: {
                from: 'users',
                localField: 'teacherID',
                foreignField: '_id',
                as: 'teacher'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'studentID',
                foreignField: '_id',
                as: 'student'
            }
        },
        { $unwind: '$student' },
        { $unwind: '$teacher' },
        {
            $project: {
                _id: 1,
                classLink: 1,
                teacherID: 1,
                studentID: 1,
                courseName: 1,
                feesAmount: 1,
                feesCurrency: 1,
                paidAmount: 1,
                teacherName: '$teacher.name',
                studentName: '$student.name',
                teacher: '$teacher',
                student: '$student',
            }
        }


    ])


        .then((studentMap) => res.json({
            success: true,
            message: 'Successfully Loaded',
            studentMap
        }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
}

exports.getSyllabusMapByIdController = (req, res) => {
    StudentMap.findById(req.params.id)


        .then((studentMap) => res.json({
            success: true,
            message: 'Successfully Loaded',
            studentMap
        }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
}

exports.putSyllabusMapByIdController = (req, res) => {


    StudentMap.findById(req.params.id)
        .then((studentMap) => {
            // studentMap.teacherID=req.body.teacherID
            // studentMap.studentID=req.body.studentID
            studentMap.classLink = req.body.classLink
            studentMap.courseName = req.body.courseName
            studentMap.feesAmount = req.body.feesAmount
            studentMap.feesCurrency = req.body.feesCurrency
            studentMap.paidAmount = req.body.paidAmount
            studentMap.save().then(() =>
                res.json({
                    success: true,
                    message: 'Successfully Saved',
                    studentMap
                }))
        })
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
}
exports.putClassNameController = (req, res) => {

    StudentMap.findById(req.params.id)
        .then((studentMap) => {
            // studentMap.teacherID=req.body.teacherID
            // studentMap.studentID=req.body.studentID
            studentMap.classLink = req.body.classLink
            studentMap.save().then(() =>
                res.json({
                    success: true,
                    message: 'Successfully Saved',
                    studentMap
                }))
        })
        .catch(err => res.status(400).json({ error: errorHandler(err) }));
}



exports.getModuleWiseSyllabusController = (req, res) => {
    const {
        _id,
        role,
        oppId
    } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        if (role === "student") {

            Syllabus.aggregate([
                {
                    $match: {
                        studentID: ObjectId(_id),
                        teacherID: ObjectId(oppId)
                    }
                },
                {
                    $group: {
                        _id: "$moduleName",
                    }
                }
            ])

                .exec((err, syllabus) => {
                    if (!syllabus) {
                        return res.status(400).json({
                            error: "Error"
                        })
                    } else res.json({
                        success: true,
                        message: "Done",
                        syllabus
                    })
                })
        } else if (role === "teacher") {
            Syllabus.find({
                teacherID: _id,
                studentID: oppId
            }).exec((err, syllabus) => {
                if (!syllabus) {
                    return res.status(400).json({
                        error: "Error"
                    })
                } else res.json({
                    success: true,
                    message: "Done",
                    syllabus
                })
            })
        } else res.json({
            success: false,
            message: "Access not allowed"
        })


    }
}


exports.deleteSyllabusController = (req, res) => {
    Syllabus.findByIdAndDelete(req.params.id).then(() => res.json({
        success: true,
        message: 'Successfully deleted'
    }))
        .catch(err => res.status(400).json({ error: errorHandler(err) }));

}