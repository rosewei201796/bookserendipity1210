import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { 
  getCurrentUser, 
  setCurrentUser as setStorageCurrentUser,
  addUser,
  getUserByUsername,
  getStorageData,
  setStorageData,
} from '@/utils/storage';
import { generateId } from '@/utils/helpers';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleLike: (cardId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple password hashing (for demo purposes - in production use proper hashing)
const hashPassword = (password: string): string => {
  return btoa(password); // Base64 encoding (NOT secure for production!)
};

// Store passwords separately in localStorage (for demo purposes)
const PASSWORDS_KEY = 'ai-book-channels-passwords';

const getPasswords = (): Record<string, string> => {
  try {
    const data = localStorage.getItem(PASSWORDS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const setPassword = (username: string, password: string): void => {
  const passwords = getPasswords();
  passwords[username] = hashPassword(password);
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
};

const verifyPassword = (username: string, password: string): boolean => {
  const passwords = getPasswords();
  return passwords[username] === hashPassword(password);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load current user from localStorage on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Validate input
    if (!username || !password) {
      return { success: false, error: 'Please enter username and password' };
    }

    // Find user by username
    const existingUser = getUserByUsername(username);
    if (!existingUser) {
      return { success: false, error: 'User not found' };
    }

    // Verify password
    if (!verifyPassword(username, password)) {
      return { success: false, error: 'Incorrect password' };
    }

    // Set current user
    setUser(existingUser);
    setStorageCurrentUser(existingUser.id);

    return { success: true };
  };

  const register = async (
    username: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Validate input
    if (!username || !password) {
      return { success: false, error: 'Please fill in all fields' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if username already exists
    if (getUserByUsername(username)) {
      return { success: false, error: 'This username is already taken' };
    }

    // Create new user (without email)
    const newUser: User = {
      id: generateId(),
      username,
      createdAt: new Date().toISOString(),
      likedCardIds: [], // 初始化点赞列表
    };

    // Save user and password
    addUser(newUser);
    setPassword(username, password);

    // Set as current user
    setUser(newUser);
    setStorageCurrentUser(newUser.id);

    return { success: true };
  };

  const logout = (): void => {
    setUser(null);
    setStorageCurrentUser(null);
  };

  const toggleLike = (cardId: string): void => {
    if (!user) return;
    
    const data = getStorageData();
    const userIndex = data.users.findIndex((u) => u.id === user.id);
    if (userIndex === -1) return;

    const likedCardIds = [...user.likedCardIds];
    const cardIndex = likedCardIds.indexOf(cardId);
    
    if (cardIndex > -1) {
      // Unlike
      likedCardIds.splice(cardIndex, 1);
    } else {
      // Like
      likedCardIds.push(cardId);
    }

    const updatedUser = { ...user, likedCardIds };
    data.users[userIndex] = updatedUser;
    setStorageData(data);
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    toggleLike,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

