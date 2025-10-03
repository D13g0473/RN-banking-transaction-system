import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TransactionEvent, FundsReserved, FraudChecked, Committed, Reversed, Notified } from '../types/events';

interface EventTimelineProps {
  events: TransactionEvent[];
}

const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
  const getEventType = (event: TransactionEvent): string => {
    if ('ok' in event) return 'FundsReserved';
    if ('risk' in event) return 'FraudChecked';
    if ('ledgerTxId' in event) return 'Committed';
    if ('reason' in event) return 'Reversed';
    if ('channels' in event) return 'Notified';
    return 'TransactionInitiated';
  };

  const getEventColor = (eventType: string): string => {
    switch (eventType) {
      case 'TransactionInitiated': return '#2196F3';
      case 'FundsReserved': return '#FF9800';
      case 'FraudChecked': return '#9C27B0';
      case 'Committed': return '#4CAF50';
      case 'Reversed': return '#F44336';
      case 'Notified': return '#607D8B';
      default: return '#666';
    }
  };

  const renderEventDetails = (event: TransactionEvent) => {
    const eventType = getEventType(event);

    switch (eventType) {
      case 'FundsReserved':
        const fundsEvent = event as FundsReserved;
        return (
          <View>
            <Text style={styles.detailText}>Estado: {fundsEvent.ok ? 'Reservado' : 'Fallido'}</Text>
            <Text style={styles.detailText}>Monto: ${fundsEvent.amount}</Text>
            <Text style={styles.detailText}>ID de Reserva: {fundsEvent.holdId}</Text>
          </View>
        );
      case 'FraudChecked':
        const fraudEvent = event as FraudChecked;
        return (
          <View>
            <Text style={[styles.detailText, { fontWeight: 'bold', color: fraudEvent.risk === 'HIGH' ? '#F44336' : '#4CAF50' }]}>
              Nivel de Riesgo: {fraudEvent.risk}
            </Text>
          </View>
        );
      case 'Committed':
        const commitEvent = event as Committed;
        return (
          <View>
            <Text style={styles.detailText}>ID de Transacción: {commitEvent.ledgerTxId}</Text>
          </View>
        );
      case 'Reversed':
        const reverseEvent = event as Reversed;
        return (
          <View>
            <Text style={[styles.detailText, { color: '#F44336' }]}>Razón: {reverseEvent.reason}</Text>
          </View>
        );
      case 'Notified':
        const notifyEvent = event as Notified;
        return (
          <View>
            <Text style={styles.detailText}>Canales: {notifyEvent.channels.join(', ')}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderEvent = ({ item, index }: { item: TransactionEvent; index: number }) => {
    const eventType = getEventType(item);
    const eventColor = getEventColor(eventType);

    return (
      <View style={[styles.eventContainer, { borderLeftColor: eventColor }]}>
        <View style={styles.eventHeader}>
          <View style={[styles.eventTypeBadge, { backgroundColor: eventColor }]}>
            <Text style={styles.eventTypeText}>{eventType}</Text>
          </View>
          <Text style={styles.timestamp}>
            {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.eventContent}>
          <Text style={styles.transactionId}>ID: {item.transactionId}</Text>
          {renderEventDetails(item)}
        </View>

        <View style={styles.stepIndicator}>
          <Text style={styles.stepNumber}>{index + 1}</Text>
        </View>
      </View>
    );
  };

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay eventos aún. Inicia una transacción para ver el timeline.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => `${item.transactionId}-${index}`}
        renderItem={renderEvent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 10,
  },
  listContainer: {
    padding: 10,
  },
  eventContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  eventContent: {
    marginBottom: 10,
  },
  transactionId: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  stepIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#e0e0e0',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default EventTimeline;