import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Eye, Pencil, Plus, Search, Trash } from "lucide-react";
import MainHeader from "../../components/MainHeader";

type FormData = {
    client_id: string;
    data: Record<string, any>;
    status: "draft" | "submitted";
    updated_at: string;
    id: string;
};

export default function Dashboard() {
    const [forms, setForms] = useState<FormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "submitted">("all");
    const location = useLocation();

    const fetchForms = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("responses")
            .select("*")
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("Error fetching forms:", error);
            setForms([]);
        } else {
            setForms(data as FormData[]);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!selectedFormId) return;
        try {
            await supabase.from("responses").delete().eq("id", selectedFormId);
            setIsModalOpen(false);
            setSelectedFormId(null);
            fetchForms();
        } catch (error) {
            console.error("Error deleting form:", error);
        }
    };

    const openDeleteModal = (id: string) => {
        setSelectedFormId(id);
        setIsModalOpen(true);
    };

    const filteredForms = forms
        .filter((f) =>
            f.client_id.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((f) => statusFilter === "all" || f.status === statusFilter);

    useEffect(() => {
        fetchForms();
    }, []);

    useEffect(() => {
        if (location.state?.refresh) {
            fetchForms();
        }
    }, [location.state]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-screen bg-gray-50">
            <MainHeader headerTitle="Client Dashboard">
                <Link
                    to="/form/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                >
                    <Plus className="w-4 h-4" />
                    New Form
                </Link>
            </MainHeader>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Search Input */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search by client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    {/* Segmented Control */}
                    <div className="flex gap-1 bg-gray-200 rounded-lg p-1 text-sm">
                        {(["all", "submitted", "draft"] as const).map((status) => (
                            <button
                                key={status}
                                className={`px-3 py-1 rounded-lg transition cursor-pointer ${statusFilter === status
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-300"
                                    }`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div>
                        <div className="animate-pulse bg-gray-200 rounded h-11 mb-3"></div>
                        <div className="animate-pulse bg-gray-200 rounded h-11 mb-3"></div>
                        <div className="animate-pulse bg-gray-200 rounded h-11 mb-3"></div>
                    </div>
                )}

                {!loading && filteredForms.length === 0 && (
                    <div className="text-gray-500">
                        No forms found. Click "New Form" to create one.
                    </div>
                )}

                {!loading && filteredForms.length > 0 && (
                    <ul className="space-y-3">
                        {filteredForms.map((f) => (
                            <li
                                key={f.client_id + f.updated_at}
                                className="border border-gray-300 p-2 pl-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white"
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between flex-1 items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-xs">Client ID:</span>
                                                <span className="font-semibold text-gray-800">
                                                    {f.data.clientId}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex gap-3 items-center">
                                                <p className="flex items-center gap-1 text-xs text-gray-600">
                                                    <span
                                                        className={`text-gray-800 capitalize rounded-full px-3 py-1 text-xs ${f.status === "submitted"
                                                                ? "bg-green-200"
                                                                : "bg-yellow-200"
                                                            }`}
                                                    >
                                                        {f.status}
                                                    </span>
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    Last updated: {new Date(f.updated_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {f.status === "draft" && (
                                                    <Link
                                                        to={`/form/${f.id}`}
                                                        className="text-xs flex items-center gap-2 text-gray-900 border border-gray-900 px-2 py-1 rounded hover:bg-gray-900 hover:border-gray-900 transition-all duration-150 hover:text-white"
                                                    >
                                                        <Pencil width={14} strokeWidth={1.5} height={14} />
                                                    </Link>
                                                )}

                                                {f.status === "submitted" && (
                                                    <Link
                                                        to={`/form/${f.id}`}
                                                        className="text-xs flex items-center gap-2 text-gray-900 border border-gray-900 px-2 py-1 rounded hover:bg-gray-900 hover:border-gray-900 transition-all duration-150 hover:text-white"
                                                    >
                                                        <Eye width={14} strokeWidth={1.5} height={14} />
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => openDeleteModal(f.id)}
                                                    className="text-xs flex items-center gap-1 text-red-500 border border-red-500 px-2 py-1 rounded hover:bg-red-500 hover:border-red-500 transition-all duration-150 hover:text-white cursor-pointer"
                                                >
                                                    <Trash width={14} strokeWidth={1.5} height={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this form summary? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
