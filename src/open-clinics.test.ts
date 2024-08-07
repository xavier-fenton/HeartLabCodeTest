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

/* Todo: 
  Aug 8th 2024:
  Program works for these tests but, obv need refactors because I have 
  some clinics over lapping, so need to clean these, and then I notice I need
  another clause in my matching function... also turn matching variable into a
  function rather than the map.

  But happy with this result, because I have the idea of having a dynamic 
  array being filled which is what I want.

  Yet to refactor.
*/
