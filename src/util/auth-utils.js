const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve the User object stored in the Browser's local storage...

  if (user && user.token) {
    return { Authorization: user.token }; // Retrun the proper header
  } else {
    return {}; // Return nothing.
  }
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  getAuthHeader,
  logout,
  getCurrentUser,
};
