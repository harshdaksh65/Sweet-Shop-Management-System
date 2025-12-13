import React from 'react'
import { createContext } from 'react'

export const AuthDataContext = createContext();

function AuthContext({children}) {
  return (
    <div>
        <AuthDataContext.Provider value={{}}>
            {children}
        </AuthDataContext.Provider>
    </div>
  )
}

export default AuthContext