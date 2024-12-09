document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/expenses/expenseTrack.html';
    }
    const form = document.querySelector("#login-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await axios.post("http://localhost:5000/user/logIn", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                alert("User login successful!");
                localStorage.setItem('token', response.data.user.token);
                window.location.href = '/expenses/expenseTrack.html';
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert("Incorrect password. Please try again.");
                } else if (error.response.status === 404) {
                    alert("User not found. Please sign up.");
                } else {
                    alert("An error occurred. Please try again later.");
                }
            } else {
                console.error("Login error:", error);
                alert("An error occurred. Please try again.");
            }
        }
    });
});