# Project Capture Document for Canvas Enroll Students
#### *Author: Seth Bolander*
#### *Stakeholder(s): Arlen Wilcock*
#### *Date: 2019 April 09, 02:30 PM*

## Background

Students need to be enrolled into courses for various purposes. The initial need was that importing a gradebook CSV into Canvas' gradebook requires the students be enrolled in the courses beforehand.
*Note: This project will only deal with the enrolling part of projects that require students to be enrolled into Canvas courses. It would not handle gradebooks or other project outcomes beside enrollment.*

-----

## Definition of Done

The program will take a list of Students and, using API calls, enroll them into the desired section of a course.

-----

# Requirements

### General Requirements

### Input Requirements

#### Source of Inputs

Inputs would be given based on need and could come from a stakeholder directly or, for the initial problem, come from a Brightspace course's section. Input could come from a larger project implementing this tool as a module so long as it comes in the correct forms.

#### Definition of Inputs

- **Canvas Course Section ID**: <_Course ID Number_>
- **Students to be enrolled**: <_CSV File_>
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
  Note: *SIS User ID is a student's I-Number*

---

### Output Requirements
#### Destination

Students will be directly enrolled into Canvas and a report will be written to the current directory if specified. This report is purely for the developer to ensure that *unsuccessful enrollments* can be run through the program again, or enrolled by hand.

#### Definition of Outputs

- **Output report**: <_JSON file_>
  ```json
  {
      "success": [
          {
            "user_id": "ImaTryle101",
            "type": "StudentEnrollment",
            "enrollment_state": "active",
            "notify": false
          }
      ],
      "failure": [
          {
            "user_id": "AliceTryle101",
            "type": "StudentEnrollment",
            "enrollment_state": "active",
            "notify": false
          }
      ]
  }
  ```

---

### User Interface

#### Type:

CLI (with args?).

-----

## Expectations

### Timeline

### Best Mode of Contact

### Next Meeting


### Action Items
<!-- Recap Meeting -->
#### TechOps
#### Stakeholder

-----

#### *Approved By:* Aaron Shiffler
#### *Approval Date:* 11 April 2019
