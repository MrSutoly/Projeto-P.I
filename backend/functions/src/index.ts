import  { app }  from "./infrastructures/configs/server";
import  get  from "./infrastructures/http/routes/user_get";
import  getById  from "./infrastructures/http/routes/user_get_by_id";
import  cadUser  from "./infrastructures/http/routes/user_regist";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ta rodando nessa porta aqui papai${PORT}`);
});

app.use('/api-g', get);
app.use('/api-g', getById);
app.use('/api-p', cadUser);