/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from 'react';

import {
  aiService,
  type AIFormattedResponse,
  type ChatMessage,
  type ChatSession,
} from '../service/aiService';

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<AIFormattedResponse | null>(null);

  const [history, setHistory] = useState<ChatMessage[]>([]);

  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const [sessionId, setSessionId] = useState<string>('');

  const latestBotData = useMemo(() => {
    const botMessages = history.filter(
      (msg) => msg.sender === 'bot' && typeof msg.message === 'object',
    );

    if (botMessages.length === 0) {
      return null;
    }

    return botMessages[botMessages.length - 1].message as AIFormattedResponse;
  }, [history]);

  const getChatHistory = useCallback(async (currentSessionId: string) => {
    try {
      setLoading(true);

      const result = await aiService.getChatHistory(currentSessionId);

      const messages = result || [];

      setHistory(messages);

      // tìm bot message cuối cùng
      const botMessages = messages.filter(
        (msg: any) => msg.sender === 'bot' && typeof msg.message === 'object',
      );

      if (botMessages.length > 0) {
        const latestBot = botMessages[botMessages.length - 1];

        setData(latestBot.message as AIFormattedResponse);
      } else {
        setData(null);
      }

      return messages;
    } catch (err: any) {
      console.error(err);

      setError(err.message || 'Error');

      setHistory([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (patientId: string, message: string) => {
      if (!message.trim()) return;

      try {
        setLoading(true);
        setError(null);

        // optimistic user message
        const tempUserMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          sender: 'user',
          message,
          created_at: new Date().toISOString(),
        } as ChatMessage;

        setHistory((prev) => [...prev, tempUserMessage]);

        const result = await aiService.sendMessage({
          patient_id: patientId,
          message,
          session_id: sessionId || undefined,
        });

        // update session
        if (result.session_id) {
          setSessionId(result.session_id);
        }

        // update latest AI data
        setData(result);

        // reload full history from server
        if (result.session_id) {
          await getChatHistory(result.session_id);
        }

        return result;
      } catch (err: any) {
        console.error(err);

        setError(err.message || 'Error');

        // rollback optimistic update
        setHistory((prev) =>
          prev.filter((msg) => !String(msg.id).startsWith('temp-')),
        );
      } finally {
        setLoading(false);
      }
    },
    [sessionId, getChatHistory],
  );

  const getSessions = useCallback(async (patientId: string) => {
    try {
      const result = await aiService.getSessions(patientId);

      setSessions(result || []);

      return result;
    } catch (err: any) {
      console.error(err);

      setError(err.message || 'Error');

      setSessions([]);

      return [];
    }
  }, []);

  const changeSession = useCallback(
    async (newSessionId: string) => {
      if (!newSessionId) return;

      try {
        setLoading(true);

        // clear old UI first
        setHistory([]);

        setData(null);

        // active session
        setSessionId(newSessionId);

        // load messages
        await getChatHistory(newSessionId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [getChatHistory],
  );

  const createNewChat = useCallback(() => {
    setSessionId('');

    setHistory([]);

    setData(null);

    setError(null);
  }, []);

  const slotsByDoctor: Record<string, any[]> = useMemo(() => {
    return (
      latestBotData?.suggested_slots?.reduce((acc: any, slot: any) => {
        if (!acc[slot.doctor_id]) {
          acc[slot.doctor_id] = [];
        }

        acc[slot.doctor_id].push(slot);

        return acc;
      }, {}) || {}
    );
  }, [latestBotData]);

  return {
    // states
    loading,
    error,

    data,
    history,

    sessions,
    sessionId,

    latestBotData,
    slotsByDoctor,

    // actions
    sendMessage,

    getChatHistory,
    getSessions,

    changeSession,
    createNewChat,
  };
};
