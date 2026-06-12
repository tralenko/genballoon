const supabaseUrl = "ТВОЙ_URL";
const supabaseKey = "ТВОЙ_ANON_KEY";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

document.querySelectorAll(".add-to-cart").forEach(btn => {

  btn.addEventListener("click", async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in");
      return;
    }

    const productId = btn.dataset.productId;

    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity: 1
      });

    if (error) {
      console.error(error);
      alert("Error adding to cart");
      return;
    }

    alert("Added to cart");
  });

});
