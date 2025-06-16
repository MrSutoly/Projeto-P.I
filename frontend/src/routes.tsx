import { Routes, Route} from "react-router-dom";
import Home from "./Pages/Home/index_home";
import Materiais from "./Pages/Materiais/index_materiais";
import Albuns from "./Pages/Albuns/index_albuns";
import Quem_Somos from "./Pages/Quem_somos/index_QuemSomos";
import Percurso from "./Pages/Percurso/index_percurso";
import Trilha from "./Pages/Trilha/index_trilha";
import Ranking from "./Pages/Ranking/index_ranking";
import Login from "./Pages/Login/index_login";
import PrivateRoute from "./Components/PrivateRoute";

function MainRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="Home" element={<Home/>}/>
            <Route path="Materiais" element={<PrivateRoute><Materiais/></PrivateRoute>}/>
            <Route path="Albuns" element={<PrivateRoute><Albuns/></PrivateRoute>}/>
            <Route path="Quem_Somos" element={<Quem_Somos/>}/>
            <Route path="Percurso" element={<PrivateRoute><Percurso/></PrivateRoute>}/>
            <Route path="Trilha" element={<PrivateRoute><Trilha/></PrivateRoute>}/>
            <Route path="Ranking" element={<PrivateRoute><Ranking/></PrivateRoute>}/>
            <Route path="Login" element={<Login/>}/>
        </Routes>
    )
}

export default MainRoutes;

