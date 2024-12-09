const downloadButton = document.getElementById("download-btn");
const downloadTable = document.getElementById("download-table");
const downloadHistoryButton = document.getElementById("downloadHistory-btn");

downloadButton.onclick = async (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth/logIn.html';
    }
    try {
        const response = await axios.get('/premium/download', {
            headers: { 'Authorization': token }
        });
        if (response.status === 200) {
            console.log(response);
            const a = document.createElement('a');
            a.href = response.data.fileURL;
            a.download = 'myExpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error downloading expenses:", error);
    }
};

const downloadHistoryDiv = document.createElement("div");
downloadHistoryDiv.classList.add("mt-8", "max-w-4xl", "mx-auto");

const renderDownloadHistory = (downloadHistory) => {
    downloadHistoryDiv.innerHTML = `
        <h2 class="text-4xl font-bold text-emerald-600 mb-8 text-center">Download History</h2>
        <table class="min-w-full border-collapse border border-emerald-300">
            <thead>
                <tr class="bg-emerald-200">
                    <th class="border border-emerald-300 px-4 py-2 text-left text-sm font-semibold text-emerald-700">R.No.</th>
                    <th class="border border-emerald-300 px-4 py-2 text-left text-sm font-semibold text-emerald-700">Created At</th>
                    <th class="border border-emerald-300 px-4 py-2 text-left text-sm font-semibold text-emerald-700">File URL</th>
                </tr>
            </thead>
            <tbody>
                ${downloadHistory.map((entry, index) => `
                    <tr class="hover:bg-emerald-50">
                        <td class="border border-emerald-300 px-4 py-2 text-sm text-emerald-600">${index + 1}</td>
                        <td class="border border-emerald-300 px-4 py-2 text-sm text-emerald-600">${entry.createdAt}</td>
                        <td class="border border-emerald-300 px-4 py-2 text-sm text-emerald-600"><a href="${entry.fileURL}" target="_blank">Download</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table> `;
    downloadTable.appendChild(downloadHistoryDiv);
};

downloadHistoryButton.onclick = async (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth/logIn.html';
    }
    try {
        const response = await axios.get('/premium/downloadHistory', {
            headers: { 'Authorization': token },
        });
        if (response.data.success) {
            renderDownloadHistory(response.data.downloadHistory);
            console.log(response.data)
        } else {
            alert("Failed to fetch download history.");
        }
    } catch (error) {
        console.error("Error fetching download history:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth/logIn.html';
    }
});