
import { getAccessToken } from '@auth0/nextjs-auth0';

export function useAuth() {
  const getToken = async () => {
    try {
      const token = await getAccessToken();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  return {
    getToken,
  };
}
