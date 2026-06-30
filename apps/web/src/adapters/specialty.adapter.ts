import { BackendSpecialty, Specialty } from "@/types/specialty.type";

export const specialtyAdapter = (
  data: BackendSpecialty | string,
): Specialty => {
  if (!data) return { id: "", name: "Unknown", slug: "unknown", image: "" };

  if (typeof data === "string") {
    // Sometimes backend returns just the ID strings initially
    return {
      id: data,
      name: "Unknown Specialty",
      slug: "unknown-specialty",
      image: "",
    };
  }

  const name = data.name || "Unknown Specialty";
  return {
    id: data._id || "",
    name,
    slug: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
    image: data.image || "",
  };
};

export const specialtiesAdapter = (
  data: BackendSpecialty[] | string[],
): Specialty[] => {
  if (!Array.isArray(data)) return [];
  return data.map(specialtyAdapter);
};
