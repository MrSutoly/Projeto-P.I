import { app } from "./config/server";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ta rodando nessa porta aqui papai${PORT}`);
});