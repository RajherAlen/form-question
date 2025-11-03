import { useState, useEffect } from "react";
import { QuestionItem } from "./Question";
import { formSchema, type Question } from "../data/FormSchema";
import MainHeader from "./MainHeader";
import { toast } from "react-toastify";

export function FormRenderer({
    initialData = {},
    onSubmit,
}: {
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void;
}) {
    const [answers, setAnswers] = useState<Record<string, any>>(initialData.data || {});

    useEffect(() => {
        if (initialData?.data) setAnswers(initialData.data);
    }, [initialData]);

    const handleChange = (questionId: number | string, val: any) => {

        setAnswers((prev) => ({ ...prev, [questionId]: val }));
    };

    const handleSaveDraft = () => {
        if (!answers?.clientId) {
            toast.warn("Client ID are required!");
            return;
        }
        onSubmit({ ...answers, status: "draft", updated_at: new Date().toISOString() });

        toast.success("Draft saved successfully!");
    };

    const handleSubmitAll = () => {
        // Check required fields
        if (!answers.clientId || !answers.clientName) {
            toast.warn("Client ID and Client Name are required!");
            return;
        }

        onSubmit({ ...answers, status: "submitted", updated_at: new Date().toISOString() });

        toast.success("Form submitted successfully!");
    };

    // --- inside FormRenderer's render area ---
    const visibleQuestions: Question[] = [];
    const skippedIds = new Set<number | string>();

    // build a map from id -> index for quick jump lookups
    const idToIndex = new Map<number | string, number>();
    formSchema.forEach((q, idx) => idToIndex.set(q.id, idx));

    for (let i = 0; i < formSchema.length; i++) {
        const q = formSchema[i];

        // skip if previously marked by a jump
        if (skippedIds.has(q.id)) continue;

        // check dependsOn (AND semantics)
        if (q.dependsOn && q.dependsOn.length > 0) {
            const visible = q.dependsOn.every((cond) => {
                const answer = answers[cond.questionId];
                if (Array.isArray(cond.value)) return cond.value.includes(answer);
                return answer === cond.value;
            });
            if (!visible) continue;
        }

        // add question as visible
        visibleQuestions.push(q);

        // if this question has an answer that maps to an option with jumpTo, mark intermediate questions as skipped
        const currentAnswer = answers[q.id];
        if (q.options && typeof currentAnswer !== "undefined" && currentAnswer !== null) {
            const matchedOption = q.options.find((opt) => opt.value === currentAnswer);
            if (matchedOption && matchedOption.jumpTo) {
                // find index of question with id === jumpTo
                const targetIdx = idToIndex.get(matchedOption.jumpTo);
                if (typeof targetIdx !== "undefined") {
                    // mark all between current pos (i) and targetIdx (exclusive) as skipped
                    const start = i + 1;
                    const end = targetIdx - 1;
                    if (start <= end) {
                        for (let j = start; j <= end; j++) {
                            skippedIds.add(formSchema[j].id);
                        }
                    }
                }
            }
        }
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-screen bg-gray-50">
            <MainHeader headerTitle={initialData.data ? 'Edit Question Form' : "Create New Question Form"}>
                <div className="flex gap-2">


                    {initialData.status === "submitted" ? (
                        null
                        // <button className="bg-gray-300 text-black rounded px-4 py-2 hover:opacity-85 transition-all duration-200 cursor-pointer">
                        //     Download
                        // </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSaveDraft}
                                className="border border-slate-600 text-black text-sm rounded px-4 py-1.5 hover:opacity-85 transition-all duration-200 cursor-pointer hover:bg-slate-600 hover:text-white"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={handleSubmitAll}
                                className="bg-green-600 text-white text-sm rounded px-4 py-1.5 hover:opacity-85 transition-all duration-200 cursor-pointer"
                            >
                                Submit All
                            </button>
                        </>
                    )}
                </div>
            </MainHeader>

            <div className="flex-1 overflow-y-auto p-6">
                <div className=" max-w-4xl  space-y-6">

                    {visibleQuestions.map((q: Question, idx: number) => (
                        <QuestionItem
                            key={q.id}
                            index={idx}
                            question={q}
                            value={answers[q.id]}
                            onChange={(val) => handleChange(q.id, val)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
