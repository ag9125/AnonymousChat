// src/components/PrivateRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Usage for v6 react-router:
 * Wrap protected routes inside <Route element={<PrivateRoute />}>
 * and then nested <Route> for actual paths.
 */
const PrivateRoute = () => {
  const token = useSelector((state) => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
