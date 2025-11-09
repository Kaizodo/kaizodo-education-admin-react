import CenterLoading from "@/components/common/CenterLoading";
import NotAllowed403 from "@/pages/errors/NotAllowed403";
import { type LazyExoticComponent, Suspense } from "react";
import { Route } from "react-router-dom";
import { Permissions } from "./Permissions";

export type RouteType = {
  path?: string;
  element: LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
  children?: RouteType[];
  permissions?: Permissions[];
};

export const buildRoutes = (routes: RouteType[], storedPermissions: Permissions[]) => {
  return routes.map(({ path, element: Component, children, permissions }) => {
    const isAllowed =
      !permissions || permissions.some(p => storedPermissions.includes(p));



    return (
      <Route
        key={path || 'default'}
        path={path}
        element={
          <Suspense fallback={<CenterLoading />}>
            {isAllowed ? <Component /> : <NotAllowed403 />}
          </Suspense>
        }
      >
        {children && buildRoutes(children, storedPermissions)}
      </Route>
    );
  });
};
