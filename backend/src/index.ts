import 'reflect-metadata';
import './module/login/container/container'; 
import  { app }  from "./shared/config/server";
import loginRouter from "./module/login/http/routes/login_route";
import registerRouter from "./module/register/http/routes/register_route";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ta rodando nessa porta aqui papai${PORT}`);
});

app.use('/api', loginRouter)
app.use('/api', registerRouter)