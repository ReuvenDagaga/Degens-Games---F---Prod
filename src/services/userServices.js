import axios from "axios";

const BASE_URL = "http://localhost:3456";

export const getUserById = async (userId) => {
    const response = await axios.get(`${BASE_URL}/api/getUserById/${userId}`);
    return response.data;
}

export const getAllUsers = async () => {
    const response = await axios.get(`${BASE_URL}/api/users`);
    return response.data;
}

export const updateUser = async (userId, updatedUser) => {    
    const response = await axios.put(`${BASE_URL}/api/${userId}`, updatedUser);
    return response.data.data;
}

export const updateUserScoreAsArrey = async (userId, ScoreAsArrey) => {    
    const response = await axios.put(`${BASE_URL}/api/ScoreAsArrey/${userId}`, ScoreAsArrey);
    return response.data.data;
}

