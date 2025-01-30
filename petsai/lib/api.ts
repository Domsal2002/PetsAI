export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

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
    credentials: "include", 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }
  return response.json();
}

export async function fetchCurrentUser(): Promise<UserProfile | null> {
  try {
    const response = await fetch("http://localhost:8000/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null; 
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function fetchExistingImages() {
  const response = await fetch("http://localhost:8000/sample-images", {
    method: "GET",
    credentials: "include", // ✅ Cookies are sent automatically
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "Error fetching images");
  }

  return response.json();
}

export async function generateImage(prompt: string) {
  const response = await fetch("http://localhost:8000/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
    credentials: "include",  
  });

  console.log([...response.headers]);

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "Error generating image");
  }

  return response.json();
}


// export async function logoutUser() {
//   await fetch("http://localhost:8000/logout", {
//     method: "POST",
//     credentials: "include", // ✅ Ensure cookies are cleared
//   });
//   window.location.href = "/login"; // Redirect after logout
// }
