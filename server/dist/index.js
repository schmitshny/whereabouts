"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const posts_js_1 = __importDefault(require("./routes/posts.js"));
const users_js_1 = __importDefault(require("./routes/users.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
app.use((0, cors_1.default)());
app.use("/posts", posts_js_1.default);
app.use("/user", users_js_1.default);

const PORT = process.env.PORT || 5000;
mongoose_1.default
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.log(error.message);
  });
