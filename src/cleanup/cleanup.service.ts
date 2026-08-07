import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Для теста каждые 10 секунд
  // Потом поменяй на: @Cron('0 */12 * * *')
  @Cron('0 */12 * * *')
  async cleanUploads() {
    this.logger.log('=== Начинаю очистку uploads ===');

    const uploadsDir = path.join(process.cwd(), 'uploads');

    try {
      const dbFiles = await this.prisma.message.findMany({
        where: {
          fileUrl: {
            not: null,
          },
        },
        select: {
          fileUrl: true,
        },
      });

      // Храним пути относительно uploads
      const usedFiles = new Set(
  dbFiles
    .map((f) => f.fileUrl)
    .filter(Boolean)
    .map((file) =>
      path.normalize(file!),
    ),
);

      await this.scanFolder(uploadsDir, uploadsDir, usedFiles);

      this.logger.log('=== Очистка завершена ===');
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async scanFolder(
    rootDir: string,
    currentDir: string,
    usedFiles: Set<string>,
  ): Promise<void> {
    const items = await fs.readdir(currentDir, {
      withFileTypes: true,
    });

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);

      if (item.isDirectory()) {
        await this.scanFolder(rootDir, fullPath, usedFiles);
        continue;
      }

      const relativePath = path
        .relative(rootDir, fullPath)
        .replace(/\\/g, '/');

      this.logger.log(`Файл: ${relativePath}`);

      if (usedFiles.has(relativePath)) {
        this.logger.log('Используется');
        continue;
      }

      this.logger.warn(`Удаляю: ${relativePath}`);

      try {
        await fs.unlink(fullPath);
        this.logger.log(`Удален: ${relativePath}`);
      } catch (err) {
        this.logger.error(`Ошибка удаления ${relativePath}`, err);
      }
    }
  }
}