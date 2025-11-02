import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

type FormData = {
    client_id: string;
    data: Record<string, any>;
    status: "draft" | "submitted";
    updated_at: string;
};

export default function Dashboard()
{
    const [forms, setForms] = useState<FormData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchForms = async () =>
    {
        setLoading(true);
        const { data, error } = await supabase
            .from("responses")
            .select("*")
            .order("updated_at", { ascending: false });

        if (error)
        {
            console.error("Error fetching forms:", error);
            setForms([]);
        } else
        {
            setForms(data as FormData[]);
        }
        setLoading(false);
    };

    useEffect(() =>
    {
        fetchForms();
    }, []);

    return (
        <div className="p-6 space-y-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold">Client Dashboard</h1>

            <button
                onClick={() => window.location.href = "/form/new"} // navigate to new form page
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                + New Form
            </button>

            {loading && <p>Loading forms...</p>}

            {!loading && forms.length === 0 && (
                <div className="mt-6 text-gray-500">
                    No forms found. Click "New Form" to create one.
                </div>
            )}

            {!loading && forms.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {forms.map((f) => (
                        <li key={f.client_id + f.updated_at} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Client: {f.client_id}</p>
                                <p className="text-sm text-gray-500">Status: {f.status} | Last updated: {new Date(f.updated_at).toLocaleString()}</p>
                            </div>
                            {f.status === "draft" && (
                                <Link
                                    to={`/form/${f.client_id}`}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    Continue
                                </Link>
                            )}
                            {f.status === "submitted" && (
                                <Link
                                    to={`/form/${f.client_id}`}
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                    View
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
