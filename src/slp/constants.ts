const currentYear = new Date().getFullYear();

// winter
// 1.11 - 20.3
const winterStart = new Date(currentYear, 10, 1);
const winterEnd = new Date(currentYear, 2, 20);

// summer
// 15.5 - 14.9
const summerStart = new Date(currentYear, 4, 15);
const summerEnd = new Date(currentYear, 8, 14);

// transition
// 21.3 - 14.5
const transition1Start = new Date(currentYear, 2, 21);
const transition1End = new Date(currentYear, 5, 14);

// transition
// 25.9 - 31.10
const transition2Start = new Date(currentYear, 9, 15);
const transition2End = new Date(currentYear, 10, 31);

// holidays// You might want to extend this list based on your country's holidays
const HOLIDAYS = [
  `${currentYear}-01-01`, // New Year's Day
  `${currentYear}-12-25`, // Christmas
  `${currentYear}-12-26`, // Christmas
  `${currentYear}-12-31`, // New Year's Eve
];


export { winterStart, winterEnd, summerStart, summerEnd, transition1Start, transition1End, transition2Start, transition2End, HOLIDAYS };
