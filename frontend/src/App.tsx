import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { Spinner } from './components/ui';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Problems = lazy(() => import('./pages/Problems/Problems'));
const Solve = lazy(() => import('./pages/Solve/Solve'));
const History = lazy(() => import('./pages/History/History'));
const Settings = lazy(() => import('./pages/Settings/Settings'));

function PageFallback() {
  return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Spinner size={40} /></div>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problems/:id" element={<Solve />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
