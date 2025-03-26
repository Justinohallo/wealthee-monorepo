/**
 * API Monitoring Utility
 *
 * Tracks API call performance and status for Firebase Functions
 */

export interface ApiCall {
  functionName: string;
  startTime: number;
  endTime?: number;
  status: 'pending' | 'success' | 'error';
  duration?: number;
  errorMessage?: string;
  statusCode?: number;
}

export interface ApiStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  pendingCalls: number;
  successRate: number;
  averageDuration: number;
  slowestCall: number;
  fastestCall: number;
}

export interface ApiErrorInfo {
  message?: string;
  statusCode?: number;
  functionName: string;
  responseData?: unknown;
}

type ApiMonitorListener = (calls: ApiCall[]) => void;

class ApiMonitor {
  private calls: ApiCall[] = [];
  private listeners: ApiMonitorListener[] = [];
  private maxHistory: number = 100;
  private slowCallThreshold: number = 1000; // 1 second

  constructor() {
    // Initialize with empty calls array
  }

  /**
   * Start tracking a new API call
   */
  public startCall(functionName: string): void {
    const call: ApiCall = {
      functionName,
      startTime: Date.now(),
      status: 'pending'
    };

    this.calls.push(call);
    this.trimHistory();
    this.notifyListeners();
  }

  /**
   * Mark an API call as successful
   */
  public endCallSuccess(functionName: string): void {
    this.endCall(functionName, 'success');
  }

  /**
   * Mark an API call as failed
   */
  public endCallError(functionName: string, error: Error | ApiErrorInfo): void {
    this.endCall(functionName, 'error', error);
  }

  /**
   * Update call with end time and status
   */
  private endCall(functionName: string, status: 'success' | 'error', error?: Error | ApiErrorInfo): void {
    const pendingCalls = this.calls.filter(
      call => call.functionName === functionName && call.status === 'pending'
    );

    if (pendingCalls.length === 0) {
      console.warn(`No pending call found for ${functionName}`);
      return;
    }

    // Get the most recent pending call for this function
    const call = pendingCalls[pendingCalls.length - 1];

    if (!call) {
      console.warn(`Could not find pending call for ${functionName}`);
      return;
    }

    call.status = status;
    call.endTime = Date.now();
    call.duration = call.endTime - call.startTime;

    if (status === 'error' && error) {
      if ('message' in error) {
        call.errorMessage = error.message;
      }

      if ('statusCode' in error) {
        call.statusCode = error.statusCode;
      } else if (error instanceof Error && 'status' in error) {
        // @ts-expect-error - handle potential status property in Error objects
        call.statusCode = error.status;
      }
    }

    this.notifyListeners();
  }

  /**
   * Get all tracked API calls
   */
  public getCalls(): ApiCall[] {
    return [...this.calls];
  }

  /**
   * Get statistics for API calls within a time window
   */
  public getStats(timeWindowMinutes: number = 5): ApiStats {
    const cutoffTime = Date.now() - (timeWindowMinutes * 60 * 1000);
    const recentCalls = this.calls.filter(call => call.startTime >= cutoffTime);

    const completedCalls = recentCalls.filter(call => call.status !== 'pending');
    const successfulCalls = recentCalls.filter(call => call.status === 'success');
    const failedCalls = recentCalls.filter(call => call.status === 'error');
    const pendingCalls = recentCalls.filter(call => call.status === 'pending');

    const durations = completedCalls
      .filter(call => call.duration !== undefined)
      .map(call => call.duration as number);

    const averageDuration = durations.length > 0
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length
      : 0;

    const successRate = recentCalls.length > 0
      ? (successfulCalls.length / recentCalls.length) * 100
      : 100;

    return {
      totalCalls: recentCalls.length,
      successfulCalls: successfulCalls.length,
      failedCalls: failedCalls.length,
      pendingCalls: pendingCalls.length,
      successRate,
      averageDuration,
      slowestCall: durations.length > 0 ? Math.max(...durations) : 0,
      fastestCall: durations.length > 0 ? Math.min(...durations) : 0
    };
  }

  /**
   * Get recent errors
   */
  public getRecentErrors(limit: number = 5): ApiCall[] {
    return this.calls
      .filter(call => call.status === 'error')
      .sort((a, b) => (b.startTime - a.startTime))
      .slice(0, limit);
  }

  /**
   * Get slow calls that exceed the threshold
   */
  public getSlowCalls(limit: number = 5): ApiCall[] {
    return this.calls
      .filter(call => call.duration !== undefined && call.duration >= this.slowCallThreshold)
      .sort((a, b) => ((b.duration || 0) - (a.duration || 0)))
      .slice(0, limit);
  }

  /**
   * Get counts by function name
   */
  public getFunctionCounts(): Record<string, { total: number, success: number, error: number }> {
    const counts: Record<string, { total: number, success: number, error: number }> = {};

    this.calls.forEach(call => {
      if (!counts[call.functionName]) {
        counts[call.functionName] = { total: 0, success: 0, error: 0 };
      }

      const functionStats = counts[call.functionName];
      if (functionStats) {
        functionStats.total++;

        if (call.status === 'success') {
          functionStats.success++;
        } else if (call.status === 'error') {
          functionStats.error++;
        }
      }
    });

    return counts;
  }

  /**
   * Subscribe to updates
   */
  public subscribe(listener: ApiMonitorListener): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    const calls = this.getCalls();
    this.listeners.forEach(listener => listener(calls));
  }

  /**
   * Set the maximum history size
   */
  public setMaxHistory(size: number): void {
    this.maxHistory = size;
    this.trimHistory();
  }

  /**
   * Set the threshold for slow calls
   */
  public setSlowCallThreshold(threshold: number): void {
    this.slowCallThreshold = threshold;
  }

  /**
   * Trim history to max size
   */
  private trimHistory(): void {
    if (this.calls.length > this.maxHistory) {
      this.calls = this.calls.slice(-this.maxHistory);
    }
  }

  /**
   * Clear all history
   */
  public clearHistory(): void {
    this.calls = [];
    this.notifyListeners();
  }
}

// Create singleton instance
export const apiMonitor = new ApiMonitor();
