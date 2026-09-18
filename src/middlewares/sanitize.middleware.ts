import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

const richTextFields = ['content', 'message', 'description', 'biography'];

export const sanitizeRichText = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    for (const field of richTextFields) {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = sanitizeHtml(req.body[field]);
      }
    }
  }
  next();
};
