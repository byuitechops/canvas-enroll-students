# Canvas Enroll Students

## Description 

This tool can be used as to enroll a list of students into a Canvas section (via CSV and Section #).

## How to Install

Standard Install:
```
$ git clone https://github.com/byuitechops/canvas-enroll-students.git
$ cd ./canvas-enroll-students
$ npm i
```

## How to Use
- Run the following command:
```bash
$ npm start
```
- You will receive the following prompts:
1. **Target Canvas course section ID number**: <_Section ID number_>
2. **Path to student CSV list**: <_CSV filepath_> Your CSV should follow the syntax:
  ```csv
  Student,SIS User ID,SIS Login ID
  Alice Tryle,AliceTryle101,AliceTryle
  Bob Tryle,BobTryle101,BobTryle
  Charli Tryle,CharliTryle101,CharliTryle
  David Tryle,DavidTryle101,DavidTryle
  Eugene Tryle,EugeneTryle101,EugeneTryle
  Faith Tryle,FaithTryle101,FaithTryle
  Guy Tryle,GuyTryle101,GuyTryle
  Hope Tryle,HopeTryle101,HopeTryle
  Ima Tryle,ImaTryle101,ImaTryle

  ```
  **Note**: *SIS User ID is a student's I-Number*

- A report will be written to **./reports/SECTION_ID_NUMBER-enrollments-YYYYMMDD_KKMM.json** with the following syntax:
  ```json
  {
      "success": [
          {
              "student": {
                  "Student": "Ima Tryle",
                  "SIS User ID": "ImaTryle101",
                  "SIS Login ID": "ImaTryle"
              },
              "message": "Successful Enrollment"
          }
      ],
      "failure": [
          {
              "student": {
                  "Student": "Alice Tryle",
                  "SIS User ID": "AliceTryle101",
                  "SIS Login ID": "AliceTryle"
              },
              "err": "POST ... failed with: STATUS CODE ...",
              "message": "Error Enrolling"
          }
      ]
  }
  ```


<sub>This document modified: 2019 April 09, 02:30 PM using document generator version: 1.0.0<sub>