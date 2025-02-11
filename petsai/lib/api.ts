export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export interface Pet {
  pet_id: number; // Changed from "id" to "pet_id"
  pet_name: string;
  type: string;
}

export interface GenerateImageResponse {
  message: string;
  url: string;
}

// login user, store cookies
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

// Fetch the current user's profile
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

// Fetch existing images for a pet
export async function fetchExistingImages(pet_id: number) {
  const response = await fetch(`http://localhost:8000/pets/${pet_id}/images`, {
    method: "GET",
    credentials: "include", 
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "Error fetching images");
  }

  const data = await response.json();
  return data.images as Array<{
    image_id: number;
    prompt: string | null;
    url: string;
  }>;
} 

// This gets all the pets associated with a user
export async function getPets(): Promise<Pet[]> {
  const res = await fetch("http://localhost:8000/pets", {
    method: "GET",
    credentials: "include"
  }); // Adjust the URL as needed
  if (!res.ok) {
    throw new Error("Failed to fetch pets");
  }
  return res.json();
}

// Generate an image for a pet using the dynamic endpoint.
// Note: We use pet_id consistently here.
export async function generateImage(
  pet_id: number,
  modelId: number,
  prompt: string
): Promise<GenerateImageResponse> {
  const formData = new FormData();
  // Use the parameter pet_id (not petId)
  formData.append("pet_id", pet_id.toString());
  formData.append("model_id", modelId.toString());
  formData.append("prompt", prompt);

  const res = await fetch("http://localhost:8000/generate-image", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Image generation failed");
  }
  return res.json();
}

// Optionally, you can also include logoutUser if needed.
// export async function logoutUser() {
//   await fetch("http://localhost:8000/logout", {
//     method: "POST",
//     credentials: "include",
//   });
//   window.location.href = "/login";
// }
