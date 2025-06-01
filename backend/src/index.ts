import 'reflect-metadata';
import './module/login/container/container'; 
import './module/register/container/container';
import './module/auth/container/container';
import './module/management/container/container';
import './module/quizmanagement/container/container'; 
import  { app }  from "./shared/config/server";
import { ensureAuthenticated } from './module/auth/middleware/ensure_authenticated';
import loginRouter from "./module/login/http/routes/login_route";
import registerRouter from "./module/register/http/routes/register_route";
import managementRouter from './module/management/http/routes/management_route';
import quizRouter from './module/quizmanagement/http/routes/quiz_route'

const PORT = process.env.PORT || 3000;

app.use('/api', loginRouter);
app.use('/api', registerRouter);

// Rotas protegidas (precisam de autenticação)
app.use('/api/management', managementRouter);
app.use('/api', quizRouter);

app.listen(PORT, () => {
  console.log(`ta rodando nessa porta aqui papai ${PORT}`);
});