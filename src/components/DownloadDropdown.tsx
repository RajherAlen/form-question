import { useEffect, useRef, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FormPDF } from "./FormPDF";
import { ChevronDown } from "lucide-react";
import cn from 'classnames'
import { exportToExcel } from "../lib/exportToExcel";

export default function DownloadDropdown({ initialData }: { initialData: Record<string, any> }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            {/* Main Button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border border-gray-500 text-black rounded px-4 py-2 hover:bg-gray-500 hover:text-white transition-all duration-200 cursor-pointer"
            >
                Download  <ChevronDown size={16} className={cn('transition-all duration-200 ', open ? 'rotate-180' : '')} />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
                    <button
                        onClick={() => { exportToExcel([initialData.data]) }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        Export to Excel
                    </button>
                    <PDFDownloadLink
                        document={<FormPDF data={initialData.data} />}
                        fileName={`Form-Questions_${initialData.data.clientId}_${initialData.data.clientName}.pdf`}
                    >
                        {({ loading }) => <>
                            <span className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                {loading ? 'Generating PDF...' : 'Export PDF'}
                            </span>
                        </>}
                    </PDFDownloadLink>
                </div>
            )}
        </div>
    );
}
