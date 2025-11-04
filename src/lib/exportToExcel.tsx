import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data: Record<string, any>[]) => {
    // Convert data to array of objects
    const formattedData = data.map(item => {
        const { clientName, clientId, status, updated_at, ...responses } = item;
        return {
            'Client Name': clientName,
            'Client ID': clientId,
            Status: status,
            'Last Updated': new Date(updated_at).toLocaleString(),
            ...responses, // This will include question keys as columns
        };
    });

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');

    // Write the workbook and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const fileName = `Form-Questions_${formattedData[0]['Client ID']}_${formattedData[0]['Client Name']}.xlsx`;
    
    saveAs(blob, fileName);
};
