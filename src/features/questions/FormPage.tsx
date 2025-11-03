import { useParams } from "react-router-dom";
import { FormRenderer } from "../../components/FormRenderer";
import { useFormProgress } from "../../hooks/useFormProgress";

export default function FormPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const isNew = clientId === "create";

  // Pass null to skip fetching for new forms
  const { data, save, loading, saving } = useFormProgress(isNew ? '' : clientId ?? "");

  const initialData = isNew ? {} : data;

  // Only show loading if we are fetching an existing form
  if (!isNew && loading) return <p className="text-gray-600">Loading form...</p>;

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-screen bg-gray-50">
      <FormRenderer initialData={initialData} onSubmit={save} />
      {saving && <p className="text-sm text-gray-500 mt-2">Saving...</p>}
    </div>
  );
}
