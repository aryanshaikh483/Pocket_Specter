const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const post = (path, body) => fetch(`${BASE}/api${path}`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(r=>r.json());

export const sendMessage    = (user_id, chat_session, message) => post("/chat", { user_id, chat_session, message });
export const newChat        = (user_id) => post("/new_chat", { user_id });
export const loadChat       = (user_id, chat_session) => post("/load_chat", { user_id, chat_session });
export const deleteChat     = (user_id, chat_session) => post("/delete_chat", { user_id, chat_session });
export const getUserChats   = (user_id) => fetch(`${BASE}/api/user_chats/${user_id}`).then(r=>r.json());

export const uploadDocument = (user_id, chat_session, file) => {
  const form = new FormData();
  form.append("user_id", user_id); form.append("chat_session", chat_session); form.append("file", file);
  return fetch(`${BASE}/api/documents/upload`, { method:"POST", body:form }).then(r=>r.json());
};
export const queryDocument  = (user_id, chat_session, question) => post("/documents/query", { user_id, chat_session, question });
export const listDocuments  = (user_id, chat_session) => fetch(`${BASE}/api/documents/list?user_id=${user_id}&chat_session=${chat_session}`).then(r=>r.json());
export const deleteDocuments= (user_id, chat_session) => fetch(`${BASE}/api/documents`, { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ user_id, chat_session }) }).then(r=>r.json());
