import axios from "axios";

const API_URL = "http://localhost:3000/api/";

const getPosts = () => {
  return axios.get(API_URL + "posts", { headers: getAuthHeader() });
};

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve the User object stored in the Browser's local storage...

  if (user && user.token) {
    return { Authorization: user.token }; // Retrun the proper header
  } else {
    return {}; // Return nothing.
  }
};

const isLoggedIn = () => {
  let user = getCurrentUser();
  if (user) return true;
  else return false;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  getPosts,
  getAuthHeader,
  logout,
  isLoggedIn,
  getCurrentUser,
};
