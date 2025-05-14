import { app } from "./config/server";
import { get } from "./routes/GET/route_get";
import { getById } from "./routes/GET/route_get_by_id";
import { post } from "./routes/POST/route_cad_user";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ta rodando nessa porta aqui papai${PORT}`);
});

app.use('/api-g', get);
app.use('/api-g', getById);
app.use('/api-p', post);