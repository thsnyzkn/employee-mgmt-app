import { msg } from "@lit/localize";

// Original English strings for internal use (comparisons, etc.)
export const propertyTypesOriginal = [
  "First Name",
  "Last Name",
  "Date of Employment",
  "Date of Birth",
  "Phone",
  "Email",
  "Department",
  "Position",
  "Actions",
];

// Translated strings for display
export const propertyTypes = [
  msg("First Name"),
  msg("Last Name"),
  msg("Date of Employment"),
  msg("Date of Birth"),
  msg("Phone"),
  msg("Email"),
  msg("Department"),
  msg("Position"),
  msg("Actions"),
];

// Helper function to get translated property type
export function getTranslatedPropertyType(originalType) {
  switch (originalType) {
    case "First Name":
      return msg("First Name");
    case "Last Name":
      return msg("Last Name");
    case "Date of Employment":
      return msg("Date of Employment");
    case "Date of Birth":
      return msg("Date of Birth");
    case "Phone":
      return msg("Phone");
    case "Email":
      return msg("Email");
    case "Department":
      return msg("Department");
    case "Position":
      return msg("Position");
    case "Actions":
      return msg("Actions");
    default:
      return originalType;
  }
}
