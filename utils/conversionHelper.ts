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
  'mi': 'miles',
  'm': 'meters',
  'meter': 'meters',
  'cm': 'centimeters',
  'centimeter': 'centimeters',
  'in': 'inches',
  'inch': 'inches',
  '"': 'inches',
  'ft': 'feet',
  'foot': 'feet',
  "'": 'feet',
  'yd': 'yards',
  'yard': 'yards',
  
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
  'cup': 'cups',
  'cups': 'cups',
  
  // Area
  'm2': 'squaremeters',
  'm²': 'squaremeters',
  'square meter': 'squaremeters',
  'square meters': 'squaremeters',
  'ft2': 'squarefeet',
  'ft²': 'squarefeet',
  'square foot': 'squarefeet',
  'square feet': 'squarefeet',
  'acre': 'acres',
  'acres': 'acres',
  'ha': 'hectares',
  'hectare': 'hectares',
  'hectares': 'hectares',
  
  // Speed
  'mph': 'milesperhour',
  'miles per hour': 'milesperhour',
  'kph': 'kilometersperhour',
  'kmh': 'kilometersperhour',
  'km/h': 'kilometersperhour',
  'kilometers per hour': 'kilometersperhour',
  
  // Data
  'kb': 'kilobytes',
  'kilobyte': 'kilobytes',
  'kilobytes': 'kilobytes',
  'mb': 'megabytes',
  'megabyte': 'megabytes',
  'megabytes': 'megabytes',
  'gb': 'gigabytes',
  'gigabyte': 'gigabytes',
  'gigabytes': 'gigabytes',
  'tb': 'terabytes',
  'terabyte': 'terabytes',
  'terabytes': 'terabytes',
};

