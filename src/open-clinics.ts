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



export function parseClinicOpeningHours(
  clinicOpeningHours: ClinicOpeningHours
): ParsedClinicOpeningHours {
  
  /*
  Todo:Refactor readiablity
  
  I want to make this code readable, eg change naming conventions, know just by 
  reading each line that it's comprehensive.
  
  */
 
 const daysOfWeek = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"];

function determineOpenDays(startDay: string, endDay: string): Array<number>{

    let daysOpen: Array<number> = [];

    let startingIndex;
    let endingIndex;
    
    for (let i = 0; i < daysOfWeek.length; i++) {

      switch (daysOfWeek[i]) {
        case startDay:
          startingIndex = i;
          break;
        case endDay:
            endingIndex = i;
            break;   
        default:
          break;
      }
    if (startingIndex !== undefined && (i >= startingIndex)){        
          daysOpen.push(i);
          if (i === endingIndex) {
            break;
          }
        }

    }
    
    
    return daysOpen
  }


  /**Returns 24hour time as string*/
  function formatTime(givenTimeFormat: string): string {
    
    // for singleDigitTime
    if (givenTimeFormat.length === 3) {
      const [time, ...period] = givenTimeFormat
      .split("")
      .join("")

      const reformated = `${time}:00 ${period.join("").toUpperCase()}`;
      
      return DateTime
      .fromFormat(reformated, "t")
      .toFormat("H").split(":").shift() as string;

      
    } else {

      const doubleDigit = givenTimeFormat
      .split("")
      .splice(0, 2)
      .join("");   

      const period = givenTimeFormat
      .split("")
      .splice(2)
      .join("");

      const reformated = `${doubleDigit}:00 ${period.toUpperCase()}`;
      
      return DateTime
      .fromFormat(reformated, "t")
      .toFormat("HH:mm").split(":").shift() as string;
    }

  }


  function determineHoursOpen(startTime: string, endTime: string) {
        
    let startHour = parseInt(formatTime(startTime));
    let endHour = parseInt(formatTime(endTime));
    
    let availableTimes = [];
    
    /* 
      Find times available by determining the inbetween opening hours of
      the given start and end hours.
    */
    if (startHour <= endHour) {
      // Case 1: End time is on the same day
      for (let i = startHour; i <= endHour; i++) {
        availableTimes.push(i);
      }
    } else {
      // Case 2: End time is on the next day
      // I will stop at 24 here
      for (let i = startHour; i < 24; i++) {
        availableTimes.push(i);
      }
      // I is added after a number has reached 24 eg. [...,24,0,1,2]
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

      const hoursOpen = determineHoursOpen(
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