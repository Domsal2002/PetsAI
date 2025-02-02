export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

//login user, store cookies
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

// Fetch the current user's profile, verify endpoint used
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

// Fetch existing images from the sample model
export async function fetchExistingImages() {
  const response = await fetch("http://localhost:8000/sample-generated-images", {
    method: "GET",
    credentials: "include", // ✅ Cookies are sent automatically
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "Error fetching images");
  }

  return response.json();
}

// Generate images with the sample model
export async function generateImage(prompt: string) {
  const response = await fetch("http://localhost:8000/sample-generator", {
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

// this gets all the pets associated with a user
export async function getpets() {
  const response = await fetch("http://localhost:8000/pets", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "Error fetching pets");
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
