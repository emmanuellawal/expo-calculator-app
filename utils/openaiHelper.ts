type NLPResult = {
  type: 'calculation' | 'conversion';
  expression: string;
  result: number | null;
  error?: string;
  conversionUnits?: {
    from: string;
    to: string;
  };
};

export const processNaturalLanguageCalculation = async (input: string): Promise<NLPResult> => {
  // For now, return a basic error response
  return {
    type: 'calculation',
    expression: input,
    result: null,
    error: 'Natural language processing not implemented'
  };
}; 