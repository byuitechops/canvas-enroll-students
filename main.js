const canvas = require('canvas-api-wrapper'),
    asyncLib = require('async'),
    moment = require('moment'),
    fs = require('fs');

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
            user_id: `sis_user_id:${student['SIS User ID']}`,
            type: 'StudentEnrollment',
            enrollment_state: 'active',
            notify: false
        }
    };

    // Course has 0 enrollments and is ready to recieve them
    canvas.post(`/api/v1/sections/${sectionId}/enrollments`, enrollmentObj, (err) => {
        if (err) {
            console.log(`${student['Student']} not enrolled (${index}/${studentCount}). ${(index / studentCount * 100).toFixed()}% completed.`);
            badEnrollments.push({
                student: student,
                err: err.message,
                message: 'Error Enrolling'
            });
            callback(null);
            return;
        }
        console.log(`${student['Student']} has been enrolled (${index}/${studentCount}). ${(index / studentCount * 100).toFixed()}% completed.`);
        goodEnrollments.push({
            student: student,
            message: 'Successful Enrollment'
        });
        callback(null);
    });
}

module.exports = function (input) {
    sectionId = input.sectionId;
    studentCount = input.students.length;

    // Uncomment this line if running test.
    // input.students = input.students.slice(0, 11);

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

        fs.writeFileSync(`./reports/${date}-Enrollments.json`, JSON.stringify(output, null, 4));
        console.log('Enrollments complete.');
    });
};