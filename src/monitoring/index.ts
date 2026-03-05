import { Request, Response, NextFunction } from 'express';

interface MetricsData {
  timestamp: Date;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  ip: string;
}

interface SystemMetrics {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  timestamp: Date;
}

class Monitoring {
  private metrics: MetricsData[] = [];
  private systemMetrics: SystemMetrics[] = [];
  private maxMetricsSize = 10000;
  private startTime = Date.now();

  /**
   * Middleware to track request metrics
   */
  requestMetricsMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const self = this;

      // Capture original json function
      const originalJson = res.json;

      res.json = function (data: any) {
        const duration = Date.now() - startTime;
        const metric: MetricsData = {
          timestamp: new Date(),
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
          ip: req.ip || 'unknown',
        };

        self.addMetric(metric);
        return originalJson.call(this, data);
      };

      next();
    };
  }

  /**
   * Add a metric to the collection
   */
  private addMetric(metric: MetricsData) {
    this.metrics.push(metric);

    // Keep metrics size manageable
    if (this.metrics.length > this.maxMetricsSize) {
      this.metrics = this.metrics.slice(-this.maxMetricsSize);
    }
  }

  /**
   * Collect system metrics
   */
  collectSystemMetrics() {
    const metric: SystemMetrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      timestamp: new Date(),
    };

    this.systemMetrics.push(metric);

    // Keep system metrics size manageable
    if (this.systemMetrics.length > 1000) {
      this.systemMetrics = this.systemMetrics.slice(-1000);
    }
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const recentMetrics = this.metrics.filter(
      (m) => m.timestamp.getTime() > oneHourAgo
    );

    const totalRequests = recentMetrics.length;
    const avgDuration =
      totalRequests > 0
        ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests
        : 0;

    const errorCount = recentMetrics.filter((m) => m.statusCode >= 400).length;
    const successCount = recentMetrics.filter((m) => m.statusCode < 400).length;

    const byPath = recentMetrics.reduce(
      (acc, m) => {
        if (!acc[m.path]) {
          acc[m.path] = { count: 0, avgDuration: 0, errors: 0 };
        }
        acc[m.path].count++;
        acc[m.path].avgDuration += m.duration;
        if (m.statusCode >= 400) acc[m.path].errors++;
        return acc;
      },
      {} as Record<string, any>
    );

    // Calculate average duration per path
    Object.keys(byPath).forEach((path) => {
      byPath[path].avgDuration = Math.round(
        byPath[path].avgDuration / byPath[path].count
      );
    });

    return {
      period: '1 hour',
      totalRequests,
      successCount,
      errorCount,
      errorRate: totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0,
      avgDuration: Math.round(avgDuration),
      byPath,
      timestamp: new Date(),
    };
  }

  /**
   * Get system metrics summary
   */
  getSystemMetricsSummary() {
    if (this.systemMetrics.length === 0) {
      return null;
    }

    const latest = this.systemMetrics[this.systemMetrics.length - 1];
    const memoryUsageMB = {
      heapUsed: Math.round(latest.memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(latest.memoryUsage.heapTotal / 1024 / 1024),
      external: Math.round(latest.memoryUsage.external / 1024 / 1024),
      rss: Math.round(latest.memoryUsage.rss / 1024 / 1024),
    };

    return {
      uptime: Math.round(latest.uptime),
      memoryUsageMB,
      cpuUsage: latest.cpuUsage,
      timestamp: latest.timestamp,
    };
  }

  /**
   * Get health status
   */
  getHealthStatus() {
    const systemMetrics = this.getSystemMetricsSummary();
    const requestMetrics = this.getMetricsSummary();

    const isHealthy =
      !systemMetrics ||
      (systemMetrics.memoryUsageMB.heapUsed <
        systemMetrics.memoryUsageMB.heapTotal * 0.9 &&
        (!requestMetrics || requestMetrics.errorRate < 10));

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      uptime: systemMetrics?.uptime || 0,
      memory: systemMetrics?.memoryUsageMB,
      requests: {
        total: requestMetrics?.totalRequests || 0,
        errors: requestMetrics?.errorCount || 0,
        errorRate: requestMetrics?.errorRate || 0,
      },
      timestamp: new Date(),
    };
  }

  /**
   * Get detailed metrics
   */
  getDetailedMetrics() {
    return {
      summary: this.getMetricsSummary(),
      system: this.getSystemMetricsSummary(),
      health: this.getHealthStatus(),
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = [];
    this.systemMetrics = [];
  }
}

export const monitoring = new Monitoring();
