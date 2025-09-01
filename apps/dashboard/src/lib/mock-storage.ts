// File-based storage for testing persistence layer
// This simulates database behavior and persists across server restarts

import { defaultTradingPreferences } from '@/types/profile';
import { defaultPortfolioSettings } from '@/types/portfolio';
import fs from 'fs';
import path from 'path';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  bio: string;
  timezone: string;
  avatarUrl?: string | null;
}

interface StorageData {
  profiles: Record<string, UserProfile>;
  preferences: Record<string, any>;
  portfolioSettings: Record<string, any>;
}

const STORAGE_FILE = path.join(process.cwd(), '.mock-storage.json');

export class MockStorage {
  // Load data from file
  private static loadData(): StorageData {
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const data = fs.readFileSync(STORAGE_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading mock storage:', error);
    }
    
    // Return default structure
    return {
      profiles: {},
      preferences: {},
      portfolioSettings: {},
    };
  }

  // Save data to file
  private static saveData(data: StorageData): void {
    try {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving mock storage:', error);
    }
  }

  // Profile methods
  static getUserProfile(userId: string): UserProfile | null {
    const data = this.loadData();
    return data.profiles[userId] || null;
  }

  static setUserProfile(userId: string, profile: Partial<UserProfile>): void {
    const data = this.loadData();
    const existing = data.profiles[userId];
    
    const updated = {
      id: userId,
      name: profile.name || 'Test User',
      email: profile.email || 'test@example.com',
      image: profile.image || null,
      bio: profile.bio || 'Experienced crypto trader focused on DeFi and portfolio optimization.',
      timezone: profile.timezone || 'America/New_York',
      avatarUrl: profile.avatarUrl || null,
      ...existing,
      ...profile,
    };
    
    data.profiles[userId] = updated;
    this.saveData(data);
    console.log('MockStorage: Saved profile for user:', userId, updated);
  }

  // Trading preferences methods
  static getTradingPreferences(userId: string): any {
    const data = this.loadData();
    const preferences = data.preferences[userId];
    
    if (!preferences) {
      // Initialize with defaults and save
      data.preferences[userId] = defaultTradingPreferences;
      this.saveData(data);
      return defaultTradingPreferences;
    }
    return preferences;
  }

  static setTradingPreferences(userId: string, preferences: any): void {
    const data = this.loadData();
    data.preferences[userId] = preferences;
    this.saveData(data);
    console.log('MockStorage: Saved trading preferences for user:', userId, preferences);
  }

  // Portfolio settings methods
  static getPortfolioSettings(userId: string): any {
    const data = this.loadData();
    const settings = data.portfolioSettings[userId];
    
    if (!settings) {
      // Initialize with defaults and save
      data.portfolioSettings[userId] = defaultPortfolioSettings;
      this.saveData(data);
      return defaultPortfolioSettings;
    }
    return settings;
  }

  static setPortfolioSettings(userId: string, settings: any): void {
    const data = this.loadData();
    data.portfolioSettings[userId] = settings;
    this.saveData(data);
    console.log('MockStorage: Saved portfolio settings for user:', userId, settings);
  }

  // Debug methods
  static getAllData(): StorageData {
    return this.loadData();
  }

  static clearAllData(): void {
    const emptyData: StorageData = {
      profiles: {},
      preferences: {},
      portfolioSettings: {},
    };
    this.saveData(emptyData);
    console.log('MockStorage: Cleared all data');
  }
}