export type QuestionOption = {
  value: string;
  label: string;
  // optional: jump to another question id (used by "Go to X" in your PDF)
  jumpTo?: number | string;
};

export type QuestionDependency = {
  questionId: number | string;
  value: any | any[];
};

export type Question = {
  id: number | string;
  label: string;
  type: "text" | "radio" | "select";
  options?: QuestionOption[];
  dependsOn?: QuestionDependency[];
  required?: boolean;
};

export const formSchema: Question[] = [
  { id: 'clientId', label: "Client ID", type: "text", required: true },
  { id: 'clientName', label: "Client Name", type: "text", required: true },
  { id: 3, label: "Who is the primary contact for the books and bookkeeping questions?", type: "text" },
  { id: 4, label: "What is his/her email address?", type: "text" },
  { id: 5, label: "What is his/her phone number?", type: "text" },
  { id: 6, label: "Who is the primary contact for high-level questions? (If same as above, leave blank.)", type: "text" },
  {
    id: 7,
    label: "When do we typically receive the client information?",
    type: "radio",
    options: [
      { value: "january", label: "January" },
      { value: "february", label: "February" },
      { value: "march", label: "March" },
      { value: "april", label: "April" },
      { value: "may", label: "May" },
      { value: "june", label: "June" },
      { value: "july", label: "July" },
      { value: "august", label: "August" },
      { value: "september", label: "September" },
    ],
  },
  {
    id: 8,
    label: "When do we typically target filing the return?",
    type: "radio",
    options: [
      { value: "january", label: "January" },
      { value: "february", label: "February" },
      { value: "march", label: "March" },
      { value: "april", label: "April" },
      { value: "may", label: "May" },
      { value: "june", label: "June" },
      { value: "july", label: "July" },
      { value: "august", label: "August" },
      { value: "september", label: "September" },
    ],
  },


  // RETURN TYPE — PDF: "1040 Go to 34" and "1041 Go to 34"
  {
    id: 9,
    label: "Return Type",
    type: "radio",
    required: true,
    options: [
      { value: "1065", label: "1065" },
      { value: "1120", label: "1120" },
      { value: "1120S", label: "1120S" },
      { value: "1040", label: "1040", jumpTo: 34 },
      { value: "1041", label: "1041", jumpTo: 34 },
    ],
  },

  // FINANCIALS
  {
    id: 10,
    label: "Does the client require financials?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },

  // INDUSTRY (PDF notes: Real Estate -> go to 19)
  {
    id: 11,
    label: "Industry",
    type: "radio",
    options: [
      { value: "retail", label: "Retail" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "real_estate", label: "Real Estate", jumpTo: 19 },
      { value: "service_business", label: "Service Business" },
      { value: "other", label: "Other" },
    ],
  },

  { id: 12, label: "What does the client sell?", type: "text", dependsOn: [{ questionId: 11, value: "retail" }] },
  { id: 13, label: "What does the client manufacture?", type: "text", dependsOn: [{ questionId: 11, value: "manufacturing" }] },
  { id: 14, label: "What is the client's service business?", type: "text", dependsOn: [{ questionId: 11, value: "service_business" }] },
  { id: 15, label: "Describe the business briefly:", type: "text", dependsOn: [{ questionId: 11, value: "other" }] },

  // Inventory (Q16) — uses actual choices from your PDF
  {
    id: 16,
    label: "Inventory",
    type: "radio",
    dependsOn: [{ questionId: 11, value: ["manufacturing", "retail"] }],
    options: [
      { value: "separate_report", label: "Separate Report" },
      { value: "per_client_accounting_system", label: "Per Client Accounting System" },
    ],
  },

  // Q17 & Q18 should show when Inventory indicates there IS inventory.
  // We consider the first four choices to imply inventory exists.
  {
    id: 17,
    label: "Entity subject to 263A?",
    type: "radio",
    dependsOn: [{ questionId: 11, value: ["manufacturing", "retail"] }],
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },

  {
    id: 18,
    label: "Do we need to review the percentages, or comfortable with SALY?",
    type: "radio",
    dependsOn: [{ questionId: 17, value: ["yes"] }],
    options: [
      { value: "review", label: "Need to Review" },
      { value: "saly", label: "SALY" },
    ],
  },

  // Q19 onward (Client Software etc.) — unchanged
  {
    id: 19,
    label: "Client Software",
    type: "radio",
    options: [
      { value: "qbo", label: "QBO" },
      { value: "qb_desktop", label: "QB Desktop" },
      { value: "acumatica", label: "Acumatica" },
      { value: "other", label: "Other" },
    ],
  },

  { id: 20, label: "Where are client logins saved? (Necessary for client books, state logins, etc.)", type: "text" },
  {
    id: 21,
    label: "What was the tax prep process in 2024?",
    type: "radio",
    options: [
      { value: "TB", label: "TB" },
      { value: "WUTB", label: "WUTB" },
      { value: "other", label: "Other" },
    ],
  },

  {
    id: 22,
    label: "What was 2024 Revenue?",
    type: "radio",
    options: [
      { value: "under_1m", label: "< $1 million" },
      { value: "1_to_5m", label: "$1 – $5 million" },
      { value: "5_to_10m", label: "$5 – $20 million" },
      { value: "20_to_50m", label: "$20 – $50 million" },
      { value: "over_50m", label: "$50million+" },
    ],
  },


  // PTETs
  {
    id: 23,
    label: "Does client do any state PTETs?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 24, label: "Who handles elections and estimates?",
    type: "radio",
    options: [
      { value: "roth", label: "Roth" },
      { value: "client", label: "Client" },
    ],
    dependsOn: [{ questionId: 23, value: ["yes"] }],
  },
  { id: 25, label: "List any unique AJEs (besides standard payroll/bank AJEs):", type: "text" },

  {
    id: 26,
    label: "Do we send our AJEs to the client to update their books?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },

  {
    id: 27,
    label: "For R&M expensing/capitalization, what is our approach?",
    type: "radio",
    options: [
      { value: "rely_on_client", label: "Rely on client categorization" },
      { value: "expense_below_2500", label: "Analyze and expense below $2,500" },
      { value: "different_method", label: "Analyze, but use different method" },
    ],
  },

  {
    id: 28,
    label: "Who files Payroll Tax?",
    type: "radio",
    options: [
      { value: "roth", label: "Roth" },
      { value: "outside_company", label: "Outside Company" },
    ],
  },

  {
    id: 29,
    label: "If payroll is filed by third party, from whom do we receive the payroll report?",
    type: "radio",
      options: [
      { value: "client", label: "Client" },
      { value: "third_party", label: "Directly from third party" },
    ],
    dependsOn: [{ questionId: 28, value: "outside_company" }]
  },
  {
    id: 30,
    label: "Does Roth file the 1099s for the client?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },

  // SALES TAX — PDF: "No -> Go to 34"
  {
    id: 31,
    label: "Does the entity file Sales Tax?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No", jumpTo: 34 },
    ],
  },
  {
    id: 32,
    label: "If entity does file sales tax, is it a monthly, quarterly or annual filer?",
    type: "radio",
    options: [
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "annual", label: "Annual" },
      { value: "prompTax", label: "PrompTax" },
    ],
  },
  {
    id: 33,
    label: "Who files the sales tax returns?",
    type: "radio",
    options: [
      { value: "client", label: "Client" },
      { value: "roth_tax", label: "Roth - Tax" },
      { value: "roth_cas", label: "Roth - CAS" },
    ],
  },

  // FOREIGN FILINGS (target of many jumps)
  {
    id: 34,
    label: "Are there foreign filings?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "maybe, need to confirm with client", label: "Maybe, need to confirm with client" },
    ],
  },

  {
    id: 35,
    label: "Are there any open notices/audits/tax issues to be aware of?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No", jumpTo: 37 },
    ],
  },

  {
    id: 36,
    label: "Give a brief overview of the issue:",
    type: "text",
    dependsOn: [
      { questionId: 35, value: "yes" },
    ],
  },

  {
    id: 37,
    label: "States",
    type: "select",
    options: [
      { value: "alabama", label: "Alabama" },
      { value: "alaska", label: "Alaska" },
      { value: "arizona", label: "Arizona" },
      { value: "arkansas", label: "Arkansas" },
      { value: "california", label: "California" },
      { value: "colorado", label: "Colorado" },
      { value: "connecticut", label: "Connecticut" },
      { value: "delaware", label: "Delaware" },
      { value: "district_of_columbia", label: "District of Columbia" },
      { value: "florida", label: "Florida" },
      { value: "georgia", label: "Georgia" },
      { value: "hawaii", label: "Hawaii" },
      { value: "idaho", label: "Idaho" },
      { value: "illinois", label: "Illinois" },
      { value: "indiana", label: "Indiana" },
      { value: "iowa", label: "Iowa" },
      { value: "kansas", label: "Kansas" },
      { value: "kentucky", label: "Kentucky" },
      { value: "louisiana", label: "Louisiana" },
      { value: "maine", label: "Maine" },
      { value: "maryland", label: "Maryland" },
      { value: "massachusetts", label: "Massachusetts" },
      { value: "michigan", label: "Michigan" },
      { value: "minnesota", label: "Minnesota" },
      { value: "mississippi", label: "Mississippi" },
      { value: "missouri", label: "Missouri" },
      { value: "montana", label: "Montana" },
      { value: "nebraska", label: "Nebraska" },
      { value: "nevada", label: "Nevada" },
      { value: "new_hampshire", label: "New Hampshire" },
      { value: "new_jersey", label: "New Jersey" },
      { value: "new_mexico", label: "New Mexico" },
      { value: "new_york", label: "New York" },
      { value: "north_carolina", label: "North Carolina" },
      { value: "north_dakota", label: "North Dakota" },
      { value: "ohio", label: "Ohio" },
      { value: "oklahoma", label: "Oklahoma" },
      { value: "oregon", label: "Oregon" },
      { value: "pennsylvania", label: "Pennsylvania" },
      { value: "rhode_island", label: "Rhode Island" },
      { value: "south_carolina", label: "South Carolina" },
      { value: "south_dakota", label: "South Dakota" },
      { value: "tennessee", label: "Tennessee" },
      { value: "texas", label: "Texas" },
      { value: "utah", label: "Utah" },
      { value: "vermont", label: "Vermont" },
      { value: "virginia", label: "Virginia" },
      { value: "washington", label: "Washington" },
      { value: "west_virginia", label: "West Virginia" },
      { value: "wisconsin", label: "Wisconsin" },
      { value: "wyoming", label: "Wyoming" },
    ],
  },
];

