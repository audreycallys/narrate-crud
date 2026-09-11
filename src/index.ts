import express from "express";
import postsRoute from "./routes/posts/posts.route";
import categoriesRoute from "./routes/categories/categories.route";
import profileRoute from "./routes/profile/profile.route";
import tagsRoute from "./routes/tags/tags.route";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/posts", postsRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/profile", profileRoute);
app.use("/api/tags", tagsRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
