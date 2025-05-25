
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App, { ProtectedRoute } from '@/App';
import LoginPage from '@/pages/LoginPage';
import DashboardOverviewPage from '@/pages/DashboardOverviewPage';
import StrategiesListPage from '@/pages/StrategiesListPage';
import StrategyDetailsPage from '@/pages/StrategyDetailsPage';
import SignalsStreamPage from '@/pages/SignalsStreamPage';
import TradeReportsPage from '@/pages/TradeReportsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import AdminUserManagementPage from '@/pages/AdminUserManagementPage';
import AdminSystemLogsPage from '@/pages/AdminSystemLogsPage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'dashboard',
        element: <ProtectedRoute><DashboardOverviewPage /></ProtectedRoute>,
      },
      {
        path: 'strategies',
        element: <ProtectedRoute><StrategiesListPage /></ProtectedRoute>,
      },
      {
        path: 'strategies/:strategyId',
        element: <ProtectedRoute><StrategyDetailsPage /></ProtectedRoute>,
      },
      {
        path: 'signals',
        element: <ProtectedRoute><SignalsStreamPage /></ProtectedRoute>,
      },
      {
        path: 'trades',
        element: <ProtectedRoute><TradeReportsPage /></ProtectedRoute>,
      },
      {
        path: 'notifications',
        element: <ProtectedRoute><NotificationsPage /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>,
      },
      {
        path: 'admin',
        element: <ProtectedRoute allowedRoles={['admin']}><div className="p-4">Admin Section <Navigate to="users" replace /></div></ProtectedRoute>,
        children: [
          { path: 'users', element: <AdminUserManagementPage /> },
          { path: 'logs', element: <AdminSystemLogsPage /> },
        ],
      },
      { path: 'unauthorized', element: <UnauthorizedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
  