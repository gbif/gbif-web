import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavigationCompleteEvent } from "./events";

export function NavigationListener() {
    const location = useLocation();

    useEffect(() => {
        new NavigationCompleteEvent().dispatch();
    }, [location.pathname]);

    return <Outlet />;
}