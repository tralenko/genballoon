document.addEventListener("DOMContentLoaded", async () => {
  const productId = new URLSearchParams(window.location.search).get("id");

  if (!productId) return;

  const { data: product, error } = await window.supabaseClient
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  document.getElementById("product-title").textContent = product.title;
  document.getElementById("product-img").src = product.image_url;
  document.getElementById("product-desc").innerHTML = `<p>${product.description}</p>`;
  document.getElementById("product-price").textContent = `$${product.price}`;
});
