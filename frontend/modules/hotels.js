export function createHotelCard(hotel) {
  const card = document.createElement("div");
  card.className = "hotel-card";
  card.onclick = () =>
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(hotel.name)}`,
      "_blank"
    );

  card.innerHTML = `
    <img src="${
      hotel.image ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"
    }" class="hotel-image" alt="${hotel.name}">
    <div class="hotel-info">
      <div class="hotel-name">${hotel.name}</div>
      <div class="hotel-price">${hotel.price}</div>
      <div class="hotel-rating">${"⭐".repeat(
        Math.round(hotel.rating || 5)
      )}</div>
    </div>
  `;
  return card;
}

export function createHotelGrid(hotels) {
  const grid = document.createElement("div");
  grid.className = "hotel-grid";
  hotels.forEach((hotel) => {
    grid.appendChild(createHotelCard(hotel));
  });
  return grid;
}
