const screens = [...document.querySelectorAll("[data-screen]")];
const modal = document.querySelector("#prediction-modal");
const menu = document.querySelector("#mobile-menu");

function showScreen(name) {
  screens.forEach((screen) => {
    screen.hidden = screen.dataset.screen !== name;
  });
  if (menu) menu.hidden = true;
  window.scrollTo({ top: 0, behavior: "auto" });
}

document.addEventListener("click", (event) => {
  const navigation = event.target.closest("[data-go]");
  if (navigation) {
    showScreen(navigation.dataset.go);
    return;
  }

  if (event.target.closest("[data-open-modal]")) {
    modal.hidden = false;
  }
});

document.querySelectorAll("[data-submit-go]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showScreen(form.dataset.submitGo);
  });
});

document.querySelector("#menu-button")?.addEventListener("click", () => {
  menu.hidden = !menu.hidden;
});

document.querySelector("#modal-close")?.addEventListener("click", () => {
  modal.hidden = true;
});

document.querySelector("#analyze-button")?.addEventListener("click", (event) => {
  event.currentTarget.textContent = "Analyzing…";
  window.setTimeout(() => {
    modal.hidden = true;
    event.currentTarget.textContent = "Start Free Analyze";
    showScreen("details");
  }, 850);
});

document.querySelectorAll("[data-plan]").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll("[data-plan]").forEach((item) => {
      item.classList.toggle("is-selected", item === card);
      const timeIcon = item.querySelector("small img");
      if (timeIcon) {
        timeIcon.src =
          item === card
            ? "./public/assets/time-active.svg"
            : "./public/assets/time-muted.svg";
      }
    });
    const price = card.dataset.price;
    document.querySelector("#checkout-button").textContent =
      price === "Free" ? "Continue free" : `Pay now (${price})`;
  });
});

window.setTimeout(() => showScreen("auth"), 1500);
