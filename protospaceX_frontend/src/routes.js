import { Navigate, useRoutes } from 'react-router-dom';
// layouts
// import DashboardLayout from './layouts/dashboard';
// import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
// import Blog from './pages/Blog';
// import User from './pages/User';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
// import NotFound from './pages/Page404';
// import Register from './pages/Register';
// import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <LoginPage />,
      children: [
        { path: '/', element: <Navigate to="/LoginPage" /> },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '/beta_testing',
      element: <DashboardApp />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
