/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../../../api/axiosClient";

export const userService = {
    getUserInfo: async () => {
        const res = await axiosClient.get('/users/me');
        return res.data;
    },
    updateUserInfo: async (payload: any) => {
        const res = await axiosClient.patch('/users/me', payload);
        return res.data;
    }
};