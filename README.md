# Sistema de Eventos Bancarios con Kafka y React Native

Este proyecto implementa un sistema completo de simulación del ciclo de vida de transacciones bancarias utilizando arquitectura de eventos con Apache Kafka y una aplicación móvil en React Native.

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **API Service** (NestJS) - Endpoint REST para iniciar transacciones
2. **Orchestrator Service** (NestJS) - Orquestador de saga que procesa transacciones
3. **WebSocket Gateway Service** (NestJS) - Gateway en tiempo real para eventos
4. **React Native App** (Expo) - Interfaz móvil para visualizar transacciones

### Flujo de Eventos

```
Mobile App → API → Kafka (txn.commands) → Orchestrator → Kafka (txn.events) → Gateway → WebSocket → Mobile App
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+
- Expo CLI

### 1. Iniciar Infraestructura

```bash
cd banking-transaction-system/docker
docker-compose up -d
```

Esto iniciará:
- Apache Kafka
- Apache Zookeeper
- API Service (puerto 3000)
- Orchestrator Service
- Gateway Service (puerto 8080)

### 2. Verificar Servicios

```bash
# Verificar que todos los contenedores estén corriendo
docker ps

# Verificar conectividad
curl http://localhost:3000
curl http://localhost:8080
```

### 3. Iniciar App Móvil

```bash
cd banking-transaction-system/mobile/rn-txn

# Instalar dependencias (solo primera vez)
npm install

# Opción A: Túnel de Expo (recomendado para dispositivos)
npx expo start --tunnel

# Opción B: Desarrollo local (para emuladores)
npx expo start
```

**Configuración de red:**
- **Túnel**: Funciona automáticamente desde cualquier red
- **Local**: Configura IP en `src/services/config.ts` si usas dispositivo físico

Escanea el QR con la app **Expo Go** en tu dispositivo.

### 🚀 Inicio Rápido para Dispositivos Móviles

Para probar en un dispositivo físico (recomendado):

```bash
# Terminal 1: Backend
cd banking-transaction-system/docker
docker-compose up -d

# Terminal 2: App móvil
cd banking-transaction-system/mobile/rn-txn
npx expo start --tunnel
```

**¡Eso es todo!** El túnel de Expo maneja automáticamente la conectividad.

### ⚡ Comandos Rápidos

```bash
# 🚀 Inicio completo del sistema
cd banking-transaction-system/docker && docker-compose up -d
cd ../mobile/rn-txn && npx expo start --tunnel

# 🔍 Verificar servicios
curl http://localhost:3000  # API
curl http://localhost:8080  # Gateway

# 📱 Probar transacción
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{"fromAccount":"123","toAccount":"456","amount":100,"currency":"USD","userId":"test"}'

# 📊 Ver logs
docker logs docker_api
docker logs docker_orchestrator
docker logs docker_gateway
```

## 📱 Uso de la App

1. **Iniciar Transacción**: Completa el formulario con cuenta origen, destino, monto y moneda
2. **Alertas de Riesgo Dinámicas**: Al llegar la verificación antifraude, aparece una alerta visual:
   - 🟢 **Riesgo BAJO**: Alerta verde con mensaje de éxito (se oculta automáticamente)
   - 🔴 **Riesgo ALTO**: Alerta roja prominente con advertencia (permanece visible hasta que el usuario la cierre)
3. **Timeline Mejorado**: Eventos visuales con colores por tipo, indicadores de paso y detalles específicos
4. **Visualización en Tiempo Real**: Los eventos aparecen automáticamente en el timeline
5. **Historial de Eventos**: Incluye reserva de fondos, verificación antifraude, commit y notificación

## 🔧 Configuración

### Variables de Entorno

Los servicios usan las siguientes variables:

```bash
# API Service
PORT=3000
KAFKA_BROKERS=kafka:9092

# Gateway Service
PORT=8080
KAFKA_BROKERS=kafka:9092
```

### Configuración de Red para Dispositivos Móviles

Si usas Expo Go en un dispositivo físico, necesitas configurar las URLs del backend:

#### **📱 Opción 1: Túnel de Expo (Más Fácil - Recomendado)**
```bash
# En terminal del proyecto móvil
cd banking-transaction-system/mobile/rn-txn
npx expo start --tunnel
```

**Ventajas:**
- ✅ No necesitas configurar IPs
- ✅ Funciona desde cualquier red
- ✅ Expo crea URLs HTTPS automáticamente

**Configuración necesaria:**
- Expo generará URLs como: `https://xxxxx-xxxxx-xxxxx.exp.direct`
- **NO necesitas cambiar nada** - las URLs se actualizan automáticamente

#### **🏠 Opción 2: IP Local (Para misma red WiFi)**
```bash
# Encuentra tu IP local
ip addr show  # Linux
# o
ifconfig      # macOS
# o
ipconfig      # Windows
```

**Configuración necesaria:**
1. **Actualiza** `banking-transaction-system/mobile/rn-txn/src/services/config.ts`:
   ```typescript
   export const config = {
     API_BASE_URL: 'http://TU_IP_LOCAL:3000',
     WS_BASE_URL: 'http://TU_IP_LOCAL:8080',
   };
   ```

2. **Requisitos:**
   - Dispositivo y PC en la **misma red WiFi**
   - Puertos 3000 y 8080 accesibles
   - Firewall permite conexiones locales

#### **🔧 Archivo de Configuración**
**Ubicación:** `banking-transaction-system/mobile/rn-txn/src/services/config.ts`

