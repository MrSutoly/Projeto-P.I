import { app } from "./config/server";

// ISSO É SO UM EXEMPLO

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});