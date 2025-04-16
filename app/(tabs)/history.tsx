import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalculationHistoryContext } from './index';

export type HistoryItem = {
  expression: string;
  result: string;
  timestamp: Date;
};

const History: React.FC = () => {
  const { history, clearHistory } = React.useContext(CalculationHistoryContext);

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.historyItem}>
      <Text style={styles.expression}>{item.expression}</Text>
      <Text style={styles.result}>{item.result}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#141E30', '#243B55']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No calculations yet</Text>
            <Text style={styles.emptyStateSubtext}>Your calculation history will appear here</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearButton: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  expression: {
    color: '#B8C6DB',
    fontSize: 18,
    marginBottom: 4,
  },
  result: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timestamp: {
    color: '#B8C6DB',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#B8C6DB',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default History; 