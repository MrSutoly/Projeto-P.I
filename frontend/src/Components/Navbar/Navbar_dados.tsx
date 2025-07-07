export const Navbar_dados = [
    // {
    //     nome: "Menu", 
    //     icone: <i className="fa-solid fa-bars"></i>,
    //     link: "/home",
    // },

    {
        nome: "Início", 
        icone: <i className="fas fa-solid fa-house" ></i>,
        link: "/Home",
    },
    {
        nome: "Materiais", 
        icone: <i className="fa-solid fa-folder"></i>,
        link: "/Materiais",
    },
    {
        nome: "Albuns", 
        icone: <i className="fa-solid fa-camera"></i>,
        link: "/Albuns",
    },
    {
        nome: "Quem somos", 
        icone: <i className="fa-solid fa-font-awesome"></i>,
        link: "/Quem_Somos",
    },
    {
        nome: "Percurso", 
        icone: <i className="fa-solid fa-paper-plane"></i>,
        link: "/Percurso",
    },
    /*{
        nome: "Trilha", 
        icone: <i className="fa-solid fa-truck-moving"></i>,
        link: "/Trilha",
    },*/
    {
        nome: "Ranking", 
        icone: <i className="fa-solid fa-trophy"></i>,
        link: "/Ranking",
    },
    {
        nome: "Gerenciar Alunos", 
        icone: <i className="fa-solid fa-users"></i>,
        link: "/CadastroAlunos",
        userType: "professor"
    },
    {
        nome: "Gerenciar Turmas", 
        icone: <i className="fa-solid fa-graduation-cap"></i>,
        link: "/CadastroTurmas",
        userType: "professor"
    },
    {
        nome: "Gerenciar Professores", 
        icone: <i className="fa-solid fa-user-tie"></i>,
        link: "/CadastroProfessores",
        userType: "admin"
    },
    {
        nome: "Gerenciar Turmas", 
        icone: <i className="fa-solid fa-graduation-cap"></i>,
        link: "/CadastroTurmas",
        userType: "admin"
    },
    {
        nome: "Login", 
        icone: <i className="fa-solid fa-user"></i>,
        link: "/Login",
    },
]