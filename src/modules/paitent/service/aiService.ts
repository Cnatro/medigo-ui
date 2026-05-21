/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../../../api/axiosClient';

export interface AIMessageRequest {
  patient_id: string;
  message: string;
  session_id?: string;
}

export interface ChatMessage {
  id: string;

  sender: 'user' | 'bot';

  message: string | AIFormattedResponse;

  created_at: string;
}

export interface ChatSession {
  id: string;
  created_at: string;
}

export interface AIFormattedResponse {
  session_id: string;

  summary: string;
  possible_conditions: string[];
  urgency_level: 'low' | 'medium' | 'high';
  advice: string;

  doctors: any[];
  symptoms: any[];
  specialties: any[];
  suggested_slots: any[];
}

export const aiService = {
  async sendMessage(payload: AIMessageRequest): Promise<AIFormattedResponse> {
    try {
      const res = await axiosClient.post('/ai/chat', {
        patient_id: payload.patient_id,
        message: payload.message,
        session_id: payload.session_id,
      });

      const raw = res.data?.data?.response;
      const sessionId = res.data?.data?.session_id;

      if (!raw) {
        throw new Error('AI response is empty');
      }

      return {
        session_id: sessionId,

        summary: raw?.summary || '',

        possible_conditions: raw?.possible_conditions || [],

        urgency_level: raw?.urgency_level || 'low',

        advice: raw?.advice || '',

        doctors: raw?.doctors || [],

        symptoms: raw?.symptoms || [],

        specialties: raw?.specialties || [],

        suggested_slots: raw?.suggested_slots || [],
      };
    } catch (error: any) {
      console.error('AI SERVICE ERROR:', error);

      if (error?.response) {
        console.error('Response data:', error.response.data);

        console.error('Status:', error.response.status);
      }

      return {
        session_id: '',

        summary: 'Có lỗi xảy ra khi xử lý AI. Vui lòng thử lại.',

        possible_conditions: [],

        urgency_level: 'low',

        advice: 'Không thể xử lý yêu cầu lúc này.',

        doctors: [],

        symptoms: [],

        specialties: [],

        suggested_slots: [],
      };
    }
  },

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const res = await axiosClient.get(`/ai/chat/history/${sessionId}`);

      return res.data?.data || [];
    } catch (error) {
      console.error('GET CHAT HISTORY ERROR:', error);

      return [];
    }
  },

  async getSessions(patientId: string): Promise<ChatSession[]> {
    try {
      const res = await axiosClient.get(`/ai/chat/sessions/${patientId}`);

      return res.data?.data || [];
    } catch (error) {
      console.error('GET SESSIONS ERROR:', error);

      return [];
    }
  },
};