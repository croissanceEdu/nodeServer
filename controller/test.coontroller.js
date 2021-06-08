
const { errorHandler } = require("../helpers/dbErrorHandling");
const Feedback = require("../models/feedback.model");
const StudentMap = require("../models/studentmap.model");
const Syllabus = require("../models/syllabus.model");
const UserProfile = require("../models/userprofile.model");
const User = require("../models/auth.model");



exports.getStudentMap = (req, res) => {
    const ress = []
    const ressT = []
    StudentMap.find().then((studentMaps) => {
        studentMaps.map(stdMap => {
            ress.push({ _id: stdMap._id, studentID: stdMap.studentID, teacherID: stdMap.teacherID })
        })
        Syllabus.find().then((syllabuses) => {
            syllabuses.map(syllabus => {
                let selectedMap = {}
                selectedMap = studentMaps.find(el => (String(el.studentID) == String(syllabus.studentID) && (String(el.teacherID) == String(syllabus.teacherID))))
                ressT.push(selectedMap)
                if (selectedMap) {

                    if (selectedMap._id) {
                        syllabus.studentMapID = selectedMap._id
                        console.log(selectedMap._id)
                    }
                }
                syllabus.isActive = true;
                syllabus.isNewStatus = false;
                syllabus.save().catch(err => res.status(400).json({ error: errorHandler(err) }));

                // console.log(syllabus)
            })
            res.json({ message: "done", ress, ressT, syllabuses })
        })
        // res.json({ message: "no syllabus", ress })
    })

}
exports.addMapIdOnSyllabus = (req, res) => {
    StudentMap.find().then((studentMaps) => {
        Syllabus.find().then((syllabuses) => {
            syllabuses.map(syllabus => {
                let selectedMap = {}
                selectedMap = studentMaps.find(el => (String(el.studentID) == String(syllabus.studentID) && (String(el.teacherID) == String(syllabus.teacherID))))
                if (selectedMap) {
                    if (selectedMap._id) {
                        syllabus.studentMapID = selectedMap._id
                    }
                }
                syllabus.isActive = true;
                syllabus.isNewStatus = false;
                syllabus.save().catch(err => res.status(400).json({ error: errorHandler(err) }));
            })
            res.json({ message: "done", syllabuses })
        })
        // res.json({ message: "no syllabus", ress })
    })
}


exports.addMapIdOnFeedback = (req, res) => {
    StudentMap.find().then((studentMaps) => {
        Feedback.find().then((feedbacks) => {
            feedbacks.map(feedback => {
                let selectedMap = {}
                selectedMap = studentMaps.find(el => ((String(el.studentID) == String(feedback.fromID) && (String(el.teacherID) == String(feedback.toID))) ||
                    (String(el.studentID) == String(feedback.toID) && (String(el.teacherID) == String(feedback.fromID)))))
                if (selectedMap) {
                    if (selectedMap._id) {
                        feedback.studentMapID = selectedMap._id
                    }
                }
                feedback.isActive = true;
                feedback.save().catch(err => res.status(400).json({ error: errorHandler(err) }));
            })
            res.json({ message: "done", feedbacks })
        })
        // res.json({ message: "no feedback", ress })
    })

}

exports.addActiveonUser = (req, res) => {
    User.find().then((users) => {
        users.map(user => {
            user.isActive = true;
            user.save().catch(err => res.status(400).json({ error: errorHandler(err) }));
        })
        res.json({ message: "done", users })

    })

}


exports.getBackupFromDb = (req, res) => {
    const fs = require('fs')
    const uploadPath = `${process.env.BACKUPS_FOLDER}backup${new Date().getTime()}.json`
    const finished = (err) => {
        if (err) {
            console.error(err)
        }
    }
    const saveData = (obj, file) => {
        const jsonData = JSON.stringify(obj, null, 2)
        fs.writeFile(file, jsonData, finished)
        return jsonData
    }
    const ress = []

    User.find().then((users) => {
        ress.push({ users })
        StudentMap.find().then((studentmaps) => {
            ress.push({ studentmaps })
            Feedback.find().then((feedbacks) => {
                ress.push({ feedbacks })
                Syllabus.find().then((syllabuses) => {
                    ress.push({ syllabuses })
                    saveData(ress, uploadPath)
                    res.json({ message: "saved" })
                })
            })
        })
    })

}

