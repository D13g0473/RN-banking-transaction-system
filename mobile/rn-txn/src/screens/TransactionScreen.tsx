import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import EventTimeline from '../components/EventTimeline';
import { RiskAlert } from '../components/RiskAlert';
import { initiateTransaction } from '../services/apiService';
import { websocketService } from '../services/websocketService';
import { TransactionEvent, FraudChecked } from '../types/events';

const TransactionScreen: React.FC = () => {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [userId, setUserId] = useState('');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [events, setEvents] = useState<TransactionEvent[]>([]);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'HIGH' | null>(null);
  const [showRiskAlert, setShowRiskAlert] = useState(false);

  const handleInitiate = async () => {
    try {
      console.log('Initiating transaction with data:', { fromAccount, toAccount, amount, currency, userId });
      const data = {
        fromAccount,
        toAccount,
        amount: parseFloat(amount),
        currency,
        userId,
      };
      const result = await initiateTransaction(data);
      console.log('Transaction initiated, received ID:', result.transactionId);
      setTransactionId(result.transactionId);
      console.log('Connecting to WebSocket with transactionId:', result.transactionId);
      websocketService.connect(result.transactionId);
    } catch (error) {
      console.log('Error initiating transaction:', error);
      Alert.alert('Error', 'Failed to initiate transaction');
    }
  };

  useEffect(() => {
    const handleEvent = (event: TransactionEvent) => {
      setEvents(prev => [...prev, event]);

      // Check for fraud check event and show risk alert
      if ('risk' in event) {
        const fraudEvent = event as FraudChecked;
        setRiskLevel(fraudEvent.risk);
        setShowRiskAlert(true);

        // Auto-hide alert after 10 seconds for LOW risk, keep visible for HIGH risk
        if (fraudEvent.risk === 'LOW') {
          setTimeout(() => {
            setShowRiskAlert(false);
          }, 10000);
        }
      }
    };
    websocketService.onEvent(handleEvent);
    return () => {
      websocketService.offEvent(handleEvent);
    };
  }, []);

  const handleDismissRiskAlert = () => {
    setShowRiskAlert(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 20, paddingTop: 60, flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
          Iniciar Transacción
        </Text>

        <TextInput
          placeholder="Cuenta Origen"
          value={fromAccount}
          onChangeText={setFromAccount}
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            backgroundColor: '#fff',
            fontSize: 16
          }}
        />
        <TextInput
          placeholder="Cuenta Destino"
          value={toAccount}
          onChangeText={setToAccount}
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            backgroundColor: '#fff',
            fontSize: 16
          }}
        />
        <TextInput
          placeholder="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            backgroundColor: '#fff',
            fontSize: 16
          }}
        />
        <TextInput
          placeholder="Moneda"
          value={currency}
          onChangeText={setCurrency}
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            backgroundColor: '#fff',
            fontSize: 16
          }}
        />
        <TextInput
          placeholder="ID de Usuario"
          value={userId}
          onChangeText={setUserId}
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 12,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor: '#fff',
            fontSize: 16
          }}
        />

        <Button
          title="Iniciar Transacción"
          onPress={handleInitiate}
          color="#2196F3"
        />

        {transactionId && (
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: '#4CAF50',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            ID de Transacción: {transactionId}
          </Text>
        )}

        {/* Risk Alert - Dynamic View */}
        {riskLevel && (
          <RiskAlert
            risk={riskLevel}
            visible={showRiskAlert}
          />
        )}

        {/* Dismiss button for HIGH risk alerts */}
        {riskLevel === 'HIGH' && showRiskAlert && (
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <Button
              title="Entendido - Continuar Monitoreando"
              onPress={handleDismissRiskAlert}
              color="#FF5722"
            />
          </View>
        )}

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#333' }}>
          Timeline de Eventos
        </Text>

        <EventTimeline events={events} />
      </View>
    </View>
  );
};

export default TransactionScreen;