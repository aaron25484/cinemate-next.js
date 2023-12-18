import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: 'http://localhost:4000/',
    },
    returnTo: "/"
  })
});