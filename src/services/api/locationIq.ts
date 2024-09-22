import "server-only";

const forwardGeocoding = async (query: string) => {
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search?key=${process.env.LOCATIONIQ_ACCESS_TOKEN}&q=${query}&countrycodes=au&format=json`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch address coordinates.");
  }
};

const autocomplete = async (search: string) => {
  try {
    const response = await fetch(
      `https://api.locationiq.com/v1/autocomplete?key=${process.env.LOCATIONIQ_ACCESS_TOKEN}&q=${search}&countrycodes=au`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch address suggestions.");
  }
};

export { autocomplete, forwardGeocoding };
