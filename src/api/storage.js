const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${WORKER_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return await res.json(); // { key, url }
}

export async function deleteImage(key) {
  const res = await fetch(`${WORKER_URL}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (!res.ok) throw new Error("Delete failed");
  return await res.json();
}
