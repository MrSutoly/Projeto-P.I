import 'reflect-metadata';
import './module/login/container/container'; 
import './module/register/container/container';
import './module/auth/container/container';
import  { app }  from "./shared/config/server";
import { ensureAuthenticated } from './module/auth/middleware/ensure_authenticated';
import loginRouter from "./module/login/http/routes/login_route";
import registerRouter from "./module/register/http/routes/register_route";

const PORT = process.env.PORT || 3000;


app.use('/api', loginRouter)
app.use('/api', registerRouter)

app.listen(PORT, () => {
  console.log(`ta rodando nessa porta aqui papai ${PORT}`);
});