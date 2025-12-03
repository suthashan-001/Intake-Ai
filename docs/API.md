# IntakeAI API

Base URL: `http://localhost:3001/api`

For protected routes add this header:

```
Authorization: Bearer <your_token>
```

---

## Auth Routes

**POST /api/auth/register** - create account

```json
{
  "email": "doc@test.com",
  "password": "pass123",
  "firstName": "Jane",
  "lastName": "Smith",
  "practiceName": "My Clinic"
}
```

**POST /api/auth/login** - login, get tokens

```json
{ "email": "doc@test.com", "password": "pass123" }
```

Returns accessToken and refreshToken

**POST /api/auth/refresh** - get new access token

```json
{ "refreshToken": "your_refresh_token" }
```

**POST /api/auth/logout** - logout

```json
{ "refreshToken": "your_refresh_token" }
```

**GET /api/auth/me** - get current user info (needs auth)

---

## Patient Routes (all need auth)

**GET /api/patients** - list all patients

**POST /api/patients** - create patient

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@test.com",
  "phone": "555-1234"
}
```

**GET /api/patients/:id** - get one patient

**PUT /api/patients/:id** - update patient

**DELETE /api/patients/:id** - delete patient

---

## Intake Link Routes (all need auth)

**POST /api/intake-links** - create intake link for patient

```json
{ "patientId": "patient-id-here" }
```

Returns a URL like `http://localhost:5173/intake/abc123`

**GET /api/intake-links** - list all intake links

**DELETE /api/intake-links/:id** - delete a link

---

## Public Intake Routes (no auth needed)

These are for patients filling out the form.

**GET /api/public/intake/:token** - check if link is valid

**POST /api/public/intake/:token** - submit intake form

```json
{
  "responses": {
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "genderIdentity": "male",
    "chiefComplaint": "headaches for 3 months",
    "symptoms": "pain in temples",
    "symptomDuration": "3 months",
    "medicalHistory": "none",
    "familyHistory": "dad has migraines",
    "lifestyle": "desk job, dont sleep much"
  }
}
```

---

## Summary Routes (all need auth)

**GET /api/intakes** - list all intakes

**GET /api/intakes/:intakeId** - get one intake

**GET /api/intakes/:intakeId/summary** - get the AI summary

**POST /api/intakes/:intakeId/generate-summary** - generate AI summary with Gemini

---

## Health Check

**GET /api/health** - check if server is running

---

## Errors

All errors look like this:

```json
{ "success": false, "error": "explanation of the error }
```
