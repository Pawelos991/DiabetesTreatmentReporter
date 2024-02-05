import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { AuthenticationResponse, UserResponse } from '@/api';

type AuthenticationState =
  | {
      isAuthenticated: true;
      user: UserResponse;
    }
  | { isAuthenticated: false; user: undefined };

export type AuthContextValue = {
  isAuthenticated: boolean;
  user?: UserResponse;
  setAuthenticationState: Dispatch<SetStateAction<AuthenticationState>>;
  setAuthenticationStateFromResponse: (response: AuthenticationResponse) => void;
};

export const AuthContext = React.createContext<AuthContextValue>(null!);

function Fetcher(props: {
  setAuthenticationState: (s: AuthenticationState) => void;
  children: ReactNode;
}) {
  return <>{props.children}</>;
}

export default function AuthProvider(props: { children: ReactNode }) {
  const [{ isAuthenticated, user }, setAuthenticationState] =
    useState<AuthenticationState>({
      isAuthenticated: false,
      user: undefined,
    });

  const setAuthenticationStateFromResponse = (response: AuthenticationResponse) => {
    if (response.authenticated) {
      setAuthenticationState({
        isAuthenticated: true,
        user: response.userResponse!,
      });
    } else {
      setAuthenticationState({
        isAuthenticated: false,
        user: undefined,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setAuthenticationState,
        setAuthenticationStateFromResponse,
      }}
    >
      <Fetcher setAuthenticationState={setAuthenticationState}>{props.children}</Fetcher>
    </AuthContext.Provider>
  );
}