const conversions: { [key: string]: { [key: string]: (val: number) => number } } = {
  // Length
  kilometers: {
    miles: (val) => val * 0.621371,
    meters: (val) => val * 1000,
    feet: (val) => val * 3280.84,
    inches: (val) => val * 39370.1,
  },
  miles: {
    kilometers: (val) => val * 1.60934,
    meters: (val) => val * 1609.34,
    feet: (val) => val * 5280,
    inches: (val) => val * 63360,
  },
  meters: {
    kilometers: (val) => val / 1000,
    miles: (val) => val / 1609.34,
    feet: (val) => val * 3.28084,
    inches: (val) => val * 39.3701,
  },
  feet: {
    kilometers: (val) => val / 3280.84,
    miles: (val) => val / 5280,
    meters: (val) => val / 3.28084,
    inches: (val) => val * 12,
  },
  inches: {
    kilometers: (val) => val / 39370.1,
    miles: (val) => val / 63360,
    meters: (val) => val / 39.3701,
    feet: (val) => val / 12,
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
  ounces: {
    kilograms: (val) => val / 35.274,
    pounds: (val) => val / 16,
    grams: (val) => val * 28.3495,
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
    cups: (val) => val * 4.22675,
  },
  gallons: {
    liters: (val) => val / 0.264172,
    milliliters: (val) => val * 3785.41,
    cups: (val) => val * 16,
  },
  milliliters: {
    liters: (val) => val / 1000,
    gallons: (val) => val / 3785.41,
    cups: (val) => val / 236.588,
  },
  cups: {
    milliliters: (val) => val * 236.588,
    liters: (val) => val / 4.22675,
    gallons: (val) => val / 16,
  },
  
  // Area
  squaremeters: {
    squarefeet: (val) => val * 10.7639,
    acres: (val) => val * 0.000247105,
    hectares: (val) => val * 0.0001,
  },
  squarefeet: {
    squaremeters: (val) => val / 10.7639,
    acres: (val) => val * 0.0000229568,
    hectares: (val) => val * 0.00000929,
  },
  acres: {
    squaremeters: (val) => val / 0.000247105,
    squarefeet: (val) => val / 0.0000229568,
    hectares: (val) => val * 0.404686,
  },
  hectares: {
    squaremeters: (val) => val / 0.0001,
    squarefeet: (val) => val / 0.00000929,
    acres: (val) => val / 0.404686,
  },
  
  // Speed
  milesperhour: {
    kilometersperhour: (val) => val * 1.60934,
  },
  kilometersperhour: {
    milesperhour: (val) => val / 1.60934,
  },
  
  // Data
  kilobytes: {
    megabytes: (val) => val / 1024,
    gigabytes: (val) => val / (1024 * 1024),
    terabytes: (val) => val / (1024 * 1024 * 1024),
  },
  megabytes: {
    kilobytes: (val) => val * 1024,
    gigabytes: (val) => val / 1024,
    terabytes: (val) => val / (1024 * 1024),
  },
  gigabytes: {
    kilobytes: (val) => val * 1024 * 1024,
    megabytes: (val) => val * 1024,
    terabytes: (val) => val / 1024,
  },
  terabytes: {
    kilobytes: (val) => val * 1024 * 1024 * 1024,
    megabytes: (val) => val * 1024 * 1024,
    gigabytes: (val) => val * 1024,
  },
};

export const detectConversion = (input: string, previousValue?: string): ConversionResult | null => {
  try {
    // Regular expressions to match different conversion patterns
    const valuePattern = /(?:convert\s+)?(\d+(?:\.\d+)?)\s+([a-zA-Z°]+)\s+(?:to|in)\s+([a-zA-Z°]+)/i;
    const fromToPattern = /(?:convert\s+)?(?:from\s+)?([a-zA-Z°]+)\s+(?:to|in)\s+([a-zA-Z°]+)/i;
    const simplePattern = /([a-zA-Z°]+)\s+(?:to|in)\s+([a-zA-Z°]+)/i;
    
    let match = input.match(valuePattern);
    let value: number;
    let fromUnit: string;
    let toUnit: string;

    if (match) {
      // Handle pattern: "convert 100 km to miles" or "100 km to miles"
      value = parseFloat(match[1]);
      fromUnit = unitNormalization[match[2].toLowerCase()] || match[2].toLowerCase();
      toUnit = unitNormalization[match[3].toLowerCase()] || match[3].toLowerCase();
    } else {
      // Try the from-to pattern first
      match = input.match(fromToPattern);
      if (!match) {
        // Try the simplest pattern as fallback
        match = input.match(simplePattern);
      }
      
      if (!match) {
        console.log('No pattern match found for input:', input);
        return null;
      }
      
      // If we have a previous value, use it
      if (!previousValue) {
        console.log('No previous value available');
        return null;
      }
      value = parseFloat(previousValue);
      fromUnit = unitNormalization[match[1].toLowerCase()] || match[1].toLowerCase();
      toUnit = unitNormalization[match[2].toLowerCase()] || match[2].toLowerCase();
    }

    console.log('Conversion attempt:', {
      value,
      fromUnit,
      toUnit,
      hasConversion: !!conversions[fromUnit],
      hasTargetUnit: conversions[fromUnit] ? !!conversions[fromUnit][toUnit] : false
    });

    // Validate the units
    if (!conversions[fromUnit] || !conversions[fromUnit][toUnit]) {
      console.log('Invalid conversion path:', fromUnit, 'to', toUnit);
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

const performConversion = async (data: Omit<ConversionResult, 'result'>): Promise<number> => {
  if (data.type === 'currency') {
    return await convertCurrency(data.value, data.from, data.to);
  }
  return convertUnit(data.value, data.from, data.to);
};

const convertUnit = (value: number, from: string, to: string): number => {
  // Basic conversion formulas
  const conversions: { [key: string]: { [key: string]: (val: number) => number } } = {
    miles: {
      kilometers: (val) => val * 1.60934,
    },
    kilometers: {
      miles: (val) => val / 1.60934,
    },
    celsius: {
      fahrenheit: (val) => (val * 9/5) + 32,
    },
    fahrenheit: {
      celsius: (val) => (val - 32) * 5/9,
    },
    pounds: {
      kilograms: (val) => val * 0.453592,
    },
    kilograms: {
      pounds: (val) => val / 0.453592,
    },
    // Add more conversions as needed
  };

  if (conversions[from]?.[to]) {
    return conversions[from][to](value);
  }
  
  throw new Error(`Conversion from ${from} to ${to} not supported`);
};

const convertCurrency = async (value: number, from: string, to: string): Promise<number> => {
  try {
    // Using Exchange Rate API (you'll need to sign up for an API key)
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`
    );
    const data = await response.json();
    const rate = data.rates[to.toUpperCase()];
    return value * rate;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw new Error('Currency conversion failed');
  }
};

export const formatConversionResult = (result: ConversionResult): string => {
  return `${result.value} ${result.from} = ${result.result.toFixed(2)} ${result.to}`;
}; 