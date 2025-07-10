import UserForm from '../UserForm';
import LoginForm from '../LoginForm';
import Comment  from '../Comment'; 
import HorarioForm from '../HorarioForm'; 
import DatosEmporia from '../DatosEmporia'; 
import EdificioC from '../EdificioC';
export interface MenuRoute {
  path: string;
  Element: JSX.Element;
  label: string;
}

const routes: MenuRoute[] = [
  
  {
    path: '/users',
    Element: <UserForm />,
    label: 'Usuarios',
  },
  {
    path: '/login',
    Element: <LoginForm />,
    label: 'Login',
  },

  {
    path: '/Comment',
    Element: <Comment />,
    label: 'Comentarios',
  },

  {
    path: '/HorarioForm',
    Element: <HorarioForm />,
    label: 'Horarios',
  },
    
  { path: "/EdificioC", 
    Element: <EdificioC />,
    label: "EdificioC"
              

  },
    { path: "/DatosEmporia", 
        Element: <DatosEmporia />,
          label: "consumo "
               },
];

export default routes;