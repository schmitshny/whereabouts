"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentPost = exports.likePost = exports.deletePost = exports.updatePost = exports.createPost = exports.searchPosts = exports.getSinglePost = exports.getPosts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postMessage_1 = __importDefault(require("../models/postMessage"));
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.query;
    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT;
        const totalPosts = yield postMessage_1.default.countDocuments({});
        const posts = yield postMessage_1.default.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);
        res.status(200).json({
            data: posts,
            currentPage: Number(page),
            numberOfPages: Math.ceil(totalPosts / LIMIT),
        });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.getPosts = getPosts;
const getSinglePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield postMessage_1.default.findById(id);
        res.status(200).json(post);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.getSinglePost = getSinglePost;
const searchPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchQuery, tags } = req.query;
    try {
        const title = searchQuery ? new RegExp(searchQuery.toString(), "i") : "";
        const posts = yield postMessage_1.default.find({
            $or: [{ title }, { tags: { $in: tags === null || tags === void 0 ? void 0 : tags.toString().split(",") } }],
        });
        res.json({ data: posts });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.searchPosts = searchPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, message, selectedFile, tags, name } = req.body;
    const newPost = new postMessage_1.default({
        title: title !== "" ? title : "No Title",
        message: message !== "" ? message : "No message",
        selectedFile,
        tags,
        name,
        creator: req.userId,
        createdAt: new Date().toISOString(),
    });
    try {
        yield newPost.save();
        res.status(201).json(newPost);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: _id } = req.params;
    const post = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("No post with that id");
    }
    const updatedPost = yield postMessage_1.default.findByIdAndUpdate(_id, post, {
        new: true,
    });
    res.json(updatedPost);
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that id");
    }
    yield postMessage_1.default.findByIdAndRemove(id);
    res.json({ message: "Post deleted." });
});
exports.deletePost = deletePost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (!req.userId)
        return res.json({ message: "Unauthenticated" });
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that id");
    }
    const post = yield postMessage_1.default.findById(id);
    if (post) {
        const index = post.likes.findIndex((id) => id === String(req.userId));
        if (index === -1) {
            (_a = post.likes) === null || _a === void 0 ? void 0 : _a.push(req.userId);
        }
        else {
            post.likes = post.likes.filter((id) => id !== String(req.userId));
        }
        const updatedPost = yield postMessage_1.default.findByIdAndUpdate(id, post, {
            new: true,
        });
        res.json(updatedPost);
    }
});
exports.likePost = likePost;
const commentPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { comment } = req.body;
    const post = yield postMessage_1.default.findById(id);
    if (post) {
        post.comments.push(comment);
        const updatedPost = yield postMessage_1.default.findByIdAndUpdate(id, post, {
            new: true,
        });
        res.json(updatedPost);
    }
});
exports.commentPost = commentPost;
