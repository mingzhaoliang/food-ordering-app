import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export const useSearchSuggestions = <T>(
  search: string,
  debounceTime: number,
  fetchSuggestions: (search: string) => Promise<T[]>
) => {
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceSearch = useDebounce(search, debounceTime);

  useEffect(() => {
    if (debounceSearch) {
      setLoading(true);
      fetchSuggestions(debounceSearch)
        .then((data) => {
          setSuggestions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
          setLoading(false);
        });
    } else {
      setSuggestions([]);
    }

    return () => {
      setSuggestions([]);
    };
  }, [debounceSearch, fetchSuggestions]);

  return { suggestions, setSuggestions, loading, error };
};
