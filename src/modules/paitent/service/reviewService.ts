/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../../../api/axiosClient";

export const reviewService = {
    createReviews: async (payload: any) => {
        const res = await axiosClient.post('/reviews', payload);
        return res.data;
    },

    getReviewByDoctorId: async (doctor_id: string) => {
        const res = await axiosClient.get(`/reviews/doctors/${doctor_id}/reviews`);
        return res.data;
    },

    getRatingByDoctorId: async (doctor_id: string) => {
        const res = await axiosClient.get(`/doctors/${doctor_id}/rating`);
        return res.data;
    }
};