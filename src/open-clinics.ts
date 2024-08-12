import { DateTime } from "luxon";
import {
  type ClinicOpeningHours
} from "../data/example-clinic-opening-hours";
import clinicsToMatch, { sortClinicTimes } from "../helperFunctions/helpers";

export type ParsedClinicOpeningHours = {
  clinicName: string;
  openTimes: {
    days: number[];
    availableTimes: number[];
  }[];
}[];

/**
 * Parses a set of clinic opening hours and returns a data structure that can be
 * queried to find which clinics are open at a specified date and time. The
 * querying is done using the getOpenClinics() function.
 *
 * Notes:
 *
 * - The format of the opening hours data to be parsed can be seen in the
 *   "data/example-clinic-opening-hours.ts" file.
 *
 * - The input data can be assumed to be correctly formatted, i.e. there is no
 *   requirement to validate it or handle any errors it may contain.
 */



export function parseClinicOpeningHours(
  clinicOpeningHours: ClinicOpeningHours
): ParsedClinicOpeningHours {
  

  const organisedClinics = clinicOpeningHours.map((clinic) => {
    return { clinicName: clinic.name, openTimes: sortClinicTimes(clinic) };
  });
  
  return organisedClinics;
};

/**
 * Takes a set of parsed clinic opening hours and returns an array containing
 * the names of those clinics which are open at the specified date and time,
 * sorted alphabetically.
 */
export function getOpenClinics(
  parsedClinicOpeningHours: ParsedClinicOpeningHours,
  queryTime: DateTime
) {

  const parsedClinic = parsedClinicOpeningHours;

  const hourToMatch = queryTime.hour;
  const dayToMatch = queryTime.weekday;

  // Use helper function here to remove clutter
  const foundMatches = clinicsToMatch(parsedClinic , dayToMatch, hourToMatch) 
  return foundMatches
}

