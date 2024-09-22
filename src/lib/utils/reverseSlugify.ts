interface ReverseSlugifyOptions {
  delimiter?: string | RegExp; // Delimiter between words (e.g., '-', '_', or custom regex)
  caseStyle?: "none" | "capitalise" | "uppercase" | "lowercase" | "sentence"; // Handle case transformations
  trim?: boolean; // Whether to trim extra spaces
}

export const reverseSlugify = (slug: string, options?: ReverseSlugifyOptions): string => {
  const {
    delimiter = /[-_]/g, // Default to handling both hyphens and underscores
    caseStyle = "capitalise", // Default to capitalizing each word
    trim = true, // Trim extra spaces by default
  } = options || {};

  // Replace the delimiter with spaces
  let result = slug.replace(delimiter, " ");

  // Apply case transformations based on the caseStyle option
  switch (caseStyle) {
    case "capitalise":
      result = result.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalise first letter of each word
      break;
    case "uppercase":
      result = result.toUpperCase();
      break;
    case "lowercase":
      result = result.toLowerCase();
      break;
    case "sentence":
      // Capitalise only the first letter of the first word
      result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
      break;
    // 'none' case does nothing and retains the original case
  }

  // Optionally trim extra spaces
  if (trim) {
    result = result.trim();
  }

  return result;
};
