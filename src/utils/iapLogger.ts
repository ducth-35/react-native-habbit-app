interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: string;
  message: string;
  data?: any;
}

class IAPLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep only last 100 logs

  private log(level: LogEntry['level'], category: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data
    };

    this.logs.push(entry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with formatting
    const logMessage = `[IAP-${level}] ${category}: ${message}`;
    
    switch (level) {
      case 'ERROR':
        console.error(logMessage, data || '');
        break;
      case 'WARN':
        console.warn(logMessage, data || '');
        break;
      case 'DEBUG':
        console.debug(logMessage, data || '');
        break;
      default:
        console.log(logMessage, data || '');
    }
  }

  info(category: string, message: string, data?: any) {
    this.log('INFO', category, message, data);
  }

  warn(category: string, message: string, data?: any) {
    this.log('WARN', category, message, data);
  }

  error(category: string, message: string, data?: any) {
    this.log('ERROR', category, message, data);
  }

  debug(category: string, message: string, data?: any) {
    this.log('DEBUG', category, message, data);
  }

  // Purchase flow specific methods
  purchaseStarted(productId: string) {
    this.info('PURCHASE', `Purchase started for product: ${productId}`);
  }

  purchaseSuccess(productId: string, transactionId: string) {
    this.info('PURCHASE', `Purchase successful`, { productId, transactionId });
  }

  purchaseFailed(productId: string, error: any) {
    this.error('PURCHASE', `Purchase failed for product: ${productId}`, error);
  }

  consumeStarted(productId: string, transactionId: string) {
    this.info('CONSUME', `Starting consume for transaction`, { productId, transactionId });
  }

  consumeSuccess(productId: string, transactionId: string) {
    this.info('CONSUME', `Consume successful`, { productId, transactionId });
  }

  consumeFailed(productId: string, transactionId: string, error: any) {
    this.error('CONSUME', `Consume failed`, { productId, transactionId, error });
  }

  coinsAdded(amount: number, productId: string, transactionId: string) {
    this.info('COINS', `Added ${amount} coins`, { productId, transactionId });
  }

  transactionProcessed(transactionKey: string) {
    this.info('TRANSACTION', `Transaction processed: ${transactionKey}`);
  }

  transactionSkipped(transactionKey: string, reason: string) {
    this.warn('TRANSACTION', `Transaction skipped: ${transactionKey}`, { reason });
  }

  acknowledgeStarted(productId: string, transactionId: string) {
    this.info('ACKNOWLEDGE', `Starting acknowledge for transaction`, { productId, transactionId });
  }

  acknowledgeSuccess(productId: string, transactionId: string) {
    this.info('ACKNOWLEDGE', `Acknowledge successful`, { productId, transactionId });
  }

  acknowledgeFailed(productId: string, transactionId: string, error: any) {
    this.error('ACKNOWLEDGE', `Acknowledge failed`, { productId, transactionId, error });
  }

  // Get logs for debugging
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Get logs as formatted string
  getLogsAsString(): string {
    return this.logs
      .map(log => `[${log.timestamp}] ${log.level} ${log.category}: ${log.message}${log.data ? ' ' + JSON.stringify(log.data) : ''}`)
      .join('\n');
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.info('SYSTEM', 'Logs cleared');
  }
}

export const iapLogger = new IAPLogger();
