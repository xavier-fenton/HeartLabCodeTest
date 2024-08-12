import { ParsedClinicOpeningHours } from "../src/open-clinics";


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