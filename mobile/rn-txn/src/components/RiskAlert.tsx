import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RiskAlertProps {
  risk: 'LOW' | 'HIGH';
  visible: boolean;
}

export const RiskAlert: React.FC<RiskAlertProps> = ({ risk, visible }) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  const isHighRisk = risk === 'HIGH';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isHighRisk ? '#ffebee' : '#e8f5e8',
          borderColor: isHighRisk ? '#f44336' : '#4caf50',
          opacity: fadeAnim,
          transform: [{
            scale: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={isHighRisk ? 'warning' : 'checkmark-circle'}
          size={32}
          color={isHighRisk ? '#f44336' : '#4caf50'}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: isHighRisk ? '#d32f2f' : '#2e7d32' }]}>
          {isHighRisk ? '¡Alto Riesgo Detectado!' : 'Verificación Exitosa'}
        </Text>

        <Text style={[styles.message, { color: isHighRisk ? '#f44336' : '#4caf50' }]}>
          {isHighRisk
            ? 'Esta transacción ha sido clasificada como de alto riesgo. Se procederá con la reversión automática.'
            : 'La transacción ha pasado exitosamente la verificación de riesgo. Continuando con el proceso.'
          }
        </Text>

        <View style={styles.details}>
          <Text style={styles.detailText}>
            Nivel de Riesgo: <Text style={{ fontWeight: 'bold' }}>{risk}</Text>
          </Text>
          <Text style={styles.detailText}>
            Estado: <Text style={{ fontWeight: 'bold' }}>
              {isHighRisk ? 'Reversión en Progreso' : 'Procesamiento Continuo'}
            </Text>
          </Text>
        </View>
      </View>

      {isHighRisk && (
        <View style={styles.warningBadge}>
          <Ionicons name="alert-circle" size={16} color="#fff" />
          <Text style={styles.warningText}>REQUERIDA ATENCIÓN</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  details: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  warningBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#f44336',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  warningText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});