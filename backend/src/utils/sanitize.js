export const sanitizeEmptyStrings = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeEmptyStrings(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        sanitizeEmptyStrings(val),
      ]),
    );
  }

  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
};
