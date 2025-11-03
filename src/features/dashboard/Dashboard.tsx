import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Eye, Pencil, Plus } from "lucide-react";
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
        {loading && <p className="text-gray-600">Loading forms...</p>}

        {!loading && forms.length === 0 && (
          <div className="text-gray-500">No forms found. Click "New Form" to create one.</div>
        )}

        {!loading && forms.length > 0 && (
          <ul className="space-y-3">
            {forms.map((f) => (
              <li
                key={f.client_id + f.updated_at}
                className="border border-gray-300 p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow"
              >
                <div className="flex-1">
                  <div className="flex justify-between flex-1 items-center">
                    <p className="font-semibold text-gray-800">Client: {f.client_id}</p>

                    {f.status === "draft" && (
                      <Link
                        to={`/form/${f.client_id}`}
                        className="text-xs flex items-center gap-2 text-gray-700 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 transition-all duration-150"
                      >
                        Edit <Pencil width={14} strokeWidth={1.5} height={14} />
                      </Link>
                    )}

                    {f.status === "submitted" && (
                      <Link
                        to={`/form/${f.client_id}`}
                        className="text-xs flex items-center gap-2 text-gray-700 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 transition-all duration-150"
                      >
                        View <Eye width={14} strokeWidth={1.5} height={14} />
                      </Link>
                    )}
                  </div>

                  <p className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                    Status:
                    <span
                      className={`ml-1 text-gray-800 capitalize rounded-full px-3 text-xs ${
                        f.status === "submitted" ? "bg-green-100" : "bg-yellow-100"
                      }`}
                    >
                      {f.status}
                    </span>
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {new Date(f.updated_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
