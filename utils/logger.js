class CustomLogger {
  constructor() {
    this.logs = []
    this.maxLogs = 1000 // Prevent memory issues
  }

  log(message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      data,
      level: "INFO",
    }

    this.logs.push(logEntry)

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem("affordmed-logs", JSON.stringify(this.logs.slice(-100)))
    } catch (e) {
      // Handle localStorage quota exceeded
    }

    // Optional: Send to external logging service in real app
    this.sendToExternalService(logEntry)
  }

  error(message, error = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      error: error.message || error,
      stack: error.stack,
      level: "ERROR",
    }

    this.logs.push(logEntry)

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    try {
      localStorage.setItem("affordmed-logs", JSON.stringify(this.logs.slice(-100)))
    } catch (e) {
      // Handle localStorage quota exceeded
    }

    this.sendToExternalService(logEntry)
  }

  warn(message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      data,
      level: "WARN",
    }

    this.logs.push(logEntry)

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    try {
      localStorage.setItem("affordmed-logs", JSON.stringify(this.logs.slice(-100)))
    } catch (e) {
      // Handle localStorage quota exceeded
    }

    this.sendToExternalService(logEntry)
  }

  getLogs() {
    return this.logs
  }

  clearLogs() {
    this.logs = []
    localStorage.removeItem("affordmed-logs")
  }

  sendToExternalService(logEntry) {
    // In a real application, you would send logs to an external service
    // For now, we'll just simulate this
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      // Only in development - you could send to a local logging server
      // fetch('http://localhost:8080/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // }).catch(() => {}) // Silently fail if logging server is not available
    }
  }
}

export const Logger = new CustomLogger()
