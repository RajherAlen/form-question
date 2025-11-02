import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export function useFormProgress(clientId: string) {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);

    const { data: result, error } = await supabase
      .from("responses")
      .select("*")
      .eq("client_id", clientId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading form data:", error.message);
    }
    setData(result ?? {});
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (newData: Record<string, any>) => {
      if (!clientId) return;
      setSaving(true);

      try {
        const { error } = await supabase.from("responses").upsert({
          client_id: clientId,
          data: newData,
          updated_at: new Date().toISOString(),
          status: "submitted",
        });

        if (error) throw error;
        setData(newData); // update local state after successful save
      } catch (err: any) {
        console.error("Error saving form data:", err.message);
      } finally {
        setSaving(false);
      }
    },
    [clientId]
  );

  return { data, save, loading, saving, reload: load };
}
