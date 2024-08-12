import { DateTime } from "luxon";
import { ParsedClinicOpeningHours } from "../src/open-clinics";
const daysOfWeek = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"];


/* 
Function to find matches, it takes three args, matches the given days and hours.
Returns the matches for clinics that are open in a dynamic array of clinic names
and sorts then alphabetically on return.
If no clinincs are open returns an empty array.
*/

export default function clinicsToMatch(parsedClinic: ParsedClinicOpeningHours, 
  dayToMatch: number, hourToMatch: number) {
  let foundMatches: Array<string> = [];

  parsedClinic.map((value) => {
    return value.openTimes.map((clinicInfo) => {
      const matchedDay = clinicInfo.days.find((day) => {
        return day === dayToMatch;
      });
      const matchedHour = clinicInfo.availableTimes.find((hour) => {
        return hour === hourToMatch;
      });
  
      if (matchedDay && matchedHour !== undefined) {
        foundMatches.push(value.clinicName);
      } else return false;
    });
  });

  return !foundMatches ? [] : foundMatches.sort();
}



export function sortClinicTimes(clinic: {name: string; openingHours: string[]}) {
  
  return clinic.openingHours.map((details) => {

    const [days, ...hours] = details.split(" ").filter(item => item !== 'to');
    
    const givenDaysOpen = days
      .split("-")
      .join()
      .split(",");

    const daysOpen = determineOpenDays(givenDaysOpen[0], givenDaysOpen[1]);

    const hoursOpen = determineHoursOpen(
      hours[0],
      hours[1]
    );

    return { days: daysOpen, availableTimes: hoursOpen };
  });
}


export function determineOpenDays(startDay: string, endDay: string): Array<number>{

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
export function formatTime(givenTimeFormat: string): string {
  
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


export function determineHoursOpen(startTime: string, endTime: string) {
      
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