const form = document.getElementById("forgot-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    try {
        const response = await axios.post("/user/forgotPassword", { email });
        if (response.data.success) {
            alert("Reset email sent successfully!");
            form.reset();
        } else {
            alert("Failed to send reset email.");
        }
    } catch (error) {
        console.error("Error sending reset email:", error);
        alert("An error occurred while sending the reset email.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/expenses/expenseTrack.html';
    }
});