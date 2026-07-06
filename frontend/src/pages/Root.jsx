import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import SidebarBase from '../components/daisyui/Sidebar/SidebarBase.jsx';
import escuelaConductoresImg from '@assets/Escuela-de-Conductores-Conduce.jpg';

const backgroundStyle = {
  backgroundImage: `url(${escuelaConductoresImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  filter: 'blur(2px)',
  opacity: 0.6,
  position: 'fixed',
  top: 0,
  left: '16rem',
  right: 0,
  bottom: 0,
  zIndex: 1
};

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const PageContent = (
      <div className="page-content">
        <Outlet />
      </div>
  );

  return (
    <div className="page-root">
      <SidebarBase pageContent={PageContent}/>
    </div>
  );
}

export default Root;
