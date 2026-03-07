import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

interface BackupConfig {
  enabled: boolean;
  schedule: string; // cron format
  retentionDays: number;
  storagePath: string;
  databaseUrl: string;
}

interface BackupResult {
  success: boolean;
  filename?: string;
  size?: number;
  timestamp: Date;
  error?: string;
  duration?: number;
}

class BackupManager {
  private config: BackupConfig;
  private backupHistory: BackupResult[] = [];

  constructor(config: Partial<BackupConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      schedule: config.schedule ?? '0 2 * * *', // 2 AM daily
      retentionDays: config.retentionDays ?? 30,
      storagePath: config.storagePath ?? './backups',
      databaseUrl: config.databaseUrl ?? (process.env.DATABASE_URL || ''),
    };
  }

  /**
   * Create a database backup
   */
  async createBackup(): Promise<BackupResult> {
    const startTime = Date.now();

    try {
      // Ensure backup directory exists
      await fs.mkdir(this.config.storagePath, { recursive: true });

      // Generate backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.sql`;
      const filepath = path.join(this.config.storagePath, filename);

      // Extract database credentials from URL
      const dbUrl = new URL(this.config.databaseUrl);
      const user = dbUrl.username;
      const password = dbUrl.password;
      const host = dbUrl.hostname;
      const port = dbUrl.port || '5432';
      const database = dbUrl.pathname.split('/')[1];

      // SECURITY: Use spawn instead of exec to prevent shell injection.
      // Pass PGPASSWORD via environment variables to keep it out of process lists.
      const backupProcess = spawn('pg_dump', [
        '-U', user,
        '-h', host,
        '-p', port,
        database
      ], {
        env: { ...process.env, PGPASSWORD: password }
      });

      const writeStream = (await fs.open(filepath, 'w')).createWriteStream();
      
      return new Promise((resolve) => {
        backupProcess.stdout.pipe(writeStream);

        let errorOutput = '';
        backupProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        backupProcess.on('close', async (code) => {
          if (code === 0) {
            const stats = await fs.stat(filepath);
            const result: BackupResult = {
              success: true,
              filename,
              size: stats.size,
              timestamp: new Date(),
              duration: Date.now() - startTime,
            };
            this.backupHistory.push(result);
            console.log(`✅ Backup created: ${filename} (${this.formatBytes(stats.size)})`);
            await this.cleanupOldBackups();
            resolve(result);
          } else {
            const result: BackupResult = {
              success: false,
              timestamp: new Date(),
              error: errorOutput || `Process exited with code ${code}`,
              duration: Date.now() - startTime,
            };
            this.backupHistory.push(result);
            console.error(`❌ Backup failed: ${result.error}`);
            resolve(result);
          }
        });
      });
    } catch (error) {
      const result: BackupResult = {
        success: false,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      };
      this.backupHistory.push(result);
      console.error(`❌ Backup failed: ${result.error}`);
      return result;
    }
  }

  /**
   * Restore from a backup
   */
  async restoreBackup(filename: string): Promise<BackupResult> {
    const startTime = Date.now();

    try {
      const filepath = path.join(this.config.storagePath, filename);
      await fs.access(filepath);

      const dbUrl = new URL(this.config.databaseUrl);
      const user = dbUrl.username;
      const password = dbUrl.password;
      const host = dbUrl.hostname;
      const port = dbUrl.port || '5432';
      const database = dbUrl.pathname.split('/')[1];

      // SECURITY: Use spawn instead of exec to prevent shell injection.
      const restoreProcess = spawn('psql', [
        '-U', user,
        '-h', host,
        '-p', port,
        database
      ], {
        env: { ...process.env, PGPASSWORD: password }
      });

      const readStream = (await fs.open(filepath, 'r')).createReadStream();

      return new Promise((resolve) => {
        readStream.pipe(restoreProcess.stdin);

        let errorOutput = '';
        restoreProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        restoreProcess.on('close', (code) => {
          if (code === 0) {
            const result: BackupResult = {
              success: true,
              filename,
              timestamp: new Date(),
              duration: Date.now() - startTime,
            };
            console.log(`✅ Backup restored: ${filename}`);
            resolve(result);
          } else {
            const result: BackupResult = {
              success: false,
              filename,
              timestamp: new Date(),
              error: errorOutput || `Process exited with code ${code}`,
              duration: Date.now() - startTime,
            };
            console.error(`❌ Restore failed: ${result.error}`);
            resolve(result);
          }
        });
      });
    } catch (error) {
      const result: BackupResult = {
        success: false,
        filename,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      };
      console.error(`❌ Restore failed: ${result.error}`);
      return result;
    }
  }

  /**
   * List all available backups
   */
  async listBackups(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.config.storagePath);
      return files
        .filter((f) => f.startsWith('backup-') && f.endsWith('.sql'))
        .sort()
        .reverse();
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Get backup details
   */
  async getBackupDetails(filename: string) {
    try {
      const filepath = path.join(this.config.storagePath, filename);
      const stats = await fs.stat(filepath);

      return {
        filename,
        size: stats.size,
        sizeFormatted: this.formatBytes(stats.size),
        created: stats.birthtime,
        modified: stats.mtime,
      };
    } catch (error) {
      console.error('Failed to get backup details:', error);
      return null;
    }
  }

  /**
   * Clean up old backups based on retention policy
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(this.config.storagePath);
      const backupFiles = files.filter(
        (f) => f.startsWith('backup-') && f.endsWith('.sql')
      );

      const now = Date.now();
      const retentionMs = this.config.retentionDays * 24 * 60 * 60 * 1000;

      for (const file of backupFiles) {
        const filepath = path.join(this.config.storagePath, file);
        const stats = await fs.stat(filepath);
        const age = now - stats.mtime.getTime();

        if (age > retentionMs) {
          await fs.unlink(filepath);
          console.log(`🗑️  Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }

  /**
   * Get backup history
   */
  getBackupHistory(): BackupResult[] {
    return this.backupHistory;
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

export const backupManager = new BackupManager({
  enabled: process.env.BACKUP_ENABLED === 'true',
  schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *',
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
  storagePath: process.env.BACKUP_STORAGE_PATH || './backups',
  databaseUrl: process.env.DATABASE_URL,
});