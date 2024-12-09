document.getElementById("reset-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }
    const url = window.location.href;
    const uuid = url.split("/").pop();
    try {
        const response = await axios.post(`/user/updatePassword/${uuid}`, { password });
        if (response.status === 200) {
            alert("Password successfully reset!");
            window.location.href = "/auth/logIn.html";
        } else {
            throw new Error(response.data.error || "Failed to reset password.");
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        alert("An error occurred. Please try again.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/expenses/expenseTrack.html';
    }
});