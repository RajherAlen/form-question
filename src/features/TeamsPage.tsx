import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Pencil, Plus, Trash } from 'lucide-react';
import classNames from 'classnames';

interface Team {
    id: number;
    team_name: string;
}

const TeamsPage = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamName, setTeamName] = useState('');
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

    // Fetch teams
    const fetchTeams = async () => {
        const { data, error } = await supabase.from('team').select('*');
        if (error) console.error(error);
        else setTeams(data || []);
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    // Add or update team
    const handleSave = async () => {
        if (!teamName) return;

        if (editingTeam) {
            const { error } = await supabase
                .from('team')
                .update({ team_name: teamName })
                .eq('id', editingTeam.id);
            if (error) console.error(error);
            setEditingTeam(null);
        } else {
            const { error } = await supabase.from('team').insert([{ team_name: teamName }]);
            if (error) console.error(error);
        }

        setTeamName('');
        fetchTeams();
    };

    // Delete team
    const handleDelete = async () => {
        if (selectedTeamId === null) return;

        const { error } = await supabase.from('team').delete().eq('id', selectedTeamId);
        if (error) console.error(error);

        setIsModalOpen(false);
        setSelectedTeamId(null);
        fetchTeams();
    };

    // Open delete modal
    const openDeleteModal = (id: number) => {
        setSelectedTeamId(id);
        setIsModalOpen(true);
    };

    // Edit team
    const handleEdit = (team: Team) => {
        setEditingTeam(team);
        setTeamName(team.team_name);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4">Teams</h1>

            {/* Form */}
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm max-w-xl"
                />
                <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition cursor-pointer"
                >
                    {editingTeam ? 'Update' : 'Create'}
                </button>
                {editingTeam && (
                    <button
                        onClick={() => {
                            setEditingTeam(null);
                            setTeamName('');
                        }}
                        className="border border-slate-600 text-black text-sm rounded px-4 py-1.5 hover:opacity-85 transition-all duration-200 cursor-pointer hover:bg-slate-600 hover:text-white"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {/* Team List */}
            <ul className="bg-white rounded-md max-w-xl p-3 shadow flex flex-col max-h-[400px] overflow-y-auto">
                {teams.map((team, index) => (
                    <li
                        key={team.id}
                        className={classNames(
                            "flex items-center justify-between gap-5 border-b border-b-slate-200",
                            index === teams.length - 1 ? 'border-b-0 py-0 mb-0' : 'mb-2 pb-2.5'
                        )}
                    >
                        <span className="truncate text-sm">{team.team_name}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(team)}
                                className="text-xs flex items-center gap-2 text-gray-900 border border-gray-900 px-2 py-1 rounded hover:bg-gray-900 hover:text-white transition cursor-pointer"
                            >
                                <Pencil width={14} strokeWidth={1.5} height={14} />
                            </button>
                            <button
                                onClick={() => openDeleteModal(team.id)}
                                className="text-xs flex items-center gap-1 text-red-500 border border-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition cursor-pointer"
                            >
                                <Trash width={14} strokeWidth={1.5} height={14} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Delete Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this team? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamsPage;
