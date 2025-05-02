import React, { useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalculationHistoryContext, HistoryItem } from './index';
import { Ionicons } from '@expo/vector-icons';

export default function History() {
  const { history, clearHistory } = useContext(CalculationHistoryContext);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyContent}>
        <Text style={styles.expression}>{item.expression}</Text>
        <Text style={styles.result}>{item.result}</Text>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Calculation History</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={64} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>No calculation history yet</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 99, 99, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  historyContent: {
    padding: 16,
  },
  expression: {
    color: '#B8C6DB',
    fontSize: 18,
    marginBottom: 4,
  },
  result: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  timestamp: {
    color: 'rgba(184, 198, 219, 0.6)',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 18,
    marginTop: 16,
  },
}); 