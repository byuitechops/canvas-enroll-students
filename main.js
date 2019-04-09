const canvas = require('canvas-api-wrapper'),
    asyncLib = require('async'),
    moment = require('moment');

var goodEnrollments = [];
var badEnrollments = [];

/**************************************************
 * Code that sets up and makes the PUT reuqest. 
 * Reports errors in error badEnrollments var.
 **************************************************/
function enrollStudent(courseData, callback) {
    var enrollmentObj = {
        enrollment: {
            user_id: courseData.teacher.id,
            type: 'TeacherEnrollment',
            enrollment_state: 'active',
            notify: false
        }
    };

    // Course has 0 enrollments and is ready to recieve them
    canvas.post(`/api/v1/courses/${courseData.course.id}/enrollments`, enrollmentObj, (err) => {
        if (err) {
            console.log(err);
            badEnrollments.push({
                teacher: courseData,
                err: err,
                message: 'Error Enrolling'
            });
            callback(null);
            return;
        }
        console.log(`${courseData.course.id} | ${courseData.teacher.id} has been enrolled in their Sandbox course.`);
        goodEnrollments.push({
            teacher: courseData,
            err: err,
            message: 'Successful Enrollment'
        });
        callback(null);
    });
}


/**************************************************
 * Code that sets up and makes the unenroll reuqest. 
 * Reports errors in error badEnrollments var.
 **************************************************/
function unenrollTeachers(courseData, unenrollCallback) {
    function unenrollTeacher(teacher, utCallback) {
        canvas.delete(`/api/v1/courses/${courseData.course.id}/enrollments/${teacher.enrollmentId}?task=delete`, (err) => {
            if (err) {
                utCallback(err);
            } else {
                console.log(`${teacher.id} unenrolled from course: ${courseData.course.id}`);
                utCallback(null);
            }
        });
    }

    asyncLib.each(courseData.incorrectTeachers, unenrollTeacher, err => {
        if (err) {
            unenrollCallback(err);
        } else {
            unenrollCallback(null);
        }
    });
}

module.exports = function (input) {
    /**************************************************
     * Code that writes out report files. Also control-
     * flow, only 25 concurrent processes.
     **************************************************/
    asyncLib.eachLimit(input, 25, enrollStudent, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        var date = moment().format('YYYYMMDD_kkmm');
        var output = {
            success: goodEnrollments,
            failure: badEnrollments,
        };

        fs.writeFileSync(`./${date}-Enrollments.json`, JSON.stringify(output, null, 4));
        console.log('Enrollments complete.');
    });
};