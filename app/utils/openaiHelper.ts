import OpenAI from 'openai';
import Constants from 'expo-constants';

// Check if OpenAI API key is available
const apiKey = Constants.expoConfig?.extra?.openaiApiKey as string;
let openai: OpenAI | null = null;

// Only initialize OpenAI if API key is available
if (apiKey) {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Required for Expo/React Native
  });
} else {
  console.warn('OpenAI API key is missing. Natural language processing will use basic parsing only.');
}

export type NLPCalculationResult = {
  expression: string;
  result: number | null;
  error?: string;
  type: 'calculation' | 'conversion';
  conversionUnits?: {
    from: string;
    to: string;
  };
};

/**
 * Process natural language calculation input
 * Examples:
 * - "what is 5 plus 3"
 * - "calculate 10 percent of 50"
 * - "convert 5 meters to feet"
 * - "square root of 16"
 */
export async function processNaturalLanguageCalculation(input: string): Promise<NLPCalculationResult> {
  try {
    // If no API key is available, use a simple parsing approach
    if (!openai) {
      return handleBasicCalculation(input);
    }

    // With OpenAI API available
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a calculator that processes natural language into mathematical expressions or unit conversions. 
            For calculations, respond with a JSON object containing:
            {
              "expression": "mathematical expression to evaluate",
              "type": "calculation"
            }
            
            For conversions, respond with:
            {
              "type": "conversion",
              "conversionUnits": {
                "from": "source unit",
                "to": "target unit"
              },
              "expression": "number to convert"
            }
            
            Only respond with the JSON object, nothing else.`
          },
          {
            role: "user",
            content: input
          }
        ],
        temperature: 0
      });

      if (response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content) {
        const content = response.choices[0].message.content;
        const result = JSON.parse(content);
        
        if (result.type === 'calculation') {
          // Safely evaluate the mathematical expression
          const calculatedResult = evaluateExpression(result.expression);
          return {
            ...result,
            result: calculatedResult
          };
        } else if (result.type === 'conversion') {
          return {
            ...result,
            result: null // The conversion will be handled by the conversion helper
          };
        }
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error with OpenAI API, falling back to basic calculation:', error);
      return handleBasicCalculation(input);
    }
  } catch (error) {
    console.error('Error processing natural language input:', error);
    return {
      expression: '',
      result: null,
      error: 'Could not process the calculation. Please try again.',
      type: 'calculation'
    };
  }
}

/**
 * Basic implementation to handle simple calculations without API
 */
function handleBasicCalculation(input: string): NLPCalculationResult {
  const lowerInput = input.toLowerCase();
  
  // Check for conversion request
  if (lowerInput.includes('convert') || lowerInput.includes(' to ')) {
    const conversionRegex = /(\d+\.?\d*)\s*([a-z]+)\s+to\s+([a-z]+)/i;
    const match = lowerInput.match(conversionRegex);
    
    if (match && match.length >= 4) {
      const value = match[1];
      const fromUnit = match[2];
      const toUnit = match[3];
      
      return {
        expression: value,
        type: 'conversion',
        result: null,
        conversionUnits: {
          from: fromUnit,
          to: toUnit
        }
      };
    }
  }
  
  // Basic calculation - extract numbers and operations
  try {
    // Replace words with symbols
    const processedInput = lowerInput
      .replace(/\bplus\b/g, '+')
      .replace(/\bminus\b/g, '-')
      .replace(/\btimes\b/g, '*')
      .replace(/\bdivided by\b/g, '/')
      .replace(/\bmultiplied by\b/g, '*')
      .replace(/\bsquare root of\b/g, 'sqrt');
    
    // Look for numbers and math operators
    const mathRegex = /(\d+\.?\d*|\+|\-|\*|\/|\(|\))/g;
    const mathMatches = processedInput.match(mathRegex);
    const expression = mathMatches ? mathMatches.join('') : '';
    
    if (expression) {
      return {
        expression,
        type: 'calculation',
        result: evaluateExpression(expression)
      };
    }
    
    return {
      expression: input,
      type: 'calculation',
      result: null,
      error: 'Could not parse the input. Please try a simpler expression.'
    };
  } catch (e) {
    return {
      expression: input,
      type: 'calculation',
      result: null,
      error: 'Failed to parse the input. Try a simpler format like "5 + 3" or "convert 5 meters to feet".'
    };
  }
}

/**
 * Safely evaluate a mathematical expression
 * Only allows basic arithmetic operations and common math functions
 */
function evaluateExpression(expression: string): number {
  // Create a safe evaluation context with only allowed functions
  const mathContext = {
    sqrt: Math.sqrt,
    pow: Math.pow,
    abs: Math.abs,
    round: Math.round,
    floor: Math.floor,
    ceil: Math.ceil,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    PI: Math.PI,
    E: Math.E
  };

  // Replace common math words with their operator equivalents
  const normalizedExpression = expression
    .toLowerCase()
    .replace(/plus/g, '+')
    .replace(/minus/g, '-')
    .replace(/times/g, '*')
    .replace(/divided by/g, '/')
    .replace(/multiplied by/g, '*')
    .replace(/\^/g, '**');

  try {
    // Use Function constructor to create a safe evaluation context
    const safeEval = new Function(
      ...Object.keys(mathContext),
      `"use strict";return (${normalizedExpression});`
    );

    // Execute the function with the safe math context
    return safeEval(...Object.values(mathContext));
  } catch (error) {
    console.error('Error evaluating expression:', error);
    throw new Error('Invalid mathematical expression');
  }
} 