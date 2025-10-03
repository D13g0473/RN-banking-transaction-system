import { StatusBar } from 'expo-status-bar';
import TransactionScreen from './src/screens/TransactionScreen';

export default function App() {
  return (
    <>
      <TransactionScreen />
      <StatusBar style="auto" />
    </>
  );
}
