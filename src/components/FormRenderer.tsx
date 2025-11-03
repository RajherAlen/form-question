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

    console.log(answers, initialData)

    const handleChange = (questionId: number, val: any) => {

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

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-screen bg-gray-50">
            <MainHeader headerTitle={ initialData.data ? 'Edit Question Form' : "Create New Question Form"}>
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

                    {formSchema.map((q: Question, idx: number) => {
                        if (q.dependsOn) {
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
                </div>
            </div>
        </div>
    );
}
