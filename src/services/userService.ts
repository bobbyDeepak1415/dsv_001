const BASE_URL = "http://localhost:3000/users";

export const getUsers = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const createUser = async (user) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
};
