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