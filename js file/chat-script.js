const SUPABASE_URL = "https://bzdrxawzzvypxaxehvic.supabase.co";
const SUPABASE_KEY = "your-anon-public-key";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const chatArea = document.querySelector(".chat-area");
const input = document.querySelector(".chat-input input");
const sendBtn = document.querySelector(".send-btn");

if (!chatArea || !input || !sendBtn) {
  console.warn("chat-script: required elements missing", { chatArea, input, sendBtn });
} else {
  const messagesWrapper = document.querySelector('.messages-wrapper') || chatArea;

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();

    if (text !== "") {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");

      const avatar = document.createElement("span");
      avatar.classList.add("avatar");
      avatar.textContent = "🧑";

      const bubble = document.createElement("div");
      bubble.classList.add("bubble");

      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = "You:";
      p.appendChild(strong);
      p.appendChild(document.createTextNode(" " + text));

      const small = document.createElement("small");
      small.textContent = "now";

      bubble.appendChild(p);
      bubble.appendChild(small);

      messageDiv.appendChild(avatar);
      messageDiv.appendChild(bubble);

      messagesWrapper.appendChild(messageDiv);

      input.value = "";

      if (messagesWrapper.scrollHeight) {
        messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
      }
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });
}

const logoutElement = document.getElementById('logoutBtn') || document.querySelector('.logout-icon');

if (logoutElement) {
  logoutElement.onclick = function() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "LOGIN.HTML";
  };
}

const currentUser = sessionStorage.getItem("loggedInUser") || "Guest";

const userList = document.querySelector(".user-list ul");
userList.innerHTML = "";

const otherUsers = ["Arinze", "Ekaite"];
const users = [currentUser, ...otherUsers];

users.forEach(user => {
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.src = "/IMAGE FILE/male image.png";
  li.appendChild(img);
  li.appendChild(document.createTextNode(user));

  if (user === currentUser) {
    li.style.fontWeight = "bold";
    li.style.background = "rgba(255,255,255,0.2)";
  }

  userList.appendChild(li);
});
