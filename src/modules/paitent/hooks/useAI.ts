/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { aiService, type AIFormattedResponse } from '../aiService';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AIFormattedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await aiService.sendMessage({ message });
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading,
    data,
    error,
  };
};
