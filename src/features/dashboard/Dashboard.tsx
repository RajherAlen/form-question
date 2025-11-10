import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Check, Eye, Filter, Pencil, Plus, Search, Trash } from "lucide-react";
import MainHeader from "../../components/MainHeader";
import DownloadDropdown from "../../components/DownloadDropdown";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/DropdownMenu";
import { exportToExcel } from "../../lib/exportToExcel";

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


    useEffect(() => {
        fetchForms();
    }, []);

    useEffect(() => {
        if (location.state?.refresh) {
            fetchForms();
        }
    }, [location.state]);


    const [teams, setTeams] = useState<{ id: string; team_name: string }[]>([]);
    const [teamFilter, setTeamFilter] = useState<string | null>(null);

    // fetch teams
    useEffect(() => {
        const fetchTeams = async () => {
            const { data, error } = await supabase
                .from("team")
                .select("id, team_name");
            if (error) {
                console.error("Error fetching teams:", error);
            } else if (data) {
                setTeams(data); // data will be array of { id, team_name }
            }
        };
        fetchTeams();
    }, []);


    const teamsMap = Object.fromEntries(teams.map(t => [t.id, t.team_name]));

    const filteredForms = forms
        .filter(f => f.client_id.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(f => statusFilter === 'all' || f.status === statusFilter)
        .filter(f => !teamFilter || f.data.team_id === teamFilter);

    const handleDownloadAll = () => {
        exportToExcel(filteredForms, teamsMap, teamFilter || 'all');
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-screen bg-gray-50">
            <MainHeader headerTitle="Client Dashboard">
                <div className="flex items-center gap-2">
                    <button onClick={handleDownloadAll} className="flex items-center text-sm gap-2 border border-gray-500 text-black rounded px-4 py-1.5 hover:bg-gray-500 hover:text-white transition-all duration-200 cursor-pointer">
                        Download
                    </button>
                    <Link
                        to="/form/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                    >
                        <Plus className="w-4 h-4" />
                        New Form
                    </Link>
                </div>
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

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm cursor-pointer w-[260px]">
                                    <Filter className="w-4 h-4" />
                                    {teamFilter
                                        ? teams.find((t) => t.id === teamFilter)?.team_name || "Team"
                                        : "Filter by Team"}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[260px]">
                                <DropdownMenuItem onClick={() => setTeamFilter(null)}>
                                    All Teams
                                </DropdownMenuItem>
                                {teams.map((team) => (
                                    <DropdownMenuItem
                                        key={team.id}
                                        onClick={() => setTeamFilter(team.id)}
                                        className={`flex items-center justify-between ${team.id === teamFilter ? "bg-blue-100 text-blue-500 font-semibold" : ""
                                            }`}
                                    >
                                        <span>{team.team_name}</span>
                                        {team.id === teamFilter && (
                                            <span className="text-blue-500 text-sm">
                                                <Check className="w-4 h-4" />
                                            </span>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                    <ul className="space-y-1.5">
                        {filteredForms.map((f) => {
                            return (
                                <li
                                    key={f.client_id + f.updated_at}
                                    className="border border-gray-300 p-2 pl-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white"
                                >
                                    <div className="flex-1">
                                        <div className="flex justify-between flex-1 items-center">
                                            <div className="flex items-center gap-5">
                                                <div className="flex gap-1 flex-col items-start ">
                                                    <p className="text-xs text-nowrap">Client ID:</p>
                                                    <p className="font-semibold text-gray-800 truncate text-sm min-w-[200px] max-w-[200px]">
                                                        {f.data.clientId}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1 flex-col items-start ">
                                                    <p className="text-xs text-nowrap">Team:</p>
                                                    <p className="font-semibold text-gray-800 truncate text-sm min-w-[200px] max-w-[200px]">
                                                        {teamsMap[f.data.team_id] || '-'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1 flex-col items-start ">
                                                    <p className="text-xs text-nowrap">Client Name:</p>
                                                    <p className="font-semibold text-gray-800 truncate text-sm min-w-[200px] max-w-[200px]">
                                                        {f.data.clientName || '-'}
                                                    </p>
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
                                                    <DownloadDropdown
                                                        initialData={f}
                                                        className="!py-1 !px-2 text-xs"
                                                    />
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
                            )
                        })}
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
