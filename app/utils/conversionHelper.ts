export type ConversionResult = {
  value: number;
  from: string;
  to: string;
  result: number;
  type: 'unit' | 'currency';
};

// Common unit conversion patterns and their normalized forms
const unitNormalization: { [key: string]: string } = {
  // Length
  'km': 'kilometers',
  'kilometer': 'kilometers',
  'mile': 'miles',
  'm': 'meters',
  'meter': 'meters',
  'cm': 'centimeters',
  'centimeter': 'centimeters',
  'mm': 'millimeters',
  'millimeter': 'millimeters',
  'in': 'inches',
  'inch': 'inches',
  '"': 'inches',
  'ft': 'feet',
  'foot': 'feet',
  "'": 'feet',
  'yd': 'yards',
  'yard': 'yards',
  
  // Weight/Mass
  'kg': 'kilograms',
  'kilogram': 'kilograms',
  'lb': 'pounds',
  'lbs': 'pounds',
  'pound': 'pounds',
  'g': 'grams',
  'gram': 'grams',
  'oz': 'ounces',
  'ounce': 'ounces',
  't': 'metric_tons',
  'ton': 'metric_tons',
  'tonne': 'metric_tons',
  'st': 'stones',
  'stone': 'stones',
  
  // Temperature
  'c': 'celsius',
  'f': 'fahrenheit',
  '°c': 'celsius',
  '°f': 'fahrenheit',
  'celsius': 'celsius',
  'centigrade': 'celsius',
  'fahrenheit': 'fahrenheit',
  
  // Volume
  'l': 'liters',
  'liter': 'liters',
  'gal': 'gallons',
  'gallon': 'gallons',
  'ml': 'milliliters',
  'milliliter': 'milliliters',
  'm³': 'cubic_meters',
  'cubic meter': 'cubic_meters',
  'cubic meters': 'cubic_meters',
  'ft³': 'cubic_feet',
  'cubic foot': 'cubic_feet',
  'cubic feet': 'cubic_feet',
  'fl oz': 'fluid_ounces',
  'fluid ounce': 'fluid_ounces',
  'fluid ounces': 'fluid_ounces',
  
  // Area
  'm²': 'square_meters',
  'square meter': 'square_meters',
  'square meters': 'square_meters',
  'ft²': 'square_feet',
  'square foot': 'square_feet',
  'square feet': 'square_feet',
  'ac': 'acres',
  'acre': 'acres',
  
  // Speed
  'mph': 'miles_per_hour',
  'kph': 'kilometers_per_hour',
  'km/h': 'kilometers_per_hour',
  'm/s': 'meters_per_second',
  
  // Digital Storage
  'b': 'bytes',
  'byte': 'bytes',
  'kb': 'kilobytes',
  'kilobyte': 'kilobytes',
  'mb': 'megabytes',
  'megabyte': 'megabytes',
  'gb': 'gigabytes',
  'gigabyte': 'gigabytes',
  'tb': 'terabytes',
  'terabyte': 'terabytes',
  
  // Energy
  'j': 'joules',
  'joule': 'joules',
  'kj': 'kilojoules',
  'kilojoule': 'kilojoules',
  'cal': 'calories',
  'calorie': 'calories',
  'kcal': 'kilocalories',
  'kilocalorie': 'kilocalories',
  'wh': 'watt_hours',
  'watt hour': 'watt_hours',
  'kwh': 'kilowatt_hours',
  'kilowatt hour': 'kilowatt_hours',
  
  // Pressure
  'pa': 'pascals',
  'pascal': 'pascals',
  'kpa': 'kilopascals',
  'kilopascal': 'kilopascals',
  'bar': 'bars',
  'psi': 'pounds_per_square_inch',
  'atm': 'atmospheres',
  'atmosphere': 'atmospheres',
  
  // Time
  'ms': 'milliseconds',
  'millisecond': 'milliseconds',
  's': 'seconds',
  'sec': 'seconds',
  'second': 'seconds',
  'min': 'minutes',
  'minute': 'minutes',
  'h': 'hours',
  'hr': 'hours',
  'hour': 'hours',
  'd': 'days',
  'day': 'days',
  'wk': 'weeks',
  'week': 'weeks',
  'mo': 'months',
  'month': 'months',
  'yr': 'years',
  'year': 'years',
  
  // Data Transfer Rate
  'bps': 'bits_per_second',
  'kbps': 'kilobits_per_second',
  'mbps': 'megabits_per_second',
  'gbps': 'gigabits_per_second',
  'b/s': 'bytes_per_second',
  'kb/s': 'kilobytes_per_second',
  'mb/s': 'megabytes_per_second',
  'gb/s': 'gigabytes_per_second',
};

