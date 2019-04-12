const canvas = require('canvas-api-wrapper'),
    asyncLib = require('async'),
    moment = require('moment'),
    fs = require('fs'),
    chalk = require('chalk');

let sectionId;
let studentCount;

var goodEnrollments = [];
var badEnrollments = [];

/**************************************************
 * Code that sets up and makes the PUT reuqest. 
 * Reports errors in error badEnrollments var.
 **************************************************/
function enrollStudent(student, index, callback) {
    var enrollmentObj = {
        enrollment: {
            user_id: `sis_user_id:${student['SIS User ID'].padStart(9, '0')}`,
            type: 'StudentEnrollment',
            enrollment_state: 'active',
            notify: false
        }
    };

    canvas.post(`/api/v1/sections/${sectionId}/enrollments`, enrollmentObj, (err) => {
        /* NOTE: If a course has no sections you can 'cheat' by enrolling students into a course directly.
         * Only do this for a small group of students by uncommenting line 63 (input = input.slice(0, 10)) and
         * running the code with a Canvas Course ID instead of a section ID. This will create a section in that
         * course that you should run the request on for the rest of your CSV. */
        // canvas.post(`/api/v1/courses/${sectionId}/enrollments`, enrollmentObj, (err) => {
        if (err) {
            console.log(chalk.red(`${student['Student']} not enrolled (${index}/${studentCount}). ${(index / studentCount * 100).toFixed()}% completed.`));
            badEnrollments.push({
                student: student,
                err: err.message,
                message: 'Error Enrolling'
            });
            callback(null);
            return;
        }
        console.log(chalk.green(`${student['Student']} has been enrolled (${index}/${studentCount}). ${(index / studentCount * 100).toFixed()}% completed.`));
        goodEnrollments.push({
            student: student,
            message: 'Successful Enrollment'
        });
        callback(null);
    });
}

module.exports = function (input) {
    input.students = input.students.map(student => {
        return {
            "Student": student.Student,
            "SIS User ID": student['SIS User ID'].padStart(9, '0'),
            "SIS Login ID": student['SIS Login ID']
        };
    });
    sectionId = input.sectionId;
    studentCount = input.students.length;

    // Uncomment this line if running test.
    // input.students = input.students.slice(0, 10);

    /**************************************************
     * Code that writes out report files. Also control-
     * flow, only 25 concurrent processes.
     **************************************************/
    asyncLib.eachOfLimit(input.students, 25, enrollStudent, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        var date = moment().format('YYYYMMDD_kkmm');
        var output = {
            success: goodEnrollments,
            failure: badEnrollments,
        };

        fs.writeFileSync(`./reports/${input.sectionId}-enrollments-${date}.json`, JSON.stringify(output, null, 4));
        console.log('Enrollments complete.');
    });
};