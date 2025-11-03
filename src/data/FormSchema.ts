export type QuestionOption = {
  value: string;
  label: string;
};

export type Question = {
  id: number | string;
  label: string;
  type: "text" | "radio" | "select";
  options?: QuestionOption[];
  dependsOn?: { questionId: number; value: any };
  required?: boolean;
};

export const formSchema: Question[] = [
  { id: 'clientId', label: "Client ID", type: "text", required: true },
  { id: 'clientName', label: "Client Name", type: "text", required: true },
  { id: 3, label: "Who is the primary contact for the books and bookkeeping questions?", type: "text" },
  { id: 4, label: "What is his/her email address?", type: "text" },
  { id: 5, label: "What is his/her phone number?", type: "text" },
  { id: 6, label: "Who is the primary contact for high-level questions? (If same as above, leave blank.)", type: "text" },
  { id: 7, label: "When do we typically receive the client information?", type: "text" },
  { id: 8, label: "When do we typically target filing the return?", type: "text" },
  {
    id: 9,
    label: "Return Type",
    type: "radio",
    required: true,
    options: [
      { value: "1065", label: "1065" },
      { value: "1120", label: "1120" },
      { value: "1120S", label: "1120S" },
      { value: "1040", label: "1040" },
      { value: "1041", label: "1041" },
    ],
  },
  {
    id: 10,
    label: "Does the client require financials?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 11,
    label: "Industry",
    type: "radio",
    options: [
      { value: "retail", label: "Retail" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "real_estate", label: "Real Estate" },
      { value: "service_business", label: "Service Business" },
      { value: "other", label: "Other" },
    ],
  },
  { id: 12, label: "What does the client sell?", type: "text", dependsOn: { questionId: 11, value: "retail" } },
  { id: 13, label: "What does the client manufacture?", type: "text", dependsOn: { questionId: 11, value: "manufacturing" } },
  { id: 14, label: "What is the client's service business?", type: "text", dependsOn: { questionId: 11, value: "service_business" } },
  { id: 15, label: "Describe the business briefly:", type: "text", dependsOn: { questionId: 11, value: "other" } },
  {
    id: 16,
    label: "Inventory",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 17,
    label: "Entity subject to 263A?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 18,
    label: "Do we need to review the percentages, or comfortable with SALY?",
    type: "radio",
    options: [
      { value: "review", label: "Need to Review" },
      { value: "saly", label: "SALY" },
    ],
  },
  {
    id: 19,
    label: "Client Software",
    type: "select",
    options: [
      { value: "qbo", label: "QBO" },
      { value: "qb_desktop", label: "QB Desktop" },
      { value: "acumatica", label: "Acumatica" },
      { value: "other", label: "Other" },
    ],
  },
  { id: 20, label: "Where are client logins saved? (Necessary for client books, state logins, etc.)", type: "text" },
  { id: 21, label: "What was the tax prep process in 2024?", type: "text" },
  { id: 22, label: "What was 2024 Revenue?", type: "text" },
  {
    id: 23,
    label: "Does client do any state PTETs?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  { id: 24, label: "Who handles elections and estimates?", type: "text" },
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
    type: "select",
    options: [
      { value: "rely_on_client", label: "Rely on client categorization" },
      { value: "expense_below_2500", label: "Analyze and expense below $2,500" },
      { value: "different_method", label: "Analyze, but use different method" },
    ],
  },
  {
    id: 28,
    label: "Who files Payroll Tax?",
    type: "select",
    options: [
      { value: "roth", label: "Roth" },
      { value: "client", label: "Client" },
      { value: "outside_company", label: "Outside Company" },
    ],
  },
  { id: 29, label: "If payroll is filed by third party, from whom do we receive the payroll report?", type: "text" },
  {
    id: 30,
    label: "Does Roth file the 1099s for the client?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 31,
    label: "Does the entity file Sales Tax?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 32,
    label: "If entity does file sales tax, is it a monthly, quarterly or annual filer?",
    type: "select",
    options: [
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "annual", label: "Annual" },
    ],
  },
  {
    id: 33,
    label: "Who files the sales tax returns?",
    type: "select",
    options: [
      { value: "client", label: "Client" },
      { value: "roth_tax", label: "Roth - Tax" },
      { value: "roth_cas", label: "Roth - CAS" },
    ],
  },
  {
    id: 34,
    label: "Are there foreign filings?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 35,
    label: "Are there any open notices/audits/tax issues to be aware of?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  { id: 36, label: "Give a brief overview of the issue:", type: "text" },
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

export default formSchema;
