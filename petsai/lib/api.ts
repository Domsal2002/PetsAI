export interface UserProfile {
  id: number;
  email: string;
}

export interface Pet {
  pet_id: number;
  pet_name: string;
  type: string;
}

export interface GenerateImageResponse {
  message: string;
  url: string;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
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
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

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

export async function getPets(): Promise<Pet[]> {
  const res = await fetch("http://localhost:8000/pets", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch pets");
  }
  return res.json();
}

export async function generateImage(
  pet_id: number,
  // modelId: number,
  prompt: string
): Promise<GenerateImageResponse> {
  const formData = new FormData();
  formData.append("pet_id", pet_id.toString());
  // formData.append("model_id", modelId.toString());
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
