import Dashboard from '@material-ui/icons/Dashboard';

import DashboardPage from './pages/Dashboard';
import BotsPage from './pages/Bots';
import BuilderPage from './pages/Builder';

const dashboardRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        icon: Dashboard,
        component: DashboardPage,
        layout: '/admin',
    },
    {
        path: '/bots',
        name: 'Bots',
        icon: 'content_paste',
        component: BotsPage,
        layout: '/admin',
    },
    {
        path: '/builder',
        name: 'Bot Builder',
        icon: 'content_paste',
        component: BuilderPage,
        layout: '/admin',
    },
];

export default dashboardRoutes;
