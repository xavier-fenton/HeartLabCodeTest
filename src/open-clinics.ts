import { DateTime } from "luxon";
import {
  exampleClinicOpeningHours,
  type ClinicOpeningHours,
} from "../data/example-clinic-opening-hours";

type ParsedClinicOpeningHours = {
  clinicName: string;
  sortedTime: {
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
    // make days into numbers
    // eg: Monday = 1

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
        // Makes index start from 1 rather that monday === 0
        daysBetween.push(i + 1);
        if (i === endIndex) {
          break;
        }
      }
    }
    return daysBetween;
  }

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

    // Parse the time string using Luxon
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
  // TODO
  const sortClinic = clinicOpeningHours.map((clinic) => {
    const clinicName = clinic.name;

    const sortTime = clinic.openingHours.map((details, index) => {
      const seperateTimes = details.split(" ");
      const daysOpen = seperateTimes
        .shift()
        ?.split("-")
        .join()
        .split(",") as Array<string>;

      // problem in determineOpenDays
      const days = determineOpenDays(daysOpen[0], daysOpen[1]);

      const hours = convertHoursTo24HourTime(
        seperateTimes[0],
        seperateTimes[2]
      );

      return { days: days, availableTimes: hours };
    });

    return { clinicName: clinicName, sortedTime: sortTime };
  });

  return sortClinic;
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
  // Todo: Reduce the clinics being parsed
  //       I need to some how simplify the matching process from the parsed data not sure how

  /* Reason: Why I think I've over complicated this, is because 
  I haven't taken use of the luxon library.
  For now I will treat as hardcoded, meaning I will need to refactor this
  majorly.

*/

  const parsedClinic = parseClinicOpeningHours(exampleClinicOpeningHours);

  /* TODO:  

 clinicsToMatch is incorrect needs to be re-written
 I need to sort properly for each use case
 I need to return the matching values from here
 
 Probably will turn into a function

 After getting this function working for each test and newly created ones
 - then I will refactor this whole program


*/
  const hourToMatch = queryTime.hour;
  const dayToMatch = queryTime.day;

  let foundMatches: Array<string> = [];
  const noMatch = "No Clinics Open";

  const clinicsToMatch = parsedClinic.map((value) => {
    const matches = value.sortedTime.map((clinicInfo) => {
      const matchedDay = clinicInfo.days.find((day) => {
        return day == dayToMatch;
      });
      const matchedHour = clinicInfo.availableTimes.find((hour) => {
        return hour == hourToMatch;
      });

      if (matchedDay && matchedHour !== undefined) {
        foundMatches.push(value.clinicName);
      } else return false;
    });
  });

  return !foundMatches ? [] : foundMatches.sort();
}