const conversions: { [key: string]: { [key: string]: (val: number) => number } } = {
  // Length
  kilometers: {
    miles: (val) => val * 0.621371,
    meters: (val) => val * 1000,
    feet: (val) => val * 3280.84,
    inches: (val) => val * 39370.1,
    yards: (val) => val * 1093.61,
    millimeters: (val) => val * 1000000,
  },
  miles: {
    kilometers: (val) => val * 1.60934,
    meters: (val) => val * 1609.34,
    feet: (val) => val * 5280,
    inches: (val) => val * 63360,
    yards: (val) => val * 1760,
    millimeters: (val) => val * 1609344,
  },
  meters: {
    kilometers: (val) => val / 1000,
    miles: (val) => val / 1609.34,
    feet: (val) => val * 3.28084,
    inches: (val) => val * 39.3701,
    yards: (val) => val * 1.09361,
    millimeters: (val) => val * 1000,
  },
  feet: {
    kilometers: (val) => val / 3280.84,
    miles: (val) => val / 5280,
    meters: (val) => val / 3.28084,
    inches: (val) => val * 12,
    yards: (val) => val / 3,
    millimeters: (val) => val * 304.8,
  },
  inches: {
    kilometers: (val) => val / 39370.1,
    miles: (val) => val / 63360,
    meters: (val) => val / 39.3701,
    feet: (val) => val / 12,
    yards: (val) => val / 36,
    millimeters: (val) => val * 25.4,
  },
  yards: {
    kilometers: (val) => val / 1093.61,
    miles: (val) => val / 1760,
    meters: (val) => val / 1.09361,
    feet: (val) => val * 3,
    inches: (val) => val * 36,
    millimeters: (val) => val * 914.4,
  },
  millimeters: {
    kilometers: (val) => val / 1000000,
    miles: (val) => val / 1609344,
    meters: (val) => val / 1000,
    feet: (val) => val / 304.8,
    inches: (val) => val / 25.4,
    yards: (val) => val / 914.4,
  },
  
  // Weight/Mass
  kilograms: {
    pounds: (val) => val * 2.20462,
    grams: (val) => val * 1000,
    ounces: (val) => val * 35.274,
    metric_tons: (val) => val / 1000,
    stones: (val) => val * 0.157473,
  },
  pounds: {
    kilograms: (val) => val / 2.20462,
    grams: (val) => val * 453.592,
    ounces: (val) => val * 16,
    metric_tons: (val) => val / 2204.62,
    stones: (val) => val * 0.0714286,
  },
  grams: {
    kilograms: (val) => val / 1000,
    pounds: (val) => val / 453.592,
    ounces: (val) => val / 28.3495,
    metric_tons: (val) => val / 1000000,
    stones: (val) => val / 6350.29,
  },
  ounces: {
    kilograms: (val) => val / 35.274,
    pounds: (val) => val / 16,
    grams: (val) => val * 28.3495,
    metric_tons: (val) => val / 35274,
    stones: (val) => val / 224,
  },
  metric_tons: {
    kilograms: (val) => val * 1000,
    pounds: (val) => val * 2204.62,
    grams: (val) => val * 1000000,
    ounces: (val) => val * 35274,
    stones: (val) => val * 157.473,
  },
  stones: {
    kilograms: (val) => val / 0.157473,
    pounds: (val) => val * 14,
    grams: (val) => val * 6350.29,
    ounces: (val) => val * 224,
    metric_tons: (val) => val / 157.473,
  },
  
  // Temperature
  celsius: {
    fahrenheit: (val) => (val * 9/5) + 32,
  },
  fahrenheit: {
    celsius: (val) => (val - 32) * 5/9,
  },
  
  // Volume
  liters: {
    gallons: (val) => val * 0.264172,
    milliliters: (val) => val * 1000,
    cubic_meters: (val) => val / 1000,
    cubic_feet: (val) => val / 28.3168,
    fluid_ounces: (val) => val * 33.814,
  },
  gallons: {
    liters: (val) => val / 0.264172,
    milliliters: (val) => val * 3785.41,
    cubic_meters: (val) => val / 264.172,
    cubic_feet: (val) => val * 0.133681,
    fluid_ounces: (val) => val * 128,
  },
  milliliters: {
    liters: (val) => val / 1000,
    gallons: (val) => val / 3785.41,
    cubic_meters: (val) => val / 1000000,
    cubic_feet: (val) => val / 28316.8,
    fluid_ounces: (val) => val / 29.5735,
  },
  cubic_meters: {
    liters: (val) => val * 1000,
    gallons: (val) => val * 264.172,
    milliliters: (val) => val * 1000000,
    cubic_feet: (val) => val * 35.3147,
    fluid_ounces: (val) => val * 33814,
  },
  cubic_feet: {
    liters: (val) => val * 28.3168,
    gallons: (val) => val / 0.133681,
    milliliters: (val) => val * 28316.8,
    cubic_meters: (val) => val / 35.3147,
    fluid_ounces: (val) => val * 957.506,
  },
  fluid_ounces: {
    liters: (val) => val / 33.814,
    gallons: (val) => val / 128,
    milliliters: (val) => val * 29.5735,
    cubic_meters: (val) => val / 33814,
    cubic_feet: (val) => val / 957.506,
  },
  
  // Area
  square_meters: {
    square_feet: (val) => val * 10.7639,
    acres: (val) => val / 4046.86,
  },
  square_feet: {
    square_meters: (val) => val / 10.7639,
    acres: (val) => val / 43560,
  },
  acres: {
    square_meters: (val) => val * 4046.86,
    square_feet: (val) => val * 43560,
  },
  
  // Speed
  miles_per_hour: {
    kilometers_per_hour: (val) => val * 1.60934,
    meters_per_second: (val) => val / 2.237,
  },
  kilometers_per_hour: {
    miles_per_hour: (val) => val / 1.60934,
    meters_per_second: (val) => val / 3.6,
  },
  meters_per_second: {
    miles_per_hour: (val) => val * 2.237,
    kilometers_per_hour: (val) => val * 3.6,
  },
  
  // Digital Storage
  bytes: {
    kilobytes: (val) => val / 1024,
    megabytes: (val) => val / (1024 * 1024),
    gigabytes: (val) => val / (1024 * 1024 * 1024),
    terabytes: (val) => val / (1024 * 1024 * 1024 * 1024),
  },
  kilobytes: {
    bytes: (val) => val * 1024,
    megabytes: (val) => val / 1024,
    gigabytes: (val) => val / (1024 * 1024),
    terabytes: (val) => val / (1024 * 1024 * 1024),
  },
  megabytes: {
    bytes: (val) => val * 1024 * 1024,
    kilobytes: (val) => val * 1024,
    gigabytes: (val) => val / 1024,
    terabytes: (val) => val / (1024 * 1024),
  },
  gigabytes: {
    bytes: (val) => val * 1024 * 1024 * 1024,
    kilobytes: (val) => val * 1024 * 1024,
    megabytes: (val) => val * 1024,
    terabytes: (val) => val / 1024,
  },
  terabytes: {
    bytes: (val) => val * 1024 * 1024 * 1024 * 1024,
    kilobytes: (val) => val * 1024 * 1024 * 1024,
    megabytes: (val) => val * 1024 * 1024,
    gigabytes: (val) => val * 1024,
  },
  
  // Energy
  joules: {
    kilojoules: (val) => val / 1000,
    calories: (val) => val / 4.184,
    kilocalories: (val) => val / 4184,
    watt_hours: (val) => val / 3600,
    kilowatt_hours: (val) => val / 3600000,
  },
  kilojoules: {
    joules: (val) => val * 1000,
    calories: (val) => val * 239.006,
    kilocalories: (val) => val / 4.184,
    watt_hours: (val) => val / 3.6,
    kilowatt_hours: (val) => val / 3600,
  },
  calories: {
    joules: (val) => val * 4.184,
    kilojoules: (val) => val / 239.006,
    kilocalories: (val) => val / 1000,
    watt_hours: (val) => val / 860.421,
    kilowatt_hours: (val) => val / 860421,
  },
  kilocalories: {
    joules: (val) => val * 4184,
    kilojoules: (val) => val * 4.184,
    calories: (val) => val * 1000,
    watt_hours: (val) => val * 1.162,
    kilowatt_hours: (val) => val / 860.421,
  },
  watt_hours: {
    joules: (val) => val * 3600,
    kilojoules: (val) => val * 3.6,
    calories: (val) => val * 860.421,
    kilocalories: (val) => val / 1.162,
    kilowatt_hours: (val) => val / 1000,
  },
  kilowatt_hours: {
    joules: (val) => val * 3600000,
    kilojoules: (val) => val * 3600,
    calories: (val) => val * 860421,
    kilocalories: (val) => val * 860.421,
    watt_hours: (val) => val * 1000,
  },
  
  // Pressure
  pascals: {
    kilopascals: (val) => val / 1000,
    bars: (val) => val / 100000,
    pounds_per_square_inch: (val) => val / 6894.76,
    atmospheres: (val) => val / 101325,
  },
  kilopascals: {
    pascals: (val) => val * 1000,
    bars: (val) => val / 100,
    pounds_per_square_inch: (val) => val / 6.89476,
    atmospheres: (val) => val / 101.325,
  },
  bars: {
    pascals: (val) => val * 100000,
    kilopascals: (val) => val * 100,
    pounds_per_square_inch: (val) => val * 14.5038,
    atmospheres: (val) => val / 1.01325,
  },
  pounds_per_square_inch: {
    pascals: (val) => val * 6894.76,
    kilopascals: (val) => val * 6.89476,
    bars: (val) => val / 14.5038,
    atmospheres: (val) => val / 14.6959,
  },
  atmospheres: {
    pascals: (val) => val * 101325,
    kilopascals: (val) => val * 101.325,
    bars: (val) => val * 1.01325,
    pounds_per_square_inch: (val) => val * 14.6959,
  },
  
  // Time
  milliseconds: {
    seconds: (val) => val / 1000,
    minutes: (val) => val / 60000,
    hours: (val) => val / 3600000,
    days: (val) => val / 86400000,
    weeks: (val) => val / 604800000,
    months: (val) => val / 2629800000,
    years: (val) => val / 31557600000,
  },
  seconds: {
    milliseconds: (val) => val * 1000,
    minutes: (val) => val / 60,
    hours: (val) => val / 3600,
    days: (val) => val / 86400,
    weeks: (val) => val / 604800,
    months: (val) => val / 2629800,
    years: (val) => val / 31557600,
  },
  minutes: {
    milliseconds: (val) => val * 60000,
    seconds: (val) => val * 60,
    hours: (val) => val / 60,
    days: (val) => val / 1440,
    weeks: (val) => val / 10080,
    months: (val) => val / 43830,
    years: (val) => val / 525960,
  },
  hours: {
    milliseconds: (val) => val * 3600000,
    seconds: (val) => val * 3600,
    minutes: (val) => val * 60,
    days: (val) => val / 24,
    weeks: (val) => val / 168,
    months: (val) => val / 730.5,
    years: (val) => val / 8766,
  },
  days: {
    milliseconds: (val) => val * 86400000,
    seconds: (val) => val * 86400,
    minutes: (val) => val * 1440,
    hours: (val) => val * 24,
    weeks: (val) => val / 7,
    months: (val) => val / 30.4375,
    years: (val) => val / 365.25,
  },
  weeks: {
    milliseconds: (val) => val * 604800000,
    seconds: (val) => val * 604800,
    minutes: (val) => val * 10080,
    hours: (val) => val * 168,
    days: (val) => val * 7,
    months: (val) => val / 4.348125,
    years: (val) => val / 52.17857,
  },
  months: {
    milliseconds: (val) => val * 2629800000,
    seconds: (val) => val * 2629800,
    minutes: (val) => val * 43830,
    hours: (val) => val * 730.5,
    days: (val) => val * 30.4375,
    weeks: (val) => val * 4.348125,
    years: (val) => val / 12,
  },
  years: {
    milliseconds: (val) => val * 31557600000,
    seconds: (val) => val * 31557600,
    minutes: (val) => val * 525960,
    hours: (val) => val * 8766,
    days: (val) => val * 365.25,
    weeks: (val) => val * 52.17857,
    months: (val) => val * 12,
  },
  
  // Data Transfer Rate
  bits_per_second: {
    kilobits_per_second: (val) => val / 1000,
    megabits_per_second: (val) => val / 1000000,
    gigabits_per_second: (val) => val / 1000000000,
    bytes_per_second: (val) => val / 8,
    kilobytes_per_second: (val) => val / 8000,
    megabytes_per_second: (val) => val / 8000000,
    gigabytes_per_second: (val) => val / 8000000000,
  },
  kilobits_per_second: {
    bits_per_second: (val) => val * 1000,
    megabits_per_second: (val) => val / 1000,
    gigabits_per_second: (val) => val / 1000000,
    bytes_per_second: (val) => val * 125,
    kilobytes_per_second: (val) => val / 8,
    megabytes_per_second: (val) => val / 8000,
    gigabytes_per_second: (val) => val / 8000000,
  },
  megabits_per_second: {
    bits_per_second: (val) => val * 1000000,
    kilobits_per_second: (val) => val * 1000,
    gigabits_per_second: (val) => val / 1000,
    bytes_per_second: (val) => val * 125000,
    kilobytes_per_second: (val) => val * 125,
    megabytes_per_second: (val) => val / 8,
    gigabytes_per_second: (val) => val / 8000,
  },
  gigabits_per_second: {
    bits_per_second: (val) => val * 1000000000,
    kilobits_per_second: (val) => val * 1000000,
    megabits_per_second: (val) => val * 1000,
    bytes_per_second: (val) => val * 125000000,
    kilobytes_per_second: (val) => val * 125000,
    megabytes_per_second: (val) => val * 125,
    gigabytes_per_second: (val) => val / 8,
  },
  bytes_per_second: {
    bits_per_second: (val) => val * 8,
    kilobits_per_second: (val) => val / 125,
    megabits_per_second: (val) => val / 125000,
    gigabits_per_second: (val) => val / 125000000,
    kilobytes_per_second: (val) => val / 1024,
    megabytes_per_second: (val) => val / 1048576,
    gigabytes_per_second: (val) => val / 1073741824,
  },
  kilobytes_per_second: {
    bits_per_second: (val) => val * 8000,
    kilobits_per_second: (val) => val * 8,
    megabits_per_second: (val) => val / 125,
    gigabits_per_second: (val) => val / 125000,
    bytes_per_second: (val) => val * 1024,
    megabytes_per_second: (val) => val / 1024,
    gigabytes_per_second: (val) => val / 1048576,
  },
  megabytes_per_second: {
    bits_per_second: (val) => val * 8000000,
    kilobits_per_second: (val) => val * 8000,
    megabits_per_second: (val) => val * 8,
    gigabits_per_second: (val) => val / 125,
    bytes_per_second: (val) => val * 1048576,
    kilobytes_per_second: (val) => val * 1024,
    gigabytes_per_second: (val) => val / 1024,
  },
  gigabytes_per_second: {
    bits_per_second: (val) => val * 8000000000,
    kilobits_per_second: (val) => val * 8000000,
    megabits_per_second: (val) => val * 8000,
    gigabits_per_second: (val) => val * 8,
    bytes_per_second: (val) => val * 1073741824,
    kilobytes_per_second: (val) => val * 1048576,
    megabytes_per_second: (val) => val * 1024,
  },
};

export const detectConversion = (input: string): ConversionResult | null => {
  try {
    // Regular expression to match conversion patterns
    // Example: "convert 100 km to miles" or "100 km to miles" or "100 kilometers to miles"
    const regex = /(?:convert\s+)?(\d+(?:\.\d+)?)\s+([a-zA-Z°]+)\s+(?:to|in)\s+([a-zA-Z°]+)/i;
    const match = input.match(regex);

    if (!match) return null;

    const value = parseFloat(match[1]);
    const fromUnit = unitNormalization[match[2].toLowerCase()] || match[2].toLowerCase();
    const toUnit = unitNormalization[match[3].toLowerCase()] || match[3].toLowerCase();

    if (!conversions[fromUnit] || !conversions[fromUnit][toUnit]) {
      return null;
    }

    const result = conversions[fromUnit][toUnit](value);

    return {
      value,
      from: fromUnit,
      to: toUnit,
      result,
      type: 'unit'
    };
  } catch (error) {
    console.error('Error detecting conversion:', error);
    return null;
  }
};

export const formatConversionResult = (result: ConversionResult): string => {
  return `${result.value} ${result.from} = ${result.result.toFixed(2)} ${result.to}`;
}; 