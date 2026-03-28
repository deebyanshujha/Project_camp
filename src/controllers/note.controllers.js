import { Project } from "../models/project.models.js";
import { Note } from "../models/note.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "invalid projectId");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "project not found");
  }

  const notes = await Note.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("createdBy", "username avatar firstName");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notes,
        notes.length ? "Notes fetched successfully" : "No notes found",
      ),
    );
});

const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "invalid projectId");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "project not found");
  }

  const note = await Note.create({
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
    content: content,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, note, "note created successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "invalid noteId");
  }

  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "note not found");
  }

  if (note.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own notes");
  }

  const newNote = await Note.findByIdAndUpdate(
    noteId,
    {
      content: content,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, newNote, "Note updated successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "invalid noteId");
  }

  const note = await Note.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(noteId),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projectName",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        projectName: {
          $arrayElemAt: ["$projectName", 0],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userName",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              firstName: 1,
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        userName: {
          $arrayElemAt: ["$userName", 0],
        },
      },
    },
  ]);

  if (!note || note.length === 0) {
    throw new ApiError(404, "note not found");
  }

  const noteData = note[0];

  return res.status(200).json(
    new ApiResponse(
        200,
        noteData,
        "note fetched successfully"
    )
  )
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "invalid noteId");
  }

  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "note not found");
  }

  if (note.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own notes");
  }

  const newNote = await Note.findByIdAndDelete(noteId);

  return res
    .status(200)
    .json(new ApiResponse(200, newNote, "Note deleted successfully"));
});

export {
    getNotes,
    createNote,
    updateNote,
    getNoteById,
    deleteNote
}
