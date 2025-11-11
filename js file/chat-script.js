const SUPABASE_URL = "https://bzdrxawzzvypxaxehvic.supabase.co";
const SUPABASE_KEY = "your-anon-public-key";

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
  img.src = "/IMAGE FILE/male image.png";
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

function displayMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  const avatar = document.createElement("span");
  avatar.classList.add("avatar");
  avatar.textContent = "🧑";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = message.user_name || "User" + ":";
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
  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) console.error("Error loading messages:", error);
  else data.forEach(displayMessage);
}

loadMessages();

sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (text !== "") {
    const { data, error } = await supabaseClient
      .from("messages")
      .insert([{
        user_id: "dummy-user-id",
        room_id: "dummy-room-id",
        content: text,
        user_name: currentUser
      }]);

    if (error) console.error("Error sending message:", error);
    else displayMessage(data[0]);

    input.value = "";
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});
