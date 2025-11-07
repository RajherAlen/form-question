import { useState, useEffect } from "react";
import { QuestionItem } from "./Question";
import { formSchema, type Question } from "../data/FormSchema";
import MainHeader from "./MainHeader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DownloadDropdown from "./DownloadDropdown";
import TeamsDropdown from "./TeamsDropdown"; // <- import your custom dropdown

export function FormRenderer({
    initialData = {},
    onSubmit,
    setToDraft
}: {
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void;
    setToDraft?: (data: Record<string, any>) => void;
}) {
    const navigate = useNavigate();

    // Answers for questions
    const [answers, setAnswers] = useState<Record<string, any>>(initialData.data || {});

    // Selected team
    const [selectedTeam, setSelectedTeam] = useState<number | null>(initialData.team_id ?? null);

    const handleChange = (questionId: number | string, val: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: val }));
    };

    const handleDraftMode = () => {
        if (setToDraft) {
            onSubmit({ ...answers, team_id: selectedTeam, status: "draft" });
        }
    }

    const handleSaveDraft = () => {
        if (!answers.clientId || !answers.clientName || !answers.applicant) {
            toast.warn("Applicant, Client ID and Client Name are required!");
            return;
        }

        onSubmit({ ...answers, team_id: selectedTeam, status: "draft", updated_at: new Date().toISOString() });

        toast.success("Draft saved successfully!");
        navigate('/', { state: { refresh: true } });
    };

    const handleSubmitAll = () => {
        if (!answers.clientId || !answers.clientName || !answers.applicant) {
            toast.warn("Applicant, Client ID and Client Name are required!");
            return;
        }

        if (!selectedTeam) {
            toast.warn("Please select a team!");
            return;
        }

        onSubmit({ ...answers, team_id: selectedTeam, status: "submitted", updated_at: new Date().toISOString() });
        navigate('/', { state: { refresh: true } });
        toast.success("Form submitted successfully!");
    };

    // Compute visible questions with jump logic
    const visibleQuestions: Question[] = [];
    const skippedIds = new Set<number | string>();
    const idToIndex = new Map<number | string, number>();
    formSchema.forEach((q, idx) => idToIndex.set(q.id, idx));

    for (let i = 0; i < formSchema.length; i++) {
        const q = formSchema[i];
        if (skippedIds.has(q.id)) continue;

        if (q.dependsOn && q.dependsOn.length > 0) {
            const visible = q.dependsOn.every((cond) => {
                const answer = answers[cond.questionId];
                if (Array.isArray(cond.value)) return cond.value.includes(answer);
                return answer === cond.value;
            });
            if (!visible) continue;
        }

        visibleQuestions.push(q);

        const currentAnswer = answers[q.id];
        if (q.options && typeof currentAnswer !== "undefined" && currentAnswer !== null) {
            const matchedOption = q.options.find((opt) => opt.value === currentAnswer);
            if (matchedOption && matchedOption.jumpTo) {
                const targetIdx = idToIndex.get(matchedOption.jumpTo);
                if (typeof targetIdx !== "undefined") {
                    for (let j = i + 1; j <= targetIdx - 1; j++) {
                        skippedIds.add(formSchema[j].id);
                    }
                }
            }
        }
    }

    const handleCancel = () => {
        onSubmit({ status: 'submitted' });
        navigate('/', { state: { refresh: true } });
    }

    useEffect(() => {
        if (initialData?.data) setAnswers(initialData.data);
        if (initialData?.team_id) setSelectedTeam(initialData.team_id);
    }, [initialData]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-screen bg-gray-50">
            <MainHeader
                headerTitle={
                    initialData.status === "submitted" && answers?.clientId
                        ? answers.clientId
                        : initialData.status === "draft"
                            ? "Edit Question Form"
                            : "Create New Question Form"
                }
            >
                <div className="flex gap-2">
                    {initialData.status === "submitted" ? (
                        <div className="flex gap-2">
                            <DownloadDropdown initialData={initialData} />
                            <button onClick={handleDraftMode} className="bg-blue-500 text-white rounded px-4 py-1.5 hover:opacity-85 text-sm transition-all duration-200 cursor-pointer">
                                Edit
                            </button>
                        </div>
                    ) : (
                        <>
                            <button onClick={handleCancel} className="border border-red-500 text-red-500 rounded px-4 py-1.5 text-sm hover:opacity-85 transition-all duration-200 cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleSaveDraft} className="border border-slate-600 text-black text-sm rounded px-4 py-1.5 hover:opacity-85 transition-all duration-200 cursor-pointer hover:bg-slate-600 hover:text-white">
                                Save Draft
                            </button>
                            <button onClick={handleSubmitAll} className="bg-green-600 text-white text-sm rounded px-4 py-1.5 hover:opacity-85 transition-all duration-200 cursor-pointer">
                                Submit All
                            </button>
                        </>
                    )}
                </div>
            </MainHeader >

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl space-y-6">
                    {/* Teams dropdown added here at top of form */}
                    <div className="mb-6 max-w-sm">
                        <p className="text-sm text-gray-800">Team</p>
                        <TeamsDropdown value={selectedTeam} onChange={setSelectedTeam} />
                    </div>

                    {visibleQuestions.map((q: Question, idx: number) => (
                        <QuestionItem
                            key={q.id}
                            index={idx}
                            question={q}
                            value={answers[q.id]}
                            onChange={(val) => handleChange(q.id, val)}
                            disabled={initialData.status === "submitted"}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
