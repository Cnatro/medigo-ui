/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../../api/axiosClient';

export interface AIMessageRequest {
  message: string;
}

export interface AIFormattedResponse {
  summary: string;
  possible_conditions: string[];
  urgency_level: 'low' | 'medium' | 'high';
  advice: string;
  doctors: any[];
  symptoms: any[];
  specialties: any[];
}

export const aiService = {
  async sendMessage(payload: AIMessageRequest): Promise<AIFormattedResponse> {
    try {
      const res = await axiosClient.post('/rag/ai/consult', {
        message: payload.message,
      });

      const raw = res.data?.data;

      if (!raw) {
        throw new Error('AI response is empty');
      }

      return {
        summary: raw?.summary || '',
        possible_conditions: raw?.summary?.possible_conditions || [],
        urgency_level: raw?.summary?.urgency_level || 'low',
        advice: raw?.advice || '',
        doctors: raw?.doctors || [],
        symptoms: raw?.symptoms || [],
        specialties: raw?.specialties || [],
      };
    } catch (error: any) {
      console.error('AI SERVICE ERROR:', error);

      // log chi tiết hơn nếu axios error
      if (error?.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
      }

      return {
        summary: 'Có lỗi xảy ra khi xử lý AI. Vui lòng thử lại.',
        possible_conditions: [],
        urgency_level: 'low',
        advice: 'Không thể xử lý yêu cầu lúc này.',
        doctors: [],
        symptoms: [],
        specialties: [],
      };
    }
  },
};
