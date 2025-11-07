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

        const { data: result, error } = await supabase
            .from("responses")
            .select("*")
            .eq("id", id)
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
                const payload = {
                    applicant: newData.applicant,
                    client_id: newData.clientId,
                    data: { ...data.data, ...newData }, // merge only into inner JSON
                    updated_at: new Date().toISOString(),
                    status: newData.status ?? data.status ?? "draft",
                    team_id: newData.team_id ?? data.team_id,
                };

                if (data.id) {
                    const { error: updateError } = await supabase
                        .from("responses")
                        .update(payload)
                        .eq("id", data.id);

                    if (updateError) throw updateError;
                } else {
                    const { data: inserted, error: insertError } = await supabase
                        .from("responses")
                        .insert(payload)
                        .select()
                        .maybeSingle();

                    if (insertError) throw insertError;

                    setData(inserted ?? { ...payload });
                }

                // Update local state
                setData((prev) => ({
                    ...prev,
                    ...payload,
                }));
            } catch (err: any) {
                console.error("Error saving form data:", err.message);
            } finally {
                setSaving(false);
            }
        },
        [id, data]
    );


    const setToDraft = useCallback(async () => {
        await save({ status: "draft" });
    }, [save])

    return { data, save, loading, saving, reload: load, setToDraft };
}
