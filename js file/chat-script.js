const SUPABASE_URL = "https://bzdrxawzzvypxaxehvic.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZHJ4YXd6enZ5cHhheGVodmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDk5MjgsImV4cCI6MjA3ODQyNTkyOH0.2hRpcTpui-DGi-4O3rMmJUX7OkGh2QWP8nKbTya94Tw";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const chatArea = document.querySelector(".chat-area");
const input = document.querySelector(".chat-input input");
const sendBtn = document.querySelector(".send-btn");
const messagesWrapper = document.querySelector('.messages-wrapper') || chatArea;

const logoutElement = document.getElementById('logoutBtn') || document.querySelector('.logout-icon');
const currentUser = sessionStorage.getItem("loggedInUser") || "Guest";

const userList = document.querySelector(".user-list ul");
userList.innerHTML = "";
const otherUsers = ["Arinze", "Ekaite"];
const users = [currentUser, ...otherUsers];
users.forEach(user => {
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.src = "/IMAGE FILE/male image.png"; // If missing, this will just not show an image
  li.appendChild(img);
  li.appendChild(document.createTextNode(user));
  if (user === currentUser) {
    li.style.fontWeight = "bold";
    li.style.background = "rgba(255,255,255,0.2)";
  }
  userList.appendChild(li);
});

if (logoutElement) {
  logoutElement.onclick = function() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "LOGIN.HTML";
  };
}

// Fetch users and build a user_id -> name map
async function fetchUsersMap() {
  const { data, error } = await supabaseClient
    .from("users")
    .select("id, name");
  if (error) {
    console.error("Error loading users:", error);
    return {};
  }
  const map = {};
  if (data) {
    data.forEach(user => {
      map[user.id] = user.name;
    });
  }
  return map;
}

// Display messages using userMap for names
function displayMessage(message, userMap = {}) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  const avatar = document.createElement("span");
  avatar.classList.add("avatar");
  avatar.textContent = "🧑";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = (userMap[message.user_id] || "User") + ":";
  p.appendChild(strong);
  p.appendChild(document.createTextNode(" " + message.content));

  const small = document.createElement("small");
  small.textContent = new Date(message.created_at).toLocaleTimeString();

  bubble.appendChild(p);
  bubble.appendChild(small);
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(bubble);
  messagesWrapper.appendChild(messageDiv);

  messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
}

async function loadMessages() {
  const usersMap = await fetchUsersMap();
  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) console.error("Error loading messages:", error);
  else if (data) data.forEach(msg => displayMessage(msg, usersMap));
}

loadMessages();

sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (text !== "") {
    // Replace these with REAL user and room IDs from your Supabase database
    const userId = "42a4d005-c820-4c49-9228-5c22f9e29f6e"; // Example real user ID
    const roomId = "b74fb217-9515-474b-bee8-110f80563884"; // Example real room ID
    const { data, error } = await supabaseClient
      .from("messages")
      .insert([
        {
          user_id: userId,
          room_id: roomId,
          content: text
        }
      ]);
    if (error) {
      console.error("Error sending message:", error);
    } else if (data && data.length > 0) {
      const usersMap = await fetchUsersMap();
      displayMessage(data[0], usersMap);
    }
    input.value = "";
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});
