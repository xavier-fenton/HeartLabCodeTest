import { DateTime } from "luxon";
import { expect, it } from "vitest";
import { exampleClinicOpeningHours } from "../data/example-clinic-opening-hours";
import { getOpenClinics, parseClinicOpeningHours } from "./open-clinics";

const parseResult = parseClinicOpeningHours(exampleClinicOpeningHours);

// Test helper that returns those clinics open on a specific weekday and hour
// of the day. Monday is weekday === 1, and Sunday is weekday === 7.
function getClinicsOpenAt(weekdayAndHour: { weekday: number; hour: number }) {
  return getOpenClinics(parseResult, DateTime.fromObject(weekdayAndHour));
}

it("Reports no open clinics on Sunday at 5am", () => {
  expect(getClinicsOpenAt({ weekday: 7, hour: 5 })).toEqual([]);
});

it("Reports only the Mayo Clinic open on Monday at 8am", () => {
  expect(getClinicsOpenAt({ weekday: 1, hour: 8 })).toEqual(["Mayo Clinic"]);
});

it("Reports All clinics except Angios R Us are open on Monday at 12pm", () => {
  expect(getClinicsOpenAt({ weekday: 1, hour: 12 })).toEqual([
    "Angios R Us",
    "Atrium Analysts",
    "Auckland Cardiology",
    "Mayo Clinic",
    "The Heart Team",
  ]);
});

// TODO
