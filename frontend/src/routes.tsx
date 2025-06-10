import { Routes, Route} from "react-router-dom";
import Home from "./Pages/Home/index_home";
import Materiais from "./Pages/Materiais/index_materiais";
import Albuns from "./Pages/Albuns/index_albuns";
import Quem_Somos from "./Pages/Quem_somos/index_QuemSomos";
import Percurso from "./Pages/Percurso/index_percurso";
import Trilha from "./Pages/Trilha/index_trilha";
import Ranking from "./Pages/Ranking/index_ranking";
import Login from "./Pages/Login/index_login";

function MainRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="Home" element={<Home/>}/>
            <Route path="Materiais" element={<Materiais/>}/>
            <Route path="Albuns" element={<Albuns/>}/>
            <Route path="Quem_Somos" element={<Quem_Somos/>}/>
            <Route path="Percurso" element={<Percurso/>}/>
            <Route path="Trilha" element={<Trilha/>}/>
            <Route path="Ranking" element={<Ranking/>}/>
            <Route path="Login" element={<Login/>}/>
        </Routes>
    )
}

export default MainRoutes;

