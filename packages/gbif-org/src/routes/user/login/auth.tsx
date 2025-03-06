interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  country: string;
  password: string;
}

export async function login(data: LoginData) {
  try {
    const response = await fetch('/auth/basic/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
}

export async function register(data: RegisterData) {
  try {
    const response = await fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }
}

export async function whoAmI() {
  try {
    const response = await fetch('/api/user/who-am-i', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('UNKNOWN_USER');
    }

    return await response.json();
  } catch (error) {
    throw new Error('UNKNOWN_USER');
  }
}

export async function logout() {
  try {
    const response = await fetch('/api/user/logout', {
      method: 'GET',
    });
    return { success: response.ok };
  } catch (error) {
    throw new Error('UNALBE_TO_LOGOUT');
  }
}
