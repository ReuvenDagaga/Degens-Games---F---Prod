import axios from "axios";

const API_URL = "http://localhost:3456/api";

export const getRoomById = async (roomId) => {
  try {
    const response = await axios.get(`${API_URL}/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getActiveRooms = async (gameType) => {
  try {
    const params = gameType ? { gameType } : {};
    const response = await axios.get(`${API_URL}/available`, { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllRooms = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters,
    };
    const response = await axios.get(`${API_URL}/rooms`, { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const joinRoomOrCreate = async (userId, gameType) => {
  try {
    const response = await axios.post(`${API_URL}/rooms`, {
      userId,
      gameType,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const startGame = async (roomId) => {
  try {
    const response = await axios.post(`${API_URL}/${roomId}/start`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const endGame = async (roomId) => {
  try {
    const response = await axios.post(`${API_URL}/rooms/${roomId}/end`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};


