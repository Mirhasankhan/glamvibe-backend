import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { servicesService } from "./services.service";
import sendResponse from "../../../shared/sendResponse";

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await servicesService.createServiceIntoDb(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Service created successfully",
    data: result,
  });
});
const getServices = catchAsync(async (req: Request, res: Response) => {
  const result = await servicesService.getAllServiceFromDb();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Service Retrieved successfully",
    data: result,
  });
});
const getService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await servicesService.getServiceFromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Service Retrieved successfully",
    data: result,
  });
});
const deleteService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await servicesService.deleteServiceFromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Service Deleted successfully",
    data: result,
  });
});

export const serviceController = {
  createService,
  getServices,
  getService,
  deleteService
};
