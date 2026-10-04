import { Request, Response } from 'express';
import { db } from '../config/db.ts';

export const getActivities = (req: Request, res: Response) => {
  res.json(db.activities.slice(0, 25));
};
