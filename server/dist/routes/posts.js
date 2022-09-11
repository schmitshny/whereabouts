"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_js_1 = require("../controllers/posts.js");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const router = express_1.default.Router();
router.get("/", posts_js_1.getPosts);
router.get("/search", posts_js_1.searchPosts);
router.get("/:id", posts_js_1.getSinglePost);
router.post("/", auth_js_1.default, posts_js_1.createPost);
router.patch("/:id", auth_js_1.default, posts_js_1.updatePost);
router.delete("/:id", auth_js_1.default, posts_js_1.deletePost);
router.patch("/:id/likePost", auth_js_1.default, posts_js_1.likePost);
router.post("/:id/commentPost", auth_js_1.default, posts_js_1.commentPost);
exports.default = router;
