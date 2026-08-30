import { NextFunction, Request, Response } from 'express';
import * as leaderService from '../services/leader.services.js';

//Creates new leader
export const createLeader = async(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leader = await leaderService.createLeader(req.body);
    res.status(201).json(leader);
  } catch (err) {
    next(err);
  }
}

//Return all leaders.
 
export const getLeaders = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> =>{
  try {
    const leaders = await leaderService.getLeaders();
    res.status(200).json(leaders);
  } catch (err) {
    next(err);
  }
}

//Return a single leader
export const getLeaderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> =>{
  try {
    const leader = await leaderService.getLeaderById(req.params.id as string);
    res.status(200).json(leader);
  } catch (err) {
    next(err);
  }
}

//Update pre existing leader
export const updateLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leader = await leaderService.updateLeader(req.params.id as string, req.body);
    res.status(200).json(leader);
  } catch (err) {
    next(err);
  }
}

// Delete a leader by UUID.
export const deleteLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await leaderService.deleteLeader(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
