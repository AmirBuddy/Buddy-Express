import { Request, Response, NextFunction } from './types';
import { parse } from 'url';
import { join, normalize } from 'path';
import fs from 'fs-extra';

export async function serveStatic(
  root: string,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsedUrl = parse(req.url as string, true);
    const tempPath = parsedUrl.pathname!;
    const segments = tempPath.split('/');
    const lastSegment = segments[segments.length - 1];
    const pathname = decodeURIComponent(lastSegment);
    const filePath = normalize(join(root, pathname));

    if (!filePath.startsWith(root)) {
      return next(new Error('File Path Is Not Correct'));
    }

    const fileExists = await fs.pathExists(filePath);
    const stats = await fs.stat(filePath);
    if (!fileExists || stats.isDirectory()) {
      return next(new Error("File Doesn't Exist"));
    }

    res.status(200);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('end', () => res.end());
    stream.on('error', (err) => next(err));
  } catch (err) {
    next(err);
  }
}
