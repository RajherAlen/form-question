import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Eye, Pencil, Plus, Search } from "lucide-react";
import MainHeader from "../../components/MainHeader";

type FormData = {
    client_id: string;
    data: Record<string, any>;
    status: "draft" | "submitted";
    updated_at: string;
};

export default function Dashboard() {
    const [forms, setForms] = useState<FormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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

    useEffect(() => {
        fetchForms();
    }, []);

    const filteredForms = forms.filter((f) =>
        f.client_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <div className="mb-4">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search by client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                {loading && <p className="text-gray-600">Loading forms...</p>}

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
                                                    {f.client_id}

                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex gap-3 items-center"> 
                                                <p className="flex items-center gap-1 text-xs text-gray-600">
                                                    <span
                                                        className={`text-gray-800 capitalize rounded-full px-3 py-1 text-xs ${f.status === "submitted" ? "bg-green-200" : "bg-yellow-200"
                                                            }`}
                                                    >
                                                        {f.status}
                                                    </span>
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    Last updated: {new Date(f.updated_at).toLocaleString()}
                                                </p>
                                            </div>
                                            {f.status === "draft" && (
                                                <Link
                                                    to={`/form/${f.client_id}`}
                                                    className="text-xs flex items-center gap-2 text-gray-700 border border-amber-500 px-2 py-1 rounded hover:bg-amber-500 hover:border-amber-500 transition-all duration-150 hover:text-white"
                                                >
                                                    Edit <Pencil width={14} strokeWidth={1.5} height={14} />
                                                </Link>
                                            )}

                                            {f.status === "submitted" && (
                                                <Link
                                                    to={`/form/${f.client_id}`}
                                                    className="text-xs flex items-center gap-2 text-gray-700 border border-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:border-blue-500 transition-all duration-150 hover:text-white"
                                                >
                                                    View <Eye width={14} strokeWidth={1.5} height={14} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}
