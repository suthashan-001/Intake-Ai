// ai-summary.ts
// sends patient info to gemini and gets back a summary

import { GoogleGenerativeAI } from "@google/generative-ai";

// types for the summary
interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose?: string;
}

// medical categories
interface SystemsReview {
  cardiovascular?: string;
  respiratory?: string;
  gastrointestinal?: string;
  musculoskeletal?: string;
  neurological?: string;
  endocrine?: string;
  immunological?: string;
  dermatological?: string;
  psychological?: string;
  other?: string;
}

interface RedFlag {
  flag: string;
  severity: "high" | "medium" | "low";
  recommendation: string;
}

export interface SummaryData {
  chiefComplaint: string;
  medications: Medication[];
  systemsReview: SystemsReview;
  relevantHistory: string;
  lifestyle: string;
  redFlags: RedFlag[];
  hasRedFlags: boolean;
  redFlagCount: number;
}

// what we get from the form
interface IntakeResponses {
  chiefComplaint?: string;
  symptoms?: string;
  symptomDuration?: string;
  medications?: string;
  supplements?: string;
  allergies?: string;
  medicalHistory?: string;
  familyHistory?: string;
  lifestyle?: string;
  goals?: string;
  lastName?: string;
  dateOfBirth?: string;
  genderIdentity?: string;
}

// gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// the prompt we send
function makePrompt(data: IntakeResponses): string {
  return `Summarize this patient intake for a doctor. Return ONLY JSON, nothing else.

Patient says: ${data.chiefComplaint || "nothing"}
Symptoms: ${data.symptoms || "none"}
Duration: ${data.symptomDuration || "unknown"}
Meds: ${data.medications || "none"}
Supplements: ${data.supplements || "none"}
Allergies: ${data.allergies || "none"}
History: ${data.medicalHistory || "none"}
Family history: ${data.familyHistory || "none"}
Lifestyle: ${data.lifestyle || "unknown"}

Check for red flags (serious stuff like chest pain, suicidal thoughts, etc).

Return JSON like this:
{
  "chiefComplaint": "short summary",
  "medications": [{"name": "", "dosage": "", "frequency": "", "purpose": ""}],
  "systemsReview": {
    "cardiovascular": "",
    "respiratory": "",
    "gastrointestinal": "",
    "musculoskeletal": "",
    "neurological": "",
    "endocrine": "",
    "immunological": "",
    "dermatological": "",
    "psychological": "",
    "other": ""
  },
  "relevantHistory": "",
  "lifestyle": "",
  "redFlags": [{"flag": "", "severity": "high/medium/low", "recommendation": ""}]
}`;
}

// main function
export async function generateSummary(
  data: IntakeResponses
): Promise<SummaryData> {
  console.log("calling gemini...");

  const result = await model.generateContent(makePrompt(data));
  let text = result.response.text().trim();

  // remove markdown if gemini added it
  if (text.startsWith("```")) {
    text = text.replace(/```json\n?/, "").replace(/```\n?$/, "");
  }

  const parsed = JSON.parse(text);

  // make sure everything has a value
  const summary: SummaryData = {
    chiefComplaint: parsed.chiefComplaint || "unknown",
    medications: parsed.medications || [],
    systemsReview: {
      cardiovascular: parsed.systemsReview?.cardiovascular || "not reported",
      respiratory: parsed.systemsReview?.respiratory || "not reported",
      gastrointestinal:
        parsed.systemsReview?.gastrointestinal || "not reported",
      musculoskeletal: parsed.systemsReview?.musculoskeletal || "not reported",
      neurological: parsed.systemsReview?.neurological || "not reported",
      endocrine: parsed.systemsReview?.endocrine || "not reported",
      immunological: parsed.systemsReview?.immunological || "not reported",
      dermatological: parsed.systemsReview?.dermatological || "not reported",
      psychological: parsed.systemsReview?.psychological || "not reported",
      other: parsed.systemsReview?.other || "not reported",
    },
    relevantHistory: parsed.relevantHistory || "none",
    lifestyle: parsed.lifestyle || "none",
    redFlags: parsed.redFlags || [],
    hasRedFlags: parsed.redFlags?.length > 0,
    redFlagCount: parsed.redFlags?.length || 0,
  };

  console.log("done, found " + summary.redFlagCount + " red flags");
  return summary;
}

// test function
export async function testSummaryGeneration() {
  const test = {
    chiefComplaint: "tired all the time",
    symptoms: "no energy, headaches",
    symptomDuration: "few months",
    medications: "thyroid pill",
    medicalHistory: "hypothyroid",
    lifestyle: "dont sleep much, stressed",
  };

  const result = await generateSummary(test);
  console.log(result);
}
