const addToCart = document.querySelectorAll(".add-to-cart");

addToCart.forEach((form) => {
  form.addEventListener("submit", (e) => {
    console.log(e.target[0].value);

    fetch("/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: e.target[0].value,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        alert(result.message);
      })
      .catch((err) => console.log(err));
    e.preventDefault();
  });
});
