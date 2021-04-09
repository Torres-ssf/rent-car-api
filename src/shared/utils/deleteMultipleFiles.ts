import fs from 'fs';

export const deleteMultipleFiles = async (
  filePaths: string[],
): Promise<unknown> => {
  return filePaths.map(async filePath => {
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  });
};
