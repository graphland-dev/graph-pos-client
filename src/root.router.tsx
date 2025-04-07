import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingFallback from './commons/components/LoadingFallback';
import { RouteGuardWrapper } from './commons/components/wrappers/RouteGuardWrapper';
import { accountingModuleRouter } from './pages/(tenant)/accounting/accounting.router';
import { inventoryModuleRouter } from './pages/(tenant)/inventory-management/inventory.router';
import { peopleModuleRouter } from './pages/(tenant)/people/people.route';
import { reportsModuleRouter } from './pages/(tenant)/reports/in.router';
import { tenantSettingRouter } from './pages/(tenant)/tenant-settings/tenant-settings.route';
import { authRouter } from './pages/auth/auth.router.tsx';

// Lazy load components
const NotFoundPage = lazy(() => import('./pages/_404.page'));
const DesignSystem = lazy(() => import('./pages/design-system.page'));
const SelectOrganization = lazy(
  () => import('./pages/select-organization.page'),
);
const SpotlightWrapper = lazy(
  () => import('@/commons/components/SpotlightWrapper'),
);
const TenantResolverForApollo = lazy(
  () => import('./pages/(tenant)/tenant-resolver-for-apollo.tsx'),
);
const ModulesPage = lazy(() => import('./pages/(tenant)/modules.page'));

// Import route configurations

export const rootRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SpotlightWrapper />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/select-tenant" />,
      },
      {
        path: '/design-system',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DesignSystem />
          </Suspense>
        ),
      },
      {
        path: '/select-tenant',
        element: (
          <RouteGuardWrapper guard="private">
            <Suspense fallback={<LoadingFallback />}>
              <SelectOrganization />
            </Suspense>
          </RouteGuardWrapper>
        ),
      },
      {
        path: '/auth',
        children: authRouter,
      },
      {
        path: '/:tenant',
        element: (
          <RouteGuardWrapper guard="private">
            <Suspense fallback={<LoadingFallback />}>
              <TenantResolverForApollo />
            </Suspense>
          </RouteGuardWrapper>
        ),
        children: [
          {
            path: '',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ModulesPage />
              </Suspense>
            ),
          },
          {
            path: 'accounting',
            children: accountingModuleRouter,
          },
          {
            path: 'inventory-Management',
            children: inventoryModuleRouter,
          },
          {
            path: 'people',
            children: peopleModuleRouter,
          },
          {
            path: 'reports',
            children: reportsModuleRouter,
          },
          {
            path: 'tenant-settings',
            children: tenantSettingRouter,
          },
        ],
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
