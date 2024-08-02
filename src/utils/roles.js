// src/utils/roles.js

// Define role constants
export const ROLES = {
  ADMIN: "ADMIN",
  RECRUITER: "RECRUITER",
};

// Check if the user has a specific role
export const hasRole = (user, role) => {
  return user?.roles?.includes(role);
};

// Check if the user is an admin
export const isAdmin = (user) => {
  return hasRole(user, ROLES.ADMIN);
};

// Check if the user is a recruiter
export const isRecruiter = (user) => {
  return hasRole(user, ROLES.RECRUITER);
};