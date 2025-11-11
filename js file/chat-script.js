// Logout logic
const chatArea = document.querySelector(".chat-area");
const input = document.querySelector(".chat-input input");
const sendBtn = document.querySelector(".send-btn");

if (!chatArea || !input || !sendBtn) {
  console.warn("chat-script: required elements missing", { chatArea, input, sendBtn });
} else {
  // pick messages wrapper if present
  const messagesWrapper = document.querySelector('.messages-wrapper') || chatArea;

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();

    if (text !== "") {
      // Create message elements
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");

      const avatar = document.createElement("span");
      avatar.classList.add("avatar");
      avatar.textContent = "🧑"; // your default user emoji

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

      // Scroll to latest message
      if (messagesWrapper.scrollHeight) {
        messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
      }
    }
  });

  // Optional: allow pressing "Enter" to send
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });
}

// Select the logout element
const logoutElement = document.getElementById('logoutBtn') || document.querySelector('.logout-icon');

if (logoutElement) {
  logoutElement.onclick = function() {
    // Clear the stored username when logging out
    sessionStorage.removeItem("loggedInUser");
    // Redirect back to login page
    window.location.href = "LOGIN.HTML";
  };
}

// Get the logged-in username from sessionStorage
const currentUser = sessionStorage.getItem("loggedInUser") || "Guest";

// Select the user list <ul>
const userList = document.querySelector(".user-list ul");

// Clear any existing list items (good practice)
userList.innerHTML = "";

// Simulate other users (optional)
const otherUsers = ["Arinze", "Ekaite"];

// Combine current user + other users
const users = [currentUser, ...otherUsers];

users.forEach(user => {
  const li = document.createElement("li");

  // Avatar placeholder
  const img = document.createElement("img");
  img.src = "/IMAGE FILE/male image.png"; // you can customize for each user
  li.appendChild(img);

  // Add username text
  li.appendChild(document.createTextNode(user));

  // Highlight current user
  if (user === currentUser) {
    li.style.fontWeight = "bold";
    li.style.background = "rgba(255,255,255,0.2)";
  }

  userList.appendChild(li);
});


const SUPABASE_URL = "https://bzdrxawzzvypxaxehvic.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZHJ4YXd6enZ5cHhheGVodmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDk5MjgsImV4cCI6MjA3ODQyNTkyOH0.2hRpcTpui-DGi-4O3rMmJUX7OkGh2QWP8nKbTya94Tw";


const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
