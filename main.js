const canvas = require('canvas-api-wrapper'),
    asyncLib = require('async'),
    moment = require('moment'),
    fs = require('fs');

var sectionId = '';

var goodEnrollments = [];
var badEnrollments = [];

/**************************************************
 * Code that sets up and makes the PUT reuqest. 
 * Reports errors in error badEnrollments var.
 **************************************************/
function enrollStudent(student, callback) {
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
            console.log(err);
            badEnrollments.push({
                student: student,
                err: err.message,
                message: 'Error Enrolling'
            });
            callback(null);
            return;
        }
        console.log(`${student['Student']} has been enrolled in section.`);
        goodEnrollments.push({
            student: student,
            err: err.message,
            message: 'Successful Enrollment'
        });
        callback(null);
    });
}

module.exports = function (input) {
    sectionId = input.sectionId;

    /**************************************************
     * Code that writes out report files. Also control-
     * flow, only 25 concurrent processes.
     **************************************************/
    asyncLib.eachLimit(input.students, 25, enrollStudent, (err) => {
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