import { Navigate, Outlet } from "react-router-dom"

function PrivateRoute() {
    const token = localStorage.getItem('access_token')

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default PrivateRoute
