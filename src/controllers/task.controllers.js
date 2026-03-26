import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const getTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const Tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  return res
    .status(201)
    .json(new ApiResponse(201, Tasks, "Task fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "project not found");
  }

  const files = req.files || [];
  const attachments = files.map((file) => {
    return {
      url: `{process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.miletype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.objectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task added successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  
});

const updateTask = asyncHandler(async (req, res) => {
  //temp
});

const deleteTask = asyncHandler(async (req, res) => {
  //temp
});

const createSubTask = asyncHandler(async (req, res) => {
  //temp
});

const getSubTask = asyncHandler(async (req, res) => {
  //temp
});

const deleteSubTask = asyncHandler(async (req, res) => {
  //temp
});

const updateSubTask = asyncHandler(async (req, res) => {
  //temp
});

export {
  createTask,
  createSubTask,
  getTask,
  getSubTask,
  getTaskById,
  updateTask,
  updateSubTask,
  deleteTask,
  deleteSubTask,
};
