// src/auth.js
import { jwtDecode } from "jwt-decode";
import { isAdmin, isRecruiter } from "./roles";

export function getToken() {
  return localStorage.getItem("token");
}

export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token) {
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    return true;
  }

  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}