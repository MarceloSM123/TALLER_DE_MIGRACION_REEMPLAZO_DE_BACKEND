import React, { createContext, useContext } from 'react';

const AuthContext1 = createContext();

export function AuthProvider1(props) {
    const { children } = props;

    return (
        <AuthContext1.Provider value={{"SISTEMA 1":"Bienvenido al sistema" }}>
            {children}
        </AuthContext1.Provider>
    );
}

export function useAuth1() {
    return useContext(AuthContext1);
}