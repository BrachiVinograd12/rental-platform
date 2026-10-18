
const API_URL = "http://localhost:3000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `שגיאה: ${response.status}`
    );
  }

  return data;
}

export async function getTenants() {
  const data = await request("/tenants");
  return Array.isArray(data) ? data : data.tenants ?? [];
}

export async function createTenant(tenant) {
  return request("/tenants", {
    method: "POST",
    body: JSON.stringify(tenant),
  });
}

export async function updateTenant(id, changes) {
  return request(`/tenants/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export async function getProducts(tenantId) {
  const data = await request(
    `/products/tenant/${encodeURIComponent(tenantId)}`
  );

  return Array.isArray(data) ? data : data.products ?? [];
}

export async function createProduct(product) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, changes) {
  return request(`/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export async function deleteProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
