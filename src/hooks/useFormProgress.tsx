import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export function useFormProgress(id: string | null) {
    const [data, setData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        if (!id) {
            setData({});
            setLoading(false);
            return;
        }

        setLoading(true);

        // Query JSON column 'data' for clientId
        const { data: result, error } = await supabase
            .from("responses")
            .select("*")
            .eq("id", id) // <-- check clientId inside JSON 'data' column
            .maybeSingle();

        if (error && error.code !== "PGRST116") {
            console.error("Error loading form data:", error.message);
        }

        setData(result ?? {});
        setLoading(false);
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    const save = useCallback(
        async (newData: Record<string, any>) => {
            setSaving(true);

            try {
                if (data.id) {
                    // If primary id exists, update the existing row
                    const { error: updateError } = await supabase
                        .from("responses")
                        .update({
                            client_id: newData.clientId,
                            data: newData,
                            updated_at: new Date().toISOString(),
                            status: newData.status ?? "draft",
                        })
                        .eq("id", data.id);

                    if (updateError) throw updateError;
                } else {
                    // Otherwise insert a new row
                    const { data: inserted, error: insertError } = await supabase
                        .from("responses")
                        .insert({
                            client_id: newData.clientId,
                            data: newData,
                            updated_at: new Date().toISOString(),
                            status: newData.status ?? "draft",
                        })
                        .select()
                        .maybeSingle();

                    if (insertError) throw insertError;

                    // Store the newly created id in local state
                    setData(inserted ?? newData);
                }

                // Update local state
                setData((prev) => ({ ...prev, ...newData }));
            } catch (err: any) {
                console.error("Error saving form data:", err.message);
            } finally {
                setSaving(false);
            }
        },
        [id, data]
    );

    const setToDraft = useCallback(async () => {
        await save({ ...data, status: "draft" });
    }, [data, save]);

    return { data, save, loading, saving, reload: load, setToDraft };
}
