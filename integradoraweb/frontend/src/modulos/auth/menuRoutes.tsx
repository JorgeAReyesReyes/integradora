import UserForm from '../UserForm';
import LoginForm from '../LoginForm';
import Planta_baja from '../Planta_baja';   
import Planta_alta from '../Planta_alta'; 
import Comment  from '../Comment'; 
import HorarioForm from '../HorarioForm'; 

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
    path: '/planta_baja',
    Element: <Planta_baja />,
    label: 'Planta Baja',
  },
  {
    path: '/planta_alta',
    Element: <Planta_alta />,
    label: 'Planta Alta',
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
];

export default routes;