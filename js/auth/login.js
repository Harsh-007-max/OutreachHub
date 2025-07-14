const loginForm = document.getElementById("login-form");
const authAPI = "https://6874d57add06792b9c95705b.mockapi.io/api/v1/login";

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("Login form submitted");
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());
  console.log("Form data:", data);
  try {
    const response = await fetch(authAPI).then((res) => res.json());
    console.log("Response from API:", response);
    const user = response.find(
      (user) =>
        user.username === data.username && user.password === data.password,
    );
    if (user) {
      localStorage.setItem("OutreachHub-user", JSON.stringify(user));
      window.location.href = "../pages/home.html";
    } else {
      alert("Invalid username or password");
    }
  } catch (e) {
    console.log("Error in login form submission:", e);
  }
});
const checkLocalStorage = () => {
  let user = localStorage.getItem("OutreachHub-user");
  user = JSON.parse(user);
  if (user) {
    window.location.href = "../pages/home.html";
  }
};
checkLocalStorage();
