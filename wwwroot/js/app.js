const urlInput = document.getElementById("urlInput");
const checkBtn = document.getElementById("checkBtn");
const resultBox = document.getElementById("result");

function normalizeUrl(url) {
    const s = (url || "").trim();
    if (!s) return "";
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    return "https://" + s;
}

function statusMeaning(code) {
    if (code === 200) return "OK – Всичко работи";
    if (code === 301 || code === 302) return "Redirect – Пренасочване";
    if (code === 403) return "Forbidden – Забранен достъп";
    if (code === 404) return "Not Found – Страницата липсва";
    if (code === 408) return "Request Timeout – Изтече време за отговор";
    if (code >= 500) return "Server Error – Сървърна грешка";
    return "HTTP статус: " + code;
}

function setResult(text, ok) {
    resultBox.textContent = text;
    resultBox.className = ok ? "ok" : "bad";
}

async function checkSite() {
    const url = normalizeUrl(urlInput.value);

    if (!url) {
        setResult("Моля, въведи адрес на сайт.", false);
        return;
    }

    setResult("Проверявам...", true);

    try {
        const response = await fetch("/check?url=" + encodeURIComponent(url));
        const data = await response.json();

        if (data.error) {
            setResult("Сайтът не отговаря – " + data.error, false);
            return;
        }

        const code = data.status;
        const ok = data.ok;

        const message =
            (ok ? "Сайтът работи" : "Сайтът отговаря, но има проблем") +
            " – HTTP статус: " + code +
            " (" + statusMeaning(code) + ")";

        setResult(message, ok);
    } catch {
        setResult("Сайтът не отговаря – грешка при заявката.", false);
    }
}

checkBtn.addEventListener("click", checkSite);
urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkSite();
});
