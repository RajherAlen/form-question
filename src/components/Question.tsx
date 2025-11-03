// Question.tsx
import type { Question } from "../data/FormSchema";

export function QuestionItem({
  question,
  value,
  index,
  onChange,
  disabled
}: {
  question: Question;
  value: any;
  index: number;
  onChange: (val: any) => void;
  disabled?: boolean
}) {
  if (question.type === "text") {
    return (
      <div className="flex flex-col space-y-1">
        <label className="text-sm text-gray-800">
          {index + 1}. {question.label}
        </label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="border rounded border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-6"
        />
      </div>
    );
  }

  if (question.type === "radio") {
    return (
      <div className="flex flex-col space-y-1">
        <label className="text-sm text-gray-800">
          {index + 1}. {question.label}
        </label>
        <div className="flex flex-col pl-6 gap-4 mt-1">
          {question.options?.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 text-gray-800 text-sm ${
                disabled  ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name={String(question.id)}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                disabled={disabled}
                className="accent-blue-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <div className="flex flex-col space-y-1">
        <label className="text-sm text-gray-800">
          {index + 1}. {question.label}
        </label>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="border rounded px-3 py-2 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-6"
        >
          <option value="">Select...</option>
          {question.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return null;
}
