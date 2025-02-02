// UserContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  name: string;
  age: number;
  gender: string;
  salary: number;
  RRSP_total: number;
  TFSA_total: number;
  RRSP_contribution: number;
  TFSA_contribution: number;
  RRSP_prices: {
    [key: string]: number;
  };
  TFSA_prices: {
    [key: string]: number;
  };
}

interface UserContextType {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
  users: User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/users/users.json');
        const data = await response.json();
        setUsers(data);
        setSelectedUser(data[0]); // Set default user
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, []);

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser, users }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
