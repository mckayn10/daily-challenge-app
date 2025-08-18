import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  requirements: string[];
  date: string;
  isActive: boolean;
}

interface ChallengeContextType {
  todayChallenge: Challenge | null;
  loading: boolean;
  refreshChallenge: () => Promise<void>;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const ChallengeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todayChallenge, setTodayChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTodayChallenge = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/challenges/today`);
      if (response.ok) {
        const challenge = await response.json();
        setTodayChallenge(challenge);
      } else {
        console.error('Failed to fetch challenge');
        // Fallback challenge
        const fallbackChallenge: Challenge = {
          _id: 'fallback',
          title: 'Gratitude Moment',
          description: 'Take a moment to think about something you\'re grateful for today.',
          category: 'mindfulness',
          difficulty: 'easy',
          points: 10,
          requirements: ['Spend 2 minutes in gratitude'],
          date: new Date().toISOString(),
          isActive: true
        };
        setTodayChallenge(fallbackChallenge);
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
      // Fallback challenge
      const fallbackChallenge: Challenge = {
        _id: 'fallback',
        title: 'Gratitude Moment',
        description: 'Take a moment to think about something you\'re grateful for today.',
        category: 'mindfulness',
        difficulty: 'easy',
        points: 10,
        requirements: ['Spend 2 minutes in gratitude'],
        date: new Date().toISOString(),
        isActive: true
      };
      setTodayChallenge(fallbackChallenge);
    } finally {
      setLoading(false);
    }
  };

  const refreshChallenge = async () => {
    await fetchTodayChallenge();
  };

  useEffect(() => {
    fetchTodayChallenge();
  }, []);

  const value = {
    todayChallenge,
    loading,
    refreshChallenge
  };

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};