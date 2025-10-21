// Session storage for user data
// In production, replace this with Redis or a database
class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  // Get session data
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  // Set session data
  setSession(sessionId, data) {
    this.sessions.set(sessionId, {
      ...this.getSession(sessionId),
      ...data,
      lastActivity: new Date(),
    });
  }

  // Update session language
  setLanguage(sessionId, language) {
    const session = this.getSession(sessionId) || {};
    this.setSession(sessionId, { ...session, language });
  }

  // Get session language
  getLanguage(sessionId) {
    const session = this.getSession(sessionId);
    return session?.language || "en";
  }

  // Clear session
  clearSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  // Clean up old sessions (older than 30 minutes)
  cleanupSessions() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < thirtyMinutesAgo) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

// Run cleanup every 10 minutes
setInterval(() => {
  sessionManager.cleanupSessions();
}, 10 * 60 * 1000);