Edita este archivo para configurar las URLs de tu backend según tu método de conexión preferido.

```typescript
// Para túnel de Expo (automático)
export const config = {
  API_BASE_URL: 'http://192.168.1.11:3000',  // Cambia TU_IP_AQUI
  WS_BASE_URL: 'http://192.168.1.11:8080',   // Cambia TU_IP_AQUI
};

// Para desarrollo local con IP específica
export const config = {
  API_BASE_URL: 'http://192.168.1.100:3000',
  WS_BASE_URL: 'http://192.168.1.100:8080',
};
```

## 📋 Ciclo de Vida de Transacción

Cada transacción pasa por estos estados:

1. **TransactionInitiated** - Transacción creada
2. **FundsReserved** - Fondos reservados (siempre OK en simulación)
3. **FraudChecked** - Verificación antifraude (80% LOW, 20% HIGH)
4. **Committed** - Transacción confirmada (si fraud LOW)
5. **Reversed** - Transacción revertida (si fraud HIGH)
6. **Notified** - Notificaciones enviadas

## 🧪 Testing

### Pruebas Manuales

```bash
# Iniciar transacción via API
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{"fromAccount":"123","toAccount":"456","amount":100,"currency":"USD","userId":"test"}'

# Verificar eventos en Kafka
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic txn.events \
  --from-beginning
```

### Logs de Servicios

```bash
# Ver logs de servicios
docker logs docker_api
docker logs docker_orchestrator
docker logs docker_gateway
```

## 🛠️ Desarrollo

### Estructura del Proyecto

```
banking-transaction-system/
├── backend/
│   ├── api/              # Servicio REST
│   ├── orchestrator/     # Orquestador de saga
│   └── gateway/          # Gateway WebSocket
├── mobile/
│   └── rn-txn/           # App React Native
├── shared/
│   └── types/            # Tipos TypeScript compartidos
└── docker/               # Configuración Docker
```

### Agregar Nuevos Eventos

1. Define el tipo en `shared/types/events.ts`
2. Actualiza la lógica en `orchestrator/src/saga/saga.service.ts`
3. El Gateway transmitirá automáticamente los nuevos eventos

## 🔒 Características Técnicas

- **Event Sourcing**: Todos los eventos se persisten en Kafka
- **Saga Orchestration**: Manejo de transacciones distribuidas
- **WebSocket Real-time**: Actualizaciones en vivo
- **Event History**: Eventos disponibles incluso si el cliente se conecta tarde
- **Dynamic Risk Alerts**: Alertas visuales que cambian según el riesgo detectado
- **Fault Tolerance**: Dead Letter Queue para errores
- **Scalability**: Arquitectura de microservicios

## ⚠️ Sistema de Alertas de Riesgo

### Funcionalidad Dinámica

La aplicación muestra **alertas visuales dinámicas** basadas en la evaluación de riesgo en tiempo real:

#### 🎯 **Riesgo BAJO** (80% de probabilidad)
- **Color**: Verde (#4CAF50)
- **Icono**: Checkmark circle
- **Mensaje**: "Verificación Exitosa - Continuando con el proceso"
- **Comportamiento**: Se oculta automáticamente después de 10 segundos
- **Resultado**: Transacción continúa normalmente

#### 🚨 **Riesgo ALTO** (20% de probabilidad)
- **Color**: Rojo (#f44336)
- **Icono**: Warning + Badge "REQUERIDA ATENCIÓN"
- **Mensaje**: "¡Alto Riesgo Detectado! - Se procederá con la reversión automática"
- **Comportamiento**: Permanece visible hasta que el usuario lo cierre manualmente
- **Resultado**: Transacción se revierte automáticamente

### Integración Técnica

- **Trigger**: Evento `FraudChecked` desde el backend via WebSocket
- **Animación**: Transición suave con escala y opacidad
- **Estado**: Mantiene el estado de riesgo durante toda la sesión
- **UX**: Diseño responsive con información detallada del riesgo

## 🔧 Troubleshooting

### Problemas Comunes Resueltos

#### 1. **VirtualizedLists Error en React Native**
```
VirtualizedLists should never be nested inside plain ScrollViews
```
**Solución**: Cambiar `ScrollView` por `View` normal cuando se usa `FlatList` dentro.

#### 2. **Advertencias de Expo Version**
```
Your project may not work correctly until you install the expected versions of the packages
```
**Solución**: Las advertencias son normales en desarrollo. El proyecto funciona correctamente.

#### 3. **WebSocket no conecta desde dispositivo móvil**
**Solución**: Usar túnel de Expo (`expo start --tunnel`) o verificar que dispositivo y PC estén en la misma red WiFi.

#### 4. **Eventos no llegan a la app móvil**
**Solución**: Verificar que el Gateway esté ejecutándose y que la app esté suscrita al WebSocket. Los eventos se almacenan en historial si no hay clientes conectados.

### Comandos Útiles

```bash
# Ver logs de servicios
docker logs docker_api
docker logs docker_orchestrator
docker logs docker_gateway

# Verificar conectividad
curl http://localhost:3000
curl http://localhost:8080

# Reiniciar servicios
docker-compose restart
```

## 📚 Referencias

- [NestJS Documentation](https://docs.nestjs.com/)
- [Apache Kafka](https://kafka.apache.org/)
- [React Native](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)


## 📄 Licencia

Este proyecto es para fines educativos.


## Autor 

Arebalo Diego Miguel

## github 

```bash
https://github.com/D13g0473
```