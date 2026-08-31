export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export class Logger {
  private static formatLog(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  public static info(message: string, context?: Record<string, any>): void {
    console.log(this.formatLog(LogLevel.INFO, message, context));
  }

  public static warn(message: string, context?: Record<string, any>): void {
    console.warn(this.formatLog(LogLevel.WARN, message, context));
  }

  public static error(message: string, error?: Error | any, context?: Record<string, any>): void {
    const errorDetails = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error;
    const combinedContext = { ...context, error: errorDetails };
    console.error(this.formatLog(LogLevel.ERROR, message, combinedContext));
  }

  public static debug(message: string, context?: Record<string, any>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatLog(LogLevel.DEBUG, message, context));
    }
  }
}
