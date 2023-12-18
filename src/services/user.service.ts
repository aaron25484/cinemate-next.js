const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createUser = async (userObject: {}) => {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}users`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userObject),
    });
    const dataFetched = await response.json();
    return dataFetched;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}users/${email}`);

    if (!response.ok) {
      console.error(`getUserByEmail response: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export const updateUser = async (email: string, userData: {}) => {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}users/${email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};