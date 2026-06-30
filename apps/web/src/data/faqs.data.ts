export type TFaq = {
  id: string;
  question: string;
  answer: string | string[];
  type: "text" | "list";
};

export const FAQS_DATA: TFaq[] = [
  {
    id: "1",
    question: "What is My Doctor?",
    answer:
      "My Doctor is an online platform for integrated healthcare services, which is operated by My Doctor Limited and used by doctors, patients, clinics and hospitals.",
    type: "text",
  },
  {
    id: "2",
    question: "What Services do My Doctor Provide?",
    type: "list",
    answer: [
      "Doctors Appointment.",
      "Telemedicine (Doctor consultation over video/voice call).",
      "Hospital Information.",
      "Diagnostic Information.",
      "Ambulance Service.",
      "Diagnostic Home Service.",
      "Domiciliary & Physiotherapy Services.",
      "Medical Instruments Rental.",
      "Sample collection for Diagnostics.",
      "Medical Tourism Services.",
    ],
  },
  {
    id: "3",
    question: "How much do doctors' consultations on My Doctor cost?",
    type: "text",
    answer:
      "The fee for consultations is decided by the doctor. We have no control over the price.",
  },
  {
    id: "4",
    question:
      "I don't know a lot about technology. What shall I do to get a doctor's appointment?",
    type: "text",
    answer:
      "Usability has been our key area of attention. To schedule a doctor's appointment, simply use our search option and enter the name of the physician, their area of expertise, or the illness you have. Click the appointment button and follow the platform's instructions.",
  },
  {
    id: "5",
    question: "Do you provide Ambulance services outside of Dhaka?",
    type: "text",
    answer: "Yes. We provide nationwide service.",
  },
  {
    id: "6",
    question: "What type of ambulance does My Doctor Provide?",
    type: "list",
    answer: [
      "Basic / No-Ac Ambulance service",
      "Life Support / ICU Ambulance service",
      "Freezing / Mortuary Ambulance service",
      "Neonatal / NICU Ambulance service",
      "Patient Transport Vehicle",
      "Air Ambulance service",
    ],
  },
  {
    id: "7",
    question: "Is Telemedicine Right for Me?",
    type: "text",
    answer:
      "It depends on your health condition. Telemedicine makes it possible to access healthcare more swiftly, practically, and locally. It is another option for receiving professional medical care quickly.",
  },
  {
    id: "8",
    question: "Do you offer a free home sample collection?",
    type: "text",
    answer:
      "It depends on the service providers associated with us. Some of them offer free sample collections, some of them don’t.",
  },
  {
    id: "9",
    question: "Can physiotherapy treatment be performed at home?",
    type: "text",
    answer:
      "Yes, nowadays it's so easy to call a physiotherapist at home and take treatment from a registered doctor at your convenient place.",
  },
  {
    id: "10",
    question: "Do you have registered physiotherapists?",
    type: "text",
    answer:
      "Yes, we have qualified male and female physiotherapists qualified to handle both critical and non-critical patients.",
  },
];
