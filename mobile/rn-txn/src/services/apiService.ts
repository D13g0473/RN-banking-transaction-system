import { API_BASE_URL } from './config';

export const initiateTransaction = async (data: {
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  userId: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('API Response Status:', response.status);
  console.log('API response:', await response.clone().text());

  if (!response.ok) {
    throw new Error('Failed to initiate transaction');
  }
  return response.json();
};