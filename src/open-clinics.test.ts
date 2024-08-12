import { DateTime, WeekdayNumbers } from "luxon";
import { expect, it } from "vitest";
import { exampleClinicOpeningHours } from "../data/example-clinic-opening-hours";
import { getOpenClinics, parseClinicOpeningHours } from "./open-clinics";

const parseResult = parseClinicOpeningHours(exampleClinicOpeningHours);



// Test helper that returns those clinics open on a specific weekday and hour
// of the day. Monday is weekday === 1, and Sunday is weekday === 7.
function getClinicsOpenAt(weekdayAndHour: { weekday: WeekdayNumbers; hour: number }) {
  return getOpenClinics(parseResult, DateTime.fromObject(weekdayAndHour));
}

it("Reports no open clinics on Sunday at 5am", () => {
  expect(getClinicsOpenAt({ weekday: 7, hour: 5 })).toEqual([]);
});

it("Reports only the Mayo Clinic open on Monday at 8am", () => {
  expect(getClinicsOpenAt({ weekday: 1, hour: 8 })).toEqual(["Mayo Clinic"]);
});

it("Reports all clinics except Angios R Us are open on Monday at 12pm", () => {
  expect(getClinicsOpenAt({ weekday: 1, hour: 12 })).toEqual([
    "Atrium Analysts",
    "Auckland Cardiology",
    "Mayo Clinic",
    "The Heart Team",
  ]);
});

it("Reports all clinics are open on Thursday at 3pm", () => {
  expect(getClinicsOpenAt({ weekday: 4, hour: 15 })).toEqual(['Angios R Us',
  'Atrium Analysts',
  'Auckland Cardiology',
  'Mayo Clinic',
  'The Heart Team']);
});


