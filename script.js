const ADVICE_URL = "https://api.adviceslip.com/advice";

const idEl = document.getElementById("advice-id");
const textEl = document.getElementById("advice-text");
const btn = document.getElementById("dice-btn");
const card = document.querySelector(".card");

// --- Fetching: returns the slip, throws on any failure ---
async function fetchAdvice() {
  // The API caches for ~2s; a changing query param avoids stale repeats
  const res = await fetch(`${ADVICE_URL}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`Status ${res.status}`); // fetch doesn't throw on 404/500
  const data = await res.json();
  if (!data.slip) throw new Error("Unexpected response shape"); // data is nested under `slip`
  return data.slip;
}

// --- Rendering: textContent only, never innerHTML ---
function render(slip) {
  idEl.textContent = slip.id;
  textEl.textContent = `\u201C${slip.advice}\u201D`;
}

function renderError() {
  idEl.textContent = "\u2014";
  textEl.textContent = "Couldn't fetch advice right now. Please try again.";
}

// --- Orchestration: loading -> success / error -> always re-enable ---
async function getAdvice() {
  btn.disabled = true;
  btn.classList.add("is-loading");
  card.setAttribute("aria-busy", "true");

  try {
    render(await fetchAdvice());
  } catch (err) {
    console.error("Could not fetch advice:", err);
    renderError();
  } finally {
    btn.disabled = false;
    btn.classList.remove("is-loading");
    card.setAttribute("aria-busy", "false");
  }
}

btn.addEventListener("click", getAdvice);
getAdvice(); // never leave the card empty on first load
