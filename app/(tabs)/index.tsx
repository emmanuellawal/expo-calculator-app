import React, { useState, createContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Alert, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { detectConversion, formatConversionResult } from '@/utils/conversionHelper';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export type HistoryItem = {
  expression: string;
  result: string;
  timestamp: Date;
};

export const CalculationHistoryContext = createContext<{
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
}>({
  history: [],
  addToHistory: () => {},
  clearHistory: () => {},
});

export const CalculationHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  return (
    <CalculationHistoryContext.Provider 
      value={{
        history,
        addToHistory: (item) => setHistory(prev => [item, ...prev]),
        clearHistory: () => setHistory([])
      }}>
      {children}
    </CalculationHistoryContext.Provider>
  );
};

type ButtonColors = {
  background: string;
  text: string;
  gradient: readonly [string, string];
};

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>("0");
  const [equation, setEquation] = useState<string>("");
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [previousNumber, setPreviousNumber] = useState<string>("");
  const [currentOperator, setCurrentOperator] = useState<string>("");
  const [conversionMode, setConversionMode] = useState<boolean>(false);
  const [conversionInput, setConversionInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scientificMode, setScientificMode] = useState<boolean>(false);
  const { addToHistory } = React.useContext(CalculationHistoryContext);

  // Handle copying the display value to clipboard
  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(display);
      Alert.alert("Copied", `Value ${display} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Handle pasting from clipboard
  const pasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();
      if (clipboardContent && !isNaN(parseFloat(clipboardContent))) {
        setDisplay(clipboardContent);
        setIsNewNumber(true);
      } else {
        Alert.alert("Invalid Paste", "Clipboard does not contain a valid number");
      }
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
    }
  };

  const handleConversionInput = () => {
    if (!conversionInput.trim()) return;

    try {
      const result = detectConversion(conversionInput, display);
      if (result) {
        setDisplay(result.result.toString());
        setEquation(formatConversionResult(result));
        addToHistory({
          expression: conversionInput,
          result: formatConversionResult(result),
          timestamp: new Date(),
        });
      } else {
        if (!display || display === "0") {
          setDisplay("No value to convert");
        } else {
          setDisplay("Invalid conversion - try 'feet to inches'");
        }
        setTimeout(() => setDisplay(display), 2000);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setDisplay("Error in conversion");
      setTimeout(() => setDisplay(display), 2000);
    }
    setConversionInput("");
  };

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const calculate = (a: string, b: string, operator: string): string => {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    
    if (isNaN(num1) || isNaN(num2)) return "Error";
    
    let result: string;
    switch (operator) {
      case "+":
        result = (num1 + num2).toString();
        break;
      case "-":
        result = (num1 - num2).toString();
        break;
      case "*":
        result = (num1 * num2).toString();
        break;
      case "/":
        if (num2 === 0) return "Error";
        result = (num1 / num2).toString();
        break;
      case "^":
        result = Math.pow(num1, num2).toString();
        break;
      case "(":
      case ")":
        // Handle parentheses in a more complex expression parser
        return "Error";
      default:
        return "Error";
    }

    return result;
  };

  const handleOperator = (operator: string) => {
    if (currentOperator && !isNewNumber) {
      // If we already have an operator and a second number, calculate the result
      const result = calculate(previousNumber, display, currentOperator);
      setDisplay(result);
      setPreviousNumber(result);
    } else {
      setPreviousNumber(display);
    }
    setCurrentOperator(operator);
    setIsNewNumber(true);
    setEquation(display + " " + operator + " ");
  };

  const handleEqual = () => {
    if (!currentOperator || isNewNumber) return;
    
    const result = calculate(previousNumber, display, currentOperator);
    if (result !== "Error") {
      // Add to history
      const displayOperator = currentOperator === '*' ? '×' : currentOperator === '/' ? '÷' : currentOperator;
      addToHistory({
        expression: `${previousNumber} ${displayOperator} ${display}`,
        result: result,
        timestamp: new Date(),
      });
    }
    setDisplay(result);
    setEquation("");
    setPreviousNumber("");
    setCurrentOperator("");
    setIsNewNumber(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setPreviousNumber("");
    setCurrentOperator("");
    setIsNewNumber(true);
  };

  const handleToggleSign = () => {
    const num = parseFloat(display);
    setDisplay((-num).toString());
  };

  const handlePercent = () => {
    const num = parseFloat(display);
    setDisplay((num / 100).toString());
  };

  // Scientific calculator functions
  const handleSin = () => {
    const num = parseFloat(display);
    setDisplay(Math.sin(num * (Math.PI / 180)).toString());
  };

  const handleCos = () => {
    const num = parseFloat(display);
    setDisplay(Math.cos(num * (Math.PI / 180)).toString());
  };

  const handleTan = () => {
    const num = parseFloat(display);
    setDisplay(Math.tan(num * (Math.PI / 180)).toString());
  };

  const handleLog = () => {
    const num = parseFloat(display);
    if (num <= 0) {
      setDisplay("Error");
      return;
    }
    setDisplay(Math.log10(num).toString());
  };

  const handleLn = () => {
    const num = parseFloat(display);
    if (num <= 0) {
      setDisplay("Error");
      return;
    }
    setDisplay(Math.log(num).toString());
  };

  const handlePower = () => {
    if (currentOperator === '') {
      setPreviousNumber(display);
      setCurrentOperator("^");
      setIsNewNumber(true);
      setEquation(display + " ^ ");
    }
  };

  const handleSquareRoot = () => {
    const num = parseFloat(display);
    if (num < 0) {
      setDisplay("Error");
      return;
    }
    setDisplay(Math.sqrt(num).toString());
  };

  const handlePi = () => {
    setDisplay(Math.PI.toString());
    setIsNewNumber(true);
  };

  const handleExp = () => {
    setDisplay((parseFloat(display) === 0) ? "1" : Math.exp(parseFloat(display)).toString());
    setIsNewNumber(true);
  };

  const getButtonColors = (type: string): ButtonColors => {
    switch (type) {
      case 'number':
        return {
          background: '#2D2D2D',
          text: '#FFFFFF',
          gradient: ['rgba(100, 100, 100, 0.5)', 'rgba(50, 50, 50, 0.5)'] as const
        };
      case 'operator':
        return {
          background: '#F1A33C',
          text: '#FFFFFF',
          gradient: ['rgba(255, 187, 85, 0.5)', 'rgba(241, 163, 60, 0.5)'] as const
        };
      case 'function':
        return {
          background: '#A5A5A5',
          text: '#000000',
          gradient: ['rgba(187, 187, 187, 0.5)', 'rgba(165, 165, 165, 0.5)'] as const
        };
      default:
        return {
          background: '#2D2D2D',
          text: '#FFFFFF',
          gradient: ['rgba(100, 100, 100, 0.5)', 'rgba(50, 50, 50, 0.5)'] as const
        };
    }
  };

  const handleButtonPress = (value: string, type: string) => {
        switch (type) {
          case 'number':
        handleNumber(value);
            break;
          case 'operator':
        if (value === '×') {
              handleOperator('*');
        } else if (value === '÷') {
              handleOperator('/');
        } else if (value === '=') {
              handleEqual();
            } else {
          handleOperator(value);
            }
            break;
          case 'function':
        if (value === 'C') {
              handleClear();
        } else if (value === '±') {
              handleToggleSign();
        } else if (value === '%') {
              handlePercent();
        } else if (value === 'sin') {
          handleSin();
        } else if (value === 'cos') {
          handleCos();
        } else if (value === 'tan') {
          handleTan();
        } else if (value === 'log') {
          handleLog();
        } else if (value === 'ln') {
          handleLn();
        } else if (value === 'xʸ') {
          handlePower();
        } else if (value === '√') {
          handleSquareRoot();
        } else if (value === 'π') {
          handlePi();
        } else if (value === 'eˣ') {
          handleExp();
            }
            break;
        }
  };

  const renderButton = (value: string, type: string = 'number') => {
    const colors = getButtonColors(type);
    const isScientificButton = scientificMode && value.length > 1;
    
    return (
      <TouchableOpacity
        style={[
          isScientificButton ? styles.scientificButton : styles.button,
          { backgroundColor: colors.background }
        ]}
        onPress={() => handleButtonPress(value, type)}
      >
      <LinearGradient
          colors={colors.gradient}
          style={styles.buttonGradient}
        >
          <Text 
            style={[
              styles.buttonText, 
              { color: colors.text },
              isScientificButton && { fontSize: 18 },
              type === 'function' && (isScientificButton ? styles.scientificFunctionText : styles.functionText)
            ]}
          >
            {value}
          </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
  };

  return (
    <LinearGradient
      colors={['#141E30', '#243B55']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.display, scientificMode && { flex: 1.5 }]}>
          <View style={styles.displayCard}>
            {conversionMode && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setConversionMode(false)}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <Text style={styles.equation}>{equation}</Text>
            <TouchableOpacity 
              onLongPress={copyToClipboard}
              delayLongPress={500}
              style={styles.displayTextContainer}>
            <Text style={styles.current}>{display}</Text>
                </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.keypad, scientificMode && { flex: 4 }]}>
          {!conversionMode ? (
            <>
              <View style={styles.row}>
                <TouchableOpacity 
                  style={[styles.button, styles.functionButton]}
                  onPress={() => setConversionMode(!conversionMode)}>
                  <LinearGradient
                    colors={['#1E90FF', '#0066FF']}
                    style={styles.buttonGradient}>
                    <Text style={[styles.buttonText, styles.functionText]}>
                      Conv
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.functionButton]}
                  onPress={() => setScientificMode(!scientificMode)}>
                  <LinearGradient
                    colors={['#9370DB', '#7B68EE']}
                    style={styles.buttonGradient}>
                    <Text style={[styles.buttonText, styles.functionText]}>
                      {scientificMode ? "Std" : "Sci"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                {renderButton('C', 'function')}
                {renderButton('÷', 'operator')}
              </View>
              
              {scientificMode ? (
                <>
                  <View style={styles.scientificRow}>
                    {renderButton('sin', 'function')}
                    {renderButton('cos', 'function')}
                    {renderButton('tan', 'function')}
                    {renderButton('×', 'operator')}
                  </View>
                  <View style={styles.scientificRow}>
                    {renderButton('log', 'function')}
                    {renderButton('ln', 'function')}
                    {renderButton('xʸ', 'function')}
                    {renderButton('-', 'operator')}
                  </View>
                  <View style={styles.scientificRow}>
                    {renderButton('√', 'function')}
                    {renderButton('π', 'function')}
                    {renderButton('eˣ', 'function')}
                    {renderButton('+', 'operator')}
                  </View>
                  <View style={styles.scientificRow}>
                    {renderButton('(', 'operator')}
                    {renderButton(')', 'operator')}
                    {renderButton('±', 'function')}
                    {renderButton('%', 'function')}
                  </View>
                  <View style={styles.row}>
                    {renderButton('7')}
                    {renderButton('8')}
                    {renderButton('9')}
                    {renderButton('=', 'operator')}
                  </View>
                  <View style={styles.row}>
                    {renderButton('4')}
                    {renderButton('5')}
                    {renderButton('6')}
                    {renderButton('.')}
                  </View>
                  <View style={styles.row}>
                    {renderButton('1')}
                    {renderButton('2')}
                    {renderButton('3')}
                    {renderButton('0')}
                  </View>
                </>
              ) : (
                <>
              <View style={styles.row}>
                {renderButton('7')}
                {renderButton('8')}
                {renderButton('9')}
                {renderButton('×', 'operator')}
              </View>
              <View style={styles.row}>
                {renderButton('4')}
                {renderButton('5')}
                {renderButton('6')}
                {renderButton('-', 'operator')}
              </View>
              <View style={styles.row}>
                {renderButton('1')}
                {renderButton('2')}
                {renderButton('3')}
                {renderButton('+', 'operator')}
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.button, styles.zeroButton, { backgroundColor: getButtonColors('number').background }]}
                  onPress={() => handleButtonPress('0', 'number')}>
                  <LinearGradient
                    colors={getButtonColors('number').gradient}
                    style={styles.buttonGradient}>
                    <Text style={[styles.buttonText, { color: getButtonColors('number').text }]}>0</Text>
                  </LinearGradient>
                </TouchableOpacity>
                {renderButton('.')}
                {renderButton('=', 'operator')}
              </View>
            </>
              )}
            </>
          ) : (
            <>
              <TextInput
                style={styles.conversionInput}
                value={conversionInput}
                onChangeText={setConversionInput}
                placeholder="E.g. feet to inches"
                placeholderTextColor="#B8C6DB"
                onSubmitEditing={handleConversionInput}
              />
              <View style={styles.conversionContentWrapper}>
                <ScrollView style={styles.conversionScrollView}>
                  <View style={styles.conversionButtonsContainer}>
                    <Text style={styles.conversionCategoryHeader}>Length</Text>
                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} meters to feet`);
                            handleConversionInput();
                          } else {
                            setConversionInput("meters to feet");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>m → ft</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} feet to meters`);
                            handleConversionInput();
                          } else {
                            setConversionInput("feet to meters");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>ft → m</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} km to miles`);
                            handleConversionInput();
                          } else {
                            setConversionInput("km to miles");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>km → mi</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} miles to km`);
                            handleConversionInput();
                          } else {
                            setConversionInput("miles to km");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>mi → km</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.conversionCategoryHeader}>Weight</Text>
                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} kg to lbs`);
                            handleConversionInput();
                          } else {
                            setConversionInput("kg to lbs");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>kg → lb</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} lbs to kg`);
                            handleConversionInput();
                          } else {
                            setConversionInput("lbs to kg");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>lb → kg</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} grams to ounces`);
                            handleConversionInput();
                          } else {
                            setConversionInput("grams to ounces");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>g → oz</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} ounces to grams`);
                            handleConversionInput();
                          } else {
                            setConversionInput("ounces to grams");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>oz → g</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.conversionCategoryHeader}>Temperature</Text>
                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} celsius to fahrenheit`);
                            handleConversionInput();
                          } else {
                            setConversionInput("celsius to fahrenheit");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>°C → °F</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} fahrenheit to celsius`);
                            handleConversionInput();
                          } else {
                            setConversionInput("fahrenheit to celsius");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>°F → °C</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.conversionCategoryHeader}>Volume</Text>
                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} liters to gallons`);
                            handleConversionInput();
                          } else {
                            setConversionInput("liters to gallons");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>L → gal</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} gallons to liters`);
                            handleConversionInput();
                          } else {
                            setConversionInput("gallons to liters");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>gal → L</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} milliliters to cups`);
                            handleConversionInput();
                          } else {
                            setConversionInput("milliliters to cups");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>mL → cup</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} cups to milliliters`);
                            handleConversionInput();
                          } else {
                            setConversionInput("cups to milliliters");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>cup → mL</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.conversionCategoryHeader}>Area</Text>
                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} square meters to square feet`);
                            handleConversionInput();
                          } else {
                            setConversionInput("square meters to square feet");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>m² → ft²</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} square feet to square meters`);
                            handleConversionInput();
                          } else {
                            setConversionInput("square feet to square meters");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>ft² → m²</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} acres to hectares`);
                            handleConversionInput();
                          } else {
                            setConversionInput("acres to hectares");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>acre → ha</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} hectares to acres`);
                            handleConversionInput();
                          } else {
                            setConversionInput("hectares to acres");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>ha → acre</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.conversionCategoryHeader}>Speed</Text>
                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} mph to kph`);
                            handleConversionInput();
                          } else {
                            setConversionInput("mph to kph");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>mph → km/h</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} kph to mph`);
                            handleConversionInput();
                          } else {
                            setConversionInput("kph to mph");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>km/h → mph</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.conversionCategoryHeader}>Data</Text>
                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} MB to GB`);
                            handleConversionInput();
                          } else {
                            setConversionInput("MB to GB");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>MB → GB</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} GB to MB`);
                            handleConversionInput();
                          } else {
                            setConversionInput("GB to MB");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>GB → MB</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.conversionRow}>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} KB to MB`);
                            handleConversionInput();
                          } else {
                            setConversionInput("KB to MB");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>KB → MB</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.conversionButton}
                        onPress={() => {
                          if (display && display !== "0") {
                            setConversionInput(`${display} TB to GB`);
                            handleConversionInput();
                          } else {
                            setConversionInput("TB to GB");
                          }
                        }}>
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.buttonGradient}>
                          <Text style={styles.conversionButtonText}>TB → GB</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
                <View style={styles.fixedButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.conversionButton, styles.fixedButton]}
                    onPress={() => {
                      handleClear();
                      setConversionMode(false);
                    }}>
                    <LinearGradient
                      colors={['#FF6B6B', '#EE5D5D']}
                      style={styles.buttonGradient}>
                      <Text style={styles.conversionButtonText}>Cancel</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.conversionButton, styles.fixedButton]}
                    onPress={handleConversionInput}>
                    <LinearGradient
                      colors={['#32CD32', '#2E8B57']}
                      style={styles.buttonGradient}>
                      <Text style={styles.conversionButtonText}>Convert</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  display: {
    flex: 2,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  displayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    backdropFilter: 'blur(10px)',
    position: 'relative',
  },
  equation: {
    color: '#B8C6DB',
    fontSize: 28,
    marginBottom: 8,
    fontFamily: 'System',
    textAlign: 'right',
  },
  current: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '600',
    fontFamily: 'System',
    textAlign: 'right',
  },
  keypad: {
    flex: 3,
    marginTop: scientificMode ? 10 : 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  scientificRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    height: 45,
  },
  button: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scientificButton: {
    width: '23%',
    height: 40,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    fontFamily: 'System',
  },
  operatorButton: {
    elevation: 8,
  },
  functionButton: {
    elevation: 8,
  },
  zeroButton: {
    width: '48%',
  },
  operatorText: {
    fontSize: 32,
    fontWeight: '600',
  },
  functionText: {
    fontSize: 20,
    fontWeight: '600',
  },
  scientificFunctionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  displayTextContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversionInput: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#B8C6DB',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  conversionScrollView: {
    flex: 1,
    width: '100%',
  },
  conversionButtonsContainer: {
    width: '100%',
    paddingBottom: 10,
  },
  conversionContentWrapper: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  fixedButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    height: 60,
  },
  fixedButton: {
    height: 60,
  },
  conversionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    height: 60,
  },
  conversionButton: {
    width: '48%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  conversionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    fontFamily: 'System',
  },
  conversionCategoryHeader: {
    color: '#B8C6DB',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
});

export default Calculator;
