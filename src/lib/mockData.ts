export const chartData = [
  { name: "Jan", revenue: 4000, expenses: 2400 },
  { name: "Feb", revenue: 3000, expenses: 1398 },
  { name: "Mar", revenue: 2000, expenses: 9800 },
  { name: "Apr", revenue: 2780, expenses: 3908 },
  { name: "May", revenue: 1890, expenses: 4800 },
  { name: "Jun", revenue: 2390, expenses: 3800 },
  { name: "Jul", revenue: 3490, expenses: 4300 },
];

export const initialInvoices = [
  {
    id: "INV-2026-001",
    client: "Nairobi Academy",
    clientEmail: "finance@nairobiacademy.ac.ke",
    clientPhone: "+254 700 111222",
    clientAddress: "P.O. Box 12345, Nairobi",
    amount: "450,000",
    rawAmount: 450000,
    status: "Paid",
    date: "Jul 01, 2026",
    dueDate: "Jul 15, 2026",
    lineItems: [
      { description: "Annual Tuition Fee", qty: 10, unitPrice: 40000 },
      { description: "Transport Fee", qty: 10, unitPrice: 5000 }
    ],
    taxRate: 0,
    notes: "Thank you for your business.",
    reminders: [],
  },
  {
    id: "INV-2026-002",
    client: "Tech Solutions Ltd",
    clientEmail: "accounts@techsolutions.co.ke",
    clientPhone: "+254 722 333444",
    clientAddress: "Westlands, Nairobi",
    amount: "85,000",
    rawAmount: 85000,
    status: "Pending",
    date: "Jul 10, 2026",
    dueDate: "Jul 24, 2026",
    lineItems: [
      { description: "Software License", qty: 1, unitPrice: 73275 }
    ],
    taxRate: 16,
    notes: "Payment due in 14 days.",
    reminders: [],
  },
  {
    id: "INV-2026-003",
    client: "St. John's Hospital",
    clientEmail: "billing@stjohns.org",
    clientPhone: "+254 733 555666",
    clientAddress: "Upper Hill, Nairobi",
    amount: "1,250,000",
    rawAmount: 1250000,
    status: "Overdue",
    date: "Jun 01, 2026",
    dueDate: "Jun 15, 2026",
    lineItems: [
      { description: "Medical Equipment Supply", qty: 5, unitPrice: 215517 }
    ],
    taxRate: 16,
    notes: "Please expedite payment.",
    reminders: [{ sentAt: "2026-06-20T10:00:00Z", method: "Email" as const }],
  },
  {
    id: "INV-2026-004",
    client: "Emmanuel Church",
    clientEmail: "admin@emmanuelchurch.or.ke",
    clientPhone: "+254 711 777888",
    clientAddress: "Karen, Nairobi",
    amount: "120,000",
    rawAmount: 120000,
    status: "Paid",
    date: "Jul 05, 2026",
    dueDate: "Jul 19, 2026",
    lineItems: [
      { description: "Event Catering", qty: 1, unitPrice: 120000 }
    ],
    taxRate: 0,
    notes: "Thanks for trusting us with your event.",
    reminders: [],
  },
  {
    id: "INV-2026-005",
    client: "Legal Associates",
    clientEmail: "partners@legalassociates.co.ke",
    clientPhone: "+254 700 999000",
    clientAddress: "CBD, Nairobi",
    amount: "350,000",
    rawAmount: 350000,
    status: "Pending",
    date: "Jul 11, 2026",
    dueDate: "Jul 25, 2026",
    lineItems: [
      { description: "Consultation Retainer", qty: 1, unitPrice: 301724 }
    ],
    taxRate: 16,
    notes: "Monthly retainer fee.",
    reminders: [],
  },
];

export const initialStaffData = [
  { id: "EMP-001", name: "Sarah Kimani", role: "Administrator", gross: 120000, status: "Active" },
  { id: "EMP-002", name: "Dr. Kevin Mburu", role: "Lead Physician", gross: 250000, status: "Active" },
  { id: "EMP-003", name: "Alice Wanjiku", role: "Nurse", gross: 80000, status: "Active" },
  { id: "EMP-004", name: "John Ochieng", role: "Lab Technician", gross: 90000, status: "On Leave" },
];

export const initialInventory = [
  { id: "ITM-001", name: "Amoxicillin 500mg", category: "Medication", qty: 45, minQty: 50, unit: "Boxes", unitCost: 1200, lastUpdated: "Jul 10, 2026" },
  { id: "ITM-002", name: "Paracetamol 1g", category: "Medication", qty: 120, minQty: 50, unit: "Boxes", unitCost: 450, lastUpdated: "Jul 11, 2026" },
  { id: "ITM-003", name: "Surgical Masks", category: "Supplies", qty: 15, minQty: 100, unit: "Packs", unitCost: 800, lastUpdated: "Jul 09, 2026" },
  { id: "ITM-004", name: "Examination Gloves", category: "Supplies", qty: 250, minQty: 100, unit: "Boxes", unitCost: 1500, lastUpdated: "Jul 05, 2026" },
  { id: "ITM-005", name: "Syringes 5ml", category: "Equipment", qty: 85, minQty: 100, unit: "Pcs", unitCost: 200, lastUpdated: "Jul 10, 2026" },
];

export const initialMpesaTransactions = [
  { id: "MP-A1B2C3", amount: 450000, sender: "John Doe", date: "Jul 10, 2026", status: "Unmatched", matchScore: "High", invoice: undefined },
  { id: "MP-X9Y8Z7", amount: 120000, sender: "Jane Smith", date: "Jul 05, 2026", status: "Matched", matchScore: undefined, invoice: "INV-2026-004" }
];

export const initialBankTransactions = [
  { id: "TRX-9988", amount: 1250000, sender: "St. John's Hosp", date: "Jul 11, 2026", status: "Unmatched" },
  { id: "TRX-9989", amount: 85000, sender: "Tech Solutions", date: "Jul 12, 2026", status: "Unmatched" }
];
