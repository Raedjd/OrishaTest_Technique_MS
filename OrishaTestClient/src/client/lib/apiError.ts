import axios from "axios";
import { ApiError } from "@/shared/types/shared";

// Transforme une erreur axios en message lisible, à partir du format renvoyé par l'API
export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiError | undefined;
        if (data?.errors && data.errors.length > 0) return data.errors.join(" ");
        if (data?.message) return data.message;
        if (!error.response) return "The API is unreachable. Check that the backend is running.";
    }
    return fallback;
}
