import React from "react";
import RoleProtectedRoute, { RoleProtectedRouteProps } from "./RoleProtectedRoute";

export type ProtectedRouteProps = RoleProtectedRouteProps;

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  return <RoleProtectedRoute {...props} />;
};

export default ProtectedRoute;
