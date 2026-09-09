import express from "express";
import postsRoute from "./routes/posts/posts.route";
import categoriesRoute from "./routes/categories/categories.route";
import commentsRoute from "./routes/comments/comments.route";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/' , (req, res) => {
    res.send("Hello World");
})

app.use('/api/posts', postsRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/posts", commentsRoute);

app.listen(PORT , () => {
    console.log(`Server running on http://localhost:${PORT}`);
})