/*
 * src/hooks/useGuide.ts
 * 
 * Defines the function useGuide for fetching guide data in this demo version
 */

import { useEffect, useState } from "react";
import axios from "axios";
import type { Guide } from "../types/guide";

// for now, just connecting to localhost
const API_BASE = "http://localhost:8000";

export function useGuide() {
    const [guide, setGuide] = useState<Guide | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get<Guide>(`${API_BASE}/demo_guide`)
            .then((res) => setGuide(res.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);
    // empty array means this effect runs once the component first mounts (on page load)

    return { guide, loading, error };
}