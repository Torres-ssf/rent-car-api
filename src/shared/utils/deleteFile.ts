import fs from 'fs';

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.promises.stat(filePath);
  } catch {
    return;
  }

  await fs.promises.unlink(filePath);
};
