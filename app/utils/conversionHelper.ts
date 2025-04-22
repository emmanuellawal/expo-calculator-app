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
  'inch': 'inches',
  'ft': 'feet',
  'foot': 'feet',
  
  // Weight
  'kg': 'kilograms',
  'kilogram': 'kilograms',
  'lb': 'pounds',
  'lbs': 'pounds',
  'pound': 'pounds',
  'g': 'grams',
  'gram': 'grams',
  'oz': 'ounces',
  'ounce': 'ounces',
  
  // Temperature
  'c': 'celsius',
  'f': 'fahrenheit',
  '°c': 'celsius',
  '°f': 'fahrenheit',
  
  // Volume
  'l': 'liters',
  'liter': 'liters',
  'gal': 'gallons',
  'gallon': 'gallons',
  'ml': 'milliliters',
  'milliliter': 'milliliters'
};

const conversions: { [key: string]: { [key: string]: (val: number) => number } } = {
  // Length
  kilometers: {
    miles: (val) => val * 0.621371,
    meters: (val) => val * 1000,
    feet: (val) => val * 3280.84,
  },
  miles: {
    kilometers: (val) => val * 1.60934,
    meters: (val) => val * 1609.34,
    feet: (val) => val * 5280,
  },
  meters: {
    kilometers: (val) => val / 1000,
    miles: (val) => val / 1609.34,
    feet: (val) => val * 3.28084,
  },
  feet: {
    kilometers: (val) => val / 3280.84,
    miles: (val) => val / 5280,
    meters: (val) => val / 3.28084,
  },
  
  // Weight
  kilograms: {
    pounds: (val) => val * 2.20462,
    grams: (val) => val * 1000,
    ounces: (val) => val * 35.274,
  },
  pounds: {
    kilograms: (val) => val / 2.20462,
    grams: (val) => val * 453.592,
    ounces: (val) => val * 16,
  },
  grams: {
    kilograms: (val) => val / 1000,
    pounds: (val) => val / 453.592,
    ounces: (val) => val / 28.3495,
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
  },
  gallons: {
    liters: (val) => val / 0.264172,
    milliliters: (val) => val * 3785.41,
  },
  milliliters: {
    liters: (val) => val / 1000,
    gallons: (val) => val / 3785.41,
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