// FormRenderer.tsx
import { useState } from "react";
import { QuestionItem } from "./Question";
import { formSchema, type Question } from "../data/FormSchema";

export function FormRenderer({
    initialData = {},
    onSubmit,
}: {
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void;
})
{
    const [answers, setAnswers] = useState<Record<string, any>>(initialData);

    const handleChange = (questionId: number, val: any) =>
    {
        setAnswers((prev) => ({ ...prev, [questionId]: val }));
    };

    const handleSaveDraft = () =>
    {
        onSubmit({ ...answers, status: "draft", updated_at: new Date().toISOString() });
    };

    const handleSubmitAll = () =>
    {
        onSubmit({ ...answers, status: "submitted", updated_at: new Date().toISOString() });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-4 p-4">
            {formSchema.map((q: Question, idx: number) =>
            {
                if (q.dependsOn)
                {
                    const val = answers[q.dependsOn.questionId];
                    if (val !== q.dependsOn.value) return null;
                }
                return (
                    <QuestionItem
                        key={q.id}
                        index={idx}
                        question={q}
                        value={answers[q.id]}
                        onChange={(val) => handleChange(q.id, val)}
                    />
                );
            })}

            <div className="flex gap-4 mt-6">
                {initialData.status === "draft" ?
                    <>
                        <button onClick={handleSaveDraft} className="bg-gray-300 text-black rounded px-4 py-2 cursor-pointer hover:opacity-85 transition-all duration-200">
                            Save Draft
                        </button>
                        <button onClick={handleSubmitAll} className="bg-green-600 text-white rounded px-4 py-2 cursor-pointer hover:opacity-85 transition-all duration-200">
                            Submit All
                        </button>
                    </>
                    :
                    <button className="bg-gray-300 text-black rounded px-4 py-2 cursor-pointer hover:opacity-85 transition-all duration-200">
                        Download
                    </button>
                }
            </div>
        </div>
    );
}
