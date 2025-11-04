// utils/formUtils.ts

import { formSchema } from "../data/FormSchema";

export function getQuestionLabel(id: string | number): string {
    const question = formSchema.find(q => q.id == id);
    return question ? question.label : `Question ${id}`;
}

export function getOptionLabel(questionId: string | number, value: string): string {
    const question = formSchema.find(q => q.id === questionId);
    const option = question?.options?.find(o => o.value === value);
    return option ? option.label : value;
}