### GET endpoints

##### /api/v0/list/all

Lists all students

```json
[
    {
        "student_UID": 1,
        "student_name": "Bob",
        "student_ID": "9999",
        "student_class_UID": 1,
        "spart_pro": 10,
        "spart_emp": 10,
        "spart_opt": 10,
        "spart_inn": 10,
        "spart_per": 10,
        "spart_int": 10
    }
]
```

##### /api/v0/search/:pattern

Searches students and returns all students who have **:pattern** in their name. See */api/v0/list/all* formatting.

##### /api/v0/list/classes

Lists all classes.

```JSON
[
    {
        "class_UID": 1,
        "class_code": "ECE300-01-1920",
        "class_name": "Programming 5"
    },
    {
        "class_UID": 2,
        "class_code": "ECE700-01-1920",
        "class_name": "Programming 17"
    }
]
```

##### /api/v0/class/:class

Lists all students in class by *class_code* in **:class**. See */api/v0/list/all* formatting.

##### /api/v0/student/:student

Returns a single student's information. **:student** is the student's ID number. See */api/v0/list/all* formatting (returns only one student).

### POST endpoints

##### /api/v0/student/

Adds a student to the database.
Must contain *form* data and the body must contain:
**studentID**: The student's ID number
**studentname**: The complete name of the student
