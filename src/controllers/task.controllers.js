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
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.objectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;
  const { taskId } = req.params;

  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      name: name,
      description: description,
      status: status,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    throw new ApiError(404, "task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Task.findByIdAndDelete(taskId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid task ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtask = await Subtask.create({
    title,
    task: taskId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

const getSubTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "taskId invalid");
  }
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "task not found");
  }
  const subTasks = await Subtask.find({
    task: new mongoose.Types.ObjectId(taskId),
  }).populate("createdBy", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, subTasks, "Subtask fetched successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(subTaskId)) {
    throw new ApiError(400, "request invalid");
  }

  const subTask = await Subtask.findById(subTaskId);
  if (!subTask) {
    throw new ApiError(404, "subTask not found");
  }

  const deletedSubTask = await Subtask.findByIdAndDelete(subTaskId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subtask deleted successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { title, isCompleted } = req.body;
  const { subTaskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(subTaskId)) {
    throw new ApiError(400, "request invalid");
  }

  const updateFields = {};

  if (title !== undefined) updateFields.title = title;
  if (isCompleted !== undefined) updateFields.isCompleted = isCompleted;

  const subTask = await Subtask.findById(subTaskId);
  if (!subTask) {
    throw new ApiError(404, "subTask not found");
  }

  const updatedSubtask = await Subtask.findByIdAndUpdate(
    subTaskId,
    updateFields,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedSubtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubtask, "subtask updated successfully"));
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
