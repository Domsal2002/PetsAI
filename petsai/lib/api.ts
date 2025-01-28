// lib/api.ts
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  // add other fields if you have them
}

// login endpoint
export async function loginUser(email: string, password: string) {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Login failed");
    }
    return response.json();
  }

  //auth endpoint
  export async function fetchCurrentUser(token: string): Promise<UserProfile | null> {
    try {
      const response = await fetch("http://localhost:8000/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        // For 401 or 404, we return null so the caller can handle redirect or fallback
        return null;
      }
  
      const data = await response.json();
      return data; // { id, username, email, ... }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

//image generation endpoints 
  export async function fetchExistingImages(jwt: string) {
    const response = await fetch("http://127.0.0.1:8000/sample-images", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Error fetching images");
    }
    return response.json();
  }
  
  export async function generateImage(jwt: string, prompt: string) {
    const response = await fetch("http://127.0.0.1:8000/generate-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Error generating image");
    }
    return response.json();
  }