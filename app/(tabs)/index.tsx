import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { HistoryItem } from './history';

// Create a context for history
export const CalculationHistoryContext = React.createContext<{
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

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <CalculationHistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </CalculationHistoryContext.Provider>
  );
};

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>("0");
  const [equation, setEquation] = useState<string>("");
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [previousNumber, setPreviousNumber] = useState<string>("");
  const [currentOperator, setCurrentOperator] = useState<string>("");
  const { addToHistory } = React.useContext(CalculationHistoryContext);

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

  const renderButton = (text: string, type: 'number' | 'operator' | 'function' = 'number') => (
    <TouchableOpacity
      style={[
        styles.button,
        type === 'operator' && styles.operatorButton,
        type === 'function' && styles.functionButton,
        text === '0' && styles.zeroButton,
      ]}
      onPress={() => {
        switch (type) {
          case 'number':
            handleNumber(text);
            break;
          case 'operator':
            if (text === '×') {
              handleOperator('*');
            } else if (text === '÷') {
              handleOperator('/');
            } else if (text === '=') {
              handleEqual();
            } else {
              handleOperator(text);
            }
            break;
          case 'function':
            if (text === 'C') {
              handleClear();
            } else if (text === '±') {
              handleToggleSign();
            } else if (text === '%') {
              handlePercent();
            }
            break;
        }
      }}>
      <LinearGradient
        colors={
          type === 'operator' 
            ? ['#FF6B6B', '#EE5D5D'] 
            : type === 'function'
            ? ['#4A90E2', '#357ABD']
            : ['#2C3E50', '#34495E']
        }
        style={styles.buttonGradient}>
        <Text style={[
          styles.buttonText,
          type === 'operator' && styles.operatorText,
          type === 'function' && styles.functionText,
        ]}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#141E30', '#243B55']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.display}>
          <View style={styles.displayCard}>
            <Text style={styles.equation}>{equation}</Text>
            <Text style={styles.current}>{display}</Text>
          </View>
        </View>
        <View style={styles.keypad}>
          <View style={styles.row}>
            {renderButton('C', 'function')}
            {renderButton('±', 'function')}
            {renderButton('%', 'function')}
            {renderButton('÷', 'operator')}
          </View>
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
            {renderButton('0')}
            {renderButton('.')}
            {renderButton('=', 'operator')}
          </View>
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
  },
  equation: {
    color: '#B8C6DB',
    fontSize: 24,
    marginBottom: 8,
    fontFamily: 'System',
    textAlign: 'right',
  },
  current: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'System',
    textAlign: 'right',
  },
  keypad: {
    flex: 3,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  operatorText: {
    fontSize: 32,
  },
  functionText: {
    fontSize: 24,
  },
});

export default Calculator;
