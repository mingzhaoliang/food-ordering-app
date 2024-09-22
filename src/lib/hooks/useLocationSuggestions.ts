import { AutocompleteOption } from "@/components/ui/form/form-autocomplete";
import { AU_STATES_FULL } from "@/lib/utils/constants";
import { reversedStateConversion } from "@/lib/utils/formatter";
import { AutocompleteLocation } from "@/types/AutocompleteLocation";
import { useCallback } from "react";
import { useSearchSuggestions } from "./useSearchSuggestions";

const useLocationSuggestions = (search: string, debounceTime: number) => {
  const getLocationSuggestions = useCallback(
    async (debounceSearch: string): Promise<(AutocompleteOption & AutocompleteLocation)[]> => {
      const abort = new AbortController();
      const signal = abort.signal;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/location-suggestions?search=${debounceSearch}`,
        {
          signal,
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch address suggestions");
        throw new Error("Failed to fetch address suggestions");
      }

      const data: AutocompleteLocation[] = await response.json();

      const suggestions = data
        .map((location) => {
          const suggestion = {
            ...location,
            key: location.place_id + location.osm_id + location.lat + location.lon,
            label: location.display_place,
            value: location.display_name + location.lat + location.lon,
            description: location.display_address,
          };

          if (
            suggestion.address.state &&
            AU_STATES_FULL.includes(location.address.state as (typeof AU_STATES_FULL)[number])
          ) {
            suggestion.address.state = reversedStateConversion(suggestion.address.state);
          }

          return suggestion;
        })
        .sort((a, b) => a.display_name.localeCompare(b.display_name)) as (AutocompleteOption & AutocompleteLocation)[];

      return suggestions;
    },
    []
  );

  const { suggestions, setSuggestions, loading, error } = useSearchSuggestions(
    search,
    debounceTime,
    getLocationSuggestions
  );

  return { suggestions, setSuggestions, loading, error };
};

export { useLocationSuggestions };
