# Lab 7 — Part 1

Student management system made by modifying the supplied `06-student-api/01-memory-api.js`. The exact extracted starter is retained in `original/01-memory-api.js`. The solution keeps the starter's built-in HTTP server, JSON responses, arrays and generated numeric IDs. No database or external packages are added.

Run `npm start` with Node.js 22 or newer. Base URL: `http://localhost:3004`. Run `npm test` to verify the four modules. Data resets when the server stops, as required for the in-memory task.

Each resource supports POST and GET on `/resource`, and GET, PUT and DELETE on `/resource/:id`. PUT sends all listed fields. Send `Content-Type: application/json`.

| Resource | Example POST / PUT body |
| --- | --- |
| students | `{"name":"Ali","rollNumber":"241851"}` |
| teachers | `{"name":"Sara","subject":"CS301"}` |
| attendance | `{"studentId":1,"date":"2026-10-25","status":"present"}` |
| marks | `{"studentId":1,"subject":"CS301","score":8,"maxScore":10}` |

Create a student before their attendance or marks. Attendance status is present, absent or late. Delete related attendance/marks before deleting a student. IDs are assigned automatically. Missing records return 404, invalid fields/JSON return 400, successful creation returns 201, reads/updates return 200 and deletion returns 204.

Example in PowerShell:

```powershell
Invoke-RestMethod http://localhost:3004/students -Method Post -ContentType application/json -Body '{"name":"Ali","rollNumber":"241851"}'
Invoke-RestMethod http://localhost:3004/students
Invoke-RestMethod http://localhost:3004/students/1 -Method Put -ContentType application/json -Body '{"name":"Ali Khan","rollNumber":"241851"}'
Invoke-RestMethod http://localhost:3004/students/1 -Method Delete
```
