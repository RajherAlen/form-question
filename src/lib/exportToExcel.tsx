import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formSchema, type Question } from '../data/FormSchema';
import { toast } from 'react-toastify';

const getOptionLabel = (questionId: string | number, value: any) => {
    const question = formSchema.find(q => q.id === questionId);
    if (!question || !question.options) return value;
    if (Array.isArray(value)) {
        return value.map(v => question.options!.find(o => o.value === v)?.label || v);
    }
    return question.options.find(o => o.value === value)?.label || value;
};

// Pass teamsMap as an object: { [teamId]: team_name }
export const exportToExcel = (
    data: Record<string, any>[] = [],
    teamsMap: Record<string | number, string> = {},
    teamId?: string // undefined, null, or "all" = export all
) => {
    const filteredData =
        !teamId || teamId === "all"
            ? data
            : data.filter(d => d.team_id === teamId);

    if (filteredData.length === 0) {
        toast.warn('No submissions found for this selection.');
        return;
    }

    const questionHeaders = formSchema.map(q => q.label);
    const metadataHeaders = ['Team Name', 'Status', 'Last Updated'];
    const headers = [...metadataHeaders, ...questionHeaders];

    const rows = filteredData.map(item => {
        const teamName = teamsMap[item.team_id] || '-'; // <-- fallback to '-' if undefined or null

        const row: Record<string, any> = {
            'Team Name': teamName,
            'Status': item.status || '-',
            'Last Updated': item.updated_at ? new Date(item.updated_at).toLocaleString() : '-',
        };

        formSchema.forEach((q: Question) => {
            const value = item[q.id as string] ?? item.data?.[q.id] ?? item[q.id];
            const label = value !== undefined ? getOptionLabel(q.id, value) : '-';
            row[q.label] = Array.isArray(label) ? label.join(', ') : label;
        });

        return row;
    });


    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    const workbook = XLSX.utils.book_new();
    const sheetName = !teamId || teamId === "all" ? 'All Teams' : `Team_${teamId}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const fileName = !teamId || teamId === "all"
        ? `Form-Submissions_AllTeams.xlsx`
        : `Form-Submissions_Team_${teamId}.xlsx`;

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
};
