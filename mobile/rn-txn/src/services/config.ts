// Configuración de URLs para el backend
// Cambia estas URLs según tu configuración de red

// Para desarrollo local con IP específica
export const API_BASE_URL = 'http://192.168.1.11:3000';  // Cambia TU_IP_LOCAL:3000
export const WS_BASE_URL = 'http://192.168.1.11:8080';   // Cambia TU_IP_LOCAL:8080

// Para túnel de Expo (comenta las líneas arriba y descomenta estas)
// export const API_BASE_URL = 'https://xxxxx-xxxxx-xxxxx.exp.direct';
// export const WS_BASE_URL = 'https://xxxxx-xxxxx-xxxxx.exp.direct';

// Instrucciones para configurar:
//
// 1. TUNEL DE EXPO (Más fácil - recomendado):
//    - Ejecuta: npx expo start --tunnel
//    - Expo generará URLs HTTPS automáticamente
//    - NO necesitas cambiar nada aquí
//
// 2. IP LOCAL (Para misma red WiFi):
//    - Encuentra tu IP: ip addr show (Linux) o ifconfig (macOS)
//    - Cambia las URLs arriba con tu IP real
//    - Asegúrate de que dispositivo y PC estén en la misma WiFi
//
// 3. DESARROLLO LOCAL (Emuladores):
//    - Usa localhost o 127.0.0.1
//    - API_BASE_URL: 'http://localhost:3000'
//    - WS_BASE_URL: 'http://localhost:8080'