import React, { useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalculationHistoryContext } from './index';

export default function History() {
  const { history } = useContext(CalculationHistoryContext);
  
  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.text}>History</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
  },
}); 