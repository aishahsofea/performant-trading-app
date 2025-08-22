// Client-side functions removed to avoid Edge Runtime conflicts
import { Session } from "next-auth";

// Session configuration constants
export const SESSION_CONFIG = {
  MAX_AGE: 24 * 60 * 60, // 24 hours in seconds
  MAX_INACTIVITY: 4 * 60 * 60, // 4 hours in seconds
  REFRESH_THRESHOLD: 60 * 60, // 1 hour - refresh if session is older than this
  WARNING_THRESHOLD: 15 * 60, // 15 minutes - warn user before expiry
} as const;

export interface SessionInfo {
  isValid: boolean;
  isExpired: boolean;
  isInactive: boolean;
  timeUntilExpiry: number;
  timeUntilInactivityExpiry: number;
  shouldRefresh: boolean;
  shouldWarn: boolean;
}

/**
 * Validates the current session and returns detailed information
 */
export function validateSession(session: Session | null): SessionInfo {
  if (!session || !session.lastActivity || !session.iat) {
    return {
      isValid: false,
      isExpired: true,
      isInactive: true,
      timeUntilExpiry: 0,
      timeUntilInactivityExpiry: 0,
      shouldRefresh: false,
      shouldWarn: false,
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const lastActivity = session.lastActivity;
  const sessionCreatedAt = session.iat;
  
  // Calculate time since last activity
  const timeSinceActivity = now - lastActivity;
  const timeUntilInactivityExpiry = SESSION_CONFIG.MAX_INACTIVITY - timeSinceActivity;
  
  // Calculate actual session age using the real session creation time
  const sessionAge = now - sessionCreatedAt;
  const timeUntilExpiry = SESSION_CONFIG.MAX_AGE - sessionAge;

  const isInactive = timeSinceActivity > SESSION_CONFIG.MAX_INACTIVITY;
  const isExpired = sessionAge > SESSION_CONFIG.MAX_AGE;
  const isValid = !isInactive && !isExpired;
  
  const shouldRefresh = timeSinceActivity > SESSION_CONFIG.REFRESH_THRESHOLD;
  const shouldWarn = timeUntilInactivityExpiry < SESSION_CONFIG.WARNING_THRESHOLD && timeUntilInactivityExpiry > 0;

  return {
    isValid,
    isExpired,
    isInactive,
    timeUntilExpiry,
    timeUntilInactivityExpiry,
    shouldRefresh,
    shouldWarn,
  };
}

// refreshSession function removed - use client-side getSession() directly in components

/**
 * Formats time in seconds to a human-readable string
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "0 minutes";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

// handleSessionExpiry function removed - use client-side signOut() directly in components