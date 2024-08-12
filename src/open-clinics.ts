import { DateTime } from "luxon";
import {
  type ClinicOpeningHours
} from "../data/example-clinic-opening-hours";
import clinicsToMatch from "../helperFunctions/helpers";

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


const daysOfWeek = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function parseClinicOpeningHours(
  clinicOpeningHours: ClinicOpeningHours
): ParsedClinicOpeningHours {




  function determineOpenDays(startDay: string, endDay: string): Array<number> {


    let daysBetween: Array<number> = [];
    let startIndex;
    let endIndex;

    for (let i = 0; i < daysOfWeek.length + 1; i++) {
      const day = daysOfWeek[i];

      if (day === startDay) {
        startIndex = i;
      }
      if (day === endDay) {
        endIndex = i;
      }
      if (i >= startIndex!) {
        daysBetween.push(i + 1);
        if (i === endIndex) {
          break;
        }
      }
    }
    return daysBetween;
  }


// Refactor this
// Maybe for accuracy adding the addition of ISO string to the recieved time
  function formatTime(timeString: string) {
    
    if (timeString.length === 3) {
      
      const splitCharThree = timeString.split("");
      const time = splitCharThree[0];
      const period = splitCharThree.splice(1).join("");
      const reformated = time + ":00" + " " + period.toUpperCase();
      const convertTime = DateTime.fromFormat(reformated, "t");
      return convertTime.toFormat("H");
    } else {
      const splitStr = timeString.split("");
      const time = splitStr[0] + splitStr[1];
      const period = splitStr.splice(2).join("");
      const reformated = time + ":00" + " " + period.toUpperCase();
      const convertTime = DateTime.fromFormat(reformated, "t");
      return convertTime.toFormat("HH:mm");
    }

  }


  function convertHoursTo24HourTime(startTime: string, endTime: string) {
    
    // Parse the time string using Luxon
    const startHour = parseInt(formatTime(startTime).split(":").shift()!);
    const endHour = parseInt(formatTime(endTime).split(":").shift()!);
    let availableTimes = [];
    if (startHour <= endHour) {
      // Case 1: End time is on the same day
      for (let i = startHour; i <= endHour; i++) {
        availableTimes.push(i);
      }
    } else {
      // Case 2: End time is on the next day
      for (let i = startHour; i < 24; i++) {
        availableTimes.push(i);
      }
      for (let i = 0; i <= endHour; i++) {
        availableTimes.push(i);
      }
    }
    return availableTimes;
  }


  const organisedClinics = clinicOpeningHours.map((clinic) => {
    const clinicName = clinic.name;

    const sortedTimes = clinic.openingHours.map((details) => {

      const seperateDaysAndHours = details.split(" ");

      const givenDaysOpen = seperateDaysAndHours
        .shift()
        ?.split("-")
        .join()
        .split(",") as Array<string>;
      
      // problem in determineOpenDays
      const daysOpen = determineOpenDays(givenDaysOpen[0], givenDaysOpen[1]);

      const hoursOpen = convertHoursTo24HourTime(
        seperateDaysAndHours[0],
        seperateDaysAndHours[2]
      );

      return { days: daysOpen, availableTimes: hoursOpen };
    });

    
    return { clinicName: clinicName, openTimes: sortedTimes };
  });
  
  return organisedClinics;
}

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

/* Todo: 
  Aug 12th 2024: 
  
  Refactoring program

  Add Type checking
*/