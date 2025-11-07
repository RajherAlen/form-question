import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ChevronDown } from 'lucide-react';

interface Team {
    id: number;
    team_name: string;
}

interface TeamsDropdownProps {
    value: number | null;
    onChange: (teamId: number) => void;
    placeholder?: string;
    className?: string;
}

const TeamsDropdown: React.FC<TeamsDropdownProps> = ({
    value,
    onChange,
    placeholder = 'Select a team',
    className = '',
}) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('team').select('*');
            if (error) console.error(error);
            else setTeams(data || []);
            setLoading(false);
        };
        fetchTeams();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedTeam = teams.find((team) => team.id === value);

    if (loading) return <div className='className="w-full border border-gray-300 rounded p-2 flex justify-between items-center cursor-pointer hover:border-gray-400 transition"'>Loading...</div>;

    return (
        <div ref={dropdownRef} className={`relative w-full ${className}`}>
            <button
                type="button"
                className="w-full border border-gray-300 rounded p-2 flex justify-between items-center cursor-pointer hover:border-gray-400 transition"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span>{selectedTeam ? selectedTeam.team_name : placeholder}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {open && !loading && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                    {teams.map((team) => (
                        <li
                            key={team.id}
                            className="px-3 py-2 hover:bg-gray-500 hover:text-white cursor-pointer transition"
                            onClick={() => {
                                onChange(team.id);
                                setOpen(false);
                            }}
                        >
                            {team.team_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TeamsDropdown;
