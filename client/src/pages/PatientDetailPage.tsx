// PatientDetailPage - Shows detailed info for a single patient
// Accessed by clicking on a patient from the "My Patients list" page

import { useParams } from "react-router-dom";
import "../index.css";

// Layout components
import Sidebar from "../components/layout/Sidebar";

// Patient detail components
import PatientHeader from "../components/patient-detail/PatientHeader";
import AlertsBanner from "../components/patient-detail/AlertsBanner";
import ClinicalNotes from "../components/patient-detail/ClinicalNotes";
import AISummary from "../components/patient-detail/AISummary";
import OriginalIntake from "../components/patient-detail/OriginalIntake";

// Mock patient data for testing UI - to be implemented later
const mockPatientData: Record<
  string,
  {
    name: string;
    gender: string;
    age: number;
    email: string;
    phone: string;
    alerts: string[];
    intakeDate: string;
    chiefComplaint: string;
    medications: string[];
    keyHistory: string;
    lifestyleFactors: string;
  }
> = {
  "1": {
    name: "Michael Chen",
    gender: "Male",
    age: 42,
    email: "mikechen88@gmail.com",
    phone: "647-555-5678",
    alerts: [],
    intakeDate: "Oct 15, 2024",
    chiefComplaint:
      "Can't sleep well. Keeps waking up around 3am and can't fall back asleep. Work is stressful.",
    medications: ["Melatonin", "Multivitamin"],
    keyHistory: "Nothing major. No allergies.",
    lifestyleFactors:
      "Software developer, works from home. Goes to gym 3x a week. Drinks coffee but not too much.",
  },
  "2": {
    name: "Sarah Jenkins",
    gender: "Female",
    age: 34,
    email: "sarah.j@gmail.com",
    phone: "416-555-1234",
    alerts: [
      "Dizziness and shortness of breath - needs follow up",
      "Low iron - should start supplements",
    ],
    intakeDate: "Nov 10, 2024",
    chiefComplaint:
      "Really tired all the time for the past few months. Also having stomach issues like bloating and constipation. Says she feels exhausted even after sleeping.",
    medications: ["Vitamin D", "Birth control", "Advil sometimes"],
    keyHistory:
      "Had anemia before in 2019. Mom has thyroid problems. Had appendix removed when she was 12.",
    lifestyleFactors:
      "Office job, works long hours. Drinks a lot of coffee. Doesn't eat breakfast. Goes to gym once or twice a week. Stressed from work.",
  },
  "3": {
    name: "Emma Wilson",
    gender: "Female",
    age: 28,
    email: "emmaw@hotmail.com",
    phone: "416-555-9012",
    alerts: ["Low iron levels - possible anemia"],
    intakeDate: "Nov 8, 2024",
    chiefComplaint:
      "Had anemia before, now getting dizzy and out of breath even from walking up stairs.",
    medications: ["Iron pills", "Vitamin C"],
    keyHistory:
      "Anemia diagnosed 2 years ago. Has been vegetarian for a while.",
    lifestyleFactors:
      "Works as a teacher so on her feet all day. Does yoga. Vegetarian.",
  },
  "4": {
    name: "Liam Patel",
    gender: "Male",
    age: 38,
    email: "liamp@outlook.com",
    phone: "905-555-3456",
    alerts: [],
    intakeDate: "Nov 1, 2024",
    chiefComplaint:
      "Stomach always feels bloated. Sometimes constipated, sometimes not. Brain fog after eating.",
    medications: ["Probiotic"],
    keyHistory: "Lactose intolerant. Otherwise healthy.",
    lifestyleFactors:
      "Works in marketing, pretty stressful. Eats out a lot. Doesn't really exercise.",
  },
  "5": {
    name: "David Thompson",
    gender: "Male",
    age: 45,
    email: "dthompson@gmail.com",
    phone: "416-555-7890",
    alerts: ["Taking ibuprofen daily - check for stomach issues"],
    intakeDate: "Nov 5, 2024",
    chiefComplaint:
      "Headaches almost every day for past 2 weeks. Also neck is really stiff. Been taking ibuprofen daily.",
    medications: ["Ibuprofen daily", "Fish oil"],
    keyHistory: "Had a car accident 5 years ago. Some whiplash back then.",
    lifestyleFactors:
      "Works at a desk all day. Doesn't exercise much. Looks at screens a lot.",
  },
  "6": {
    name: "Emily Watson",
    gender: "Female",
    age: 31,
    email: "emilyw@gmail.com",
    phone: "647-555-2345",
    alerts: [],
    intakeDate: "Oct 20, 2024",
    chiefComplaint:
      "Follow up for anxiety. Feeling much better since starting the new supplements. Sleep is improving too.",
    medications: ["Magnesium", "Ashwagandha", "B complex"],
    keyHistory: "Anxiety for past 3 years. No other major issues.",
    lifestyleFactors:
      "Works in HR. Meditates sometimes. Trying to exercise more. Sleeps 7-8 hours now.",
  },
};

function PatientDetailPage() {
  // Get patient ID from URL
  const { id } = useParams();

  // Get patient data based on ID (default to first patient if not found)
  const patient = mockPatientData[id || "1"] || mockPatientData["1"];

  return (
    <div className="flex min-h-screen">
      {/* the doctor name prop will change once the login system is implemented, the user credential will be passed through doctorName prop */}
      <Sidebar doctorName="Dr. Rey" doctorTitle="NATUROPATHIC ND" />

      {/* Main content area */}
      <div className="flex-1 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sage-50/50 to-transparent pointer-events-none"></div>

        {/* Page content */}
        <div className="relative">
          {/* Patient header with name and info */}
          <PatientHeader
            name={patient.name}
            gender={patient.gender}
            age={patient.age}
            email={patient.email}
            phone={patient.phone}
          />

          {/* Alerts banner */}
          <AlertsBanner alerts={patient.alerts} />

          {/* Detailed view of a patient section */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left column - Clinical Notes */}
              <div>
                <ClinicalNotes />
              </div>

              {/* Right column - AI Summary and Original Intake */}
              <div>
                <AISummary
                  intakeDate={patient.intakeDate}
                  chiefComplaint={patient.chiefComplaint}
                  medications={patient.medications}
                  keyHistory={patient.keyHistory}
                  lifestyleFactors={patient.lifestyleFactors}
                />
                <OriginalIntake />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailPage;
