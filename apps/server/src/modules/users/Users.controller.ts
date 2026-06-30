import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse.js";
import UserService from "./Users.service.js";

export const UserRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await UserService.Create(req.body);
    sendResponse(res, data, "User registered successfully", 201);
  } catch (e: any) {
    next(e);
  }
};

export const UserUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const data = await UserService.Update(id, req.body);
    sendResponse(res, data, "User updated successfully");
  } catch (e: any) {
    next(e);
  }
};

export const GetAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, meta } = await UserService.GetAll(req.query as Record<string, unknown>);
    sendResponse(res, data, "Users fetched successfully", 200, meta);
  } catch (e: any) {
    next(e);
  }
};

export const GetOneUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const data = await UserService.GetById(id);
    sendResponse(res, data, "User fetched successfully");
  } catch (e: any) {
    next(e);
  }
};

export const DeleteOneUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const data = await UserService.Delete(id);
    sendResponse(res, data, "User deleted successfully");
  } catch (e: any) {
    next(e);
  }
};

export const RefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const data = await (UserService as any).RefreshToken(refreshToken);
    sendResponse(res, data, "Token refreshed successfully");
  } catch (error: any) {
    next(error);
  }
};

export const Logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const data = await (UserService as any).Logout(refreshToken);
    sendResponse(res, data, "Logged out successfully");
  } catch (error: any) {
    next(error);
  }
};

export const UserLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await UserService.Login(req.body);
    sendResponse(res, data, "Login successful");
  } catch (error: any) {
    next(error);
  }
};
