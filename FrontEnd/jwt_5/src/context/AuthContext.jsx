import { createContext, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export function AuthProvider(props) {
    const { children } = props;

    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = (nuevToken) => {
        localStorage.setItem("token", nuevToken);
        setToken(nuevToken);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}