import { createContext, useState, useEffect, type ReactNode } from "react";

export const AuthContext = createContext({});

type Props = { children: ReactNode };

function AuthContextProvider({ children }: Props) {
  const [userInfo, setUserInfo] = useState(null);
  const value = { userInfo, setUserInfo };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
