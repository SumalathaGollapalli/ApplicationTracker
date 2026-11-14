let applications =
    JSON.parse(localStorage.getItem("applications")) || [];

const form = document.getElementById("applicationForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const app = {
        category: category.value,
        company: company.value,
        location: location.value,
        jobTitle: jobTitle.value,
        jobLink: jobLink.value,
        dateApplied: dateApplied.value,
        statusDate: statusDate.value,
        status: status.value
    };

    const editIndex =
        document.getElementById("editIndex").value;

    if (editIndex === "") {
        applications.push(app);
    } else {
        applications[editIndex] = app;
    }

    saveData();
    form.reset();

    document.getElementById("editIndex").value = "";

    renderTable();
});

function saveData() {
    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}

function renderTable() {

    const search =
        document.getElementById("searchInput").value
        .toLowerCase();

    const filter =
        document.getElementById("filterStatus").value;

    const table =
        document.getElementById("applicationsTable");

    table.innerHTML = "";

    applications.forEach((app, index) => {

        const matchesSearch =
            app.company.toLowerCase().includes(search) ||
            app.jobTitle.toLowerCase().includes(search) ||
            app.location.toLowerCase().includes(search);

        const matchesFilter =
            filter === "All" ||
            app.status === filter;

        if (!matchesSearch || !matchesFilter)
            return;

        let badgeClass = "applied-tag";

        switch (app.status) {
            case "Interview":
                badgeClass = "interview-tag";
                break;
            case "Rejected":
                badgeClass = "rejected-tag";
                break;
            case "Offer":
                badgeClass = "offer-tag";
                break;
            case "Online Assessment":
                badgeClass = "assessment-tag";
                break;
            case "Ghosted":
                badgeClass = "ghosted-tag";
                break;
        }

        table.innerHTML += `
        <tr>
            <td>${app.category}</td>
            <td>${app.company}</td>
            <td>${app.location}</td>
            <td>${app.jobTitle}</td>

            <td>
                <a href="${app.jobLink}"
                   target="_blank">
                   Open
                </a>
            </td>

            <td>${app.dateApplied}</td>

            <td>${app.statusDate}</td>

            <td>
                <span class="status ${badgeClass}">
                    ${app.status}
                </span>
            </td>

            <td>
                <button
                    class="action-btn edit"
                    onclick="editApplication(${index})">
                    Edit
                </button>

                <button
                    class="action-btn delete"
                    onclick="deleteApplication(${index})">
                    Delete
                </button>
            </td>
        </tr>`;
    });

    updateStats();
}

function editApplication(index) {

    const app = applications[index];

    category.value = app.category;
    company.value = app.company;
    location.value = app.location;
    jobTitle.value = app.jobTitle;
    jobLink.value = app.jobLink;
    dateApplied.value = app.dateApplied;
    statusDate.value = app.statusDate;
    status.value = app.status;

    document.getElementById("editIndex").value = index;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deleteApplication(index) {

    if (
        confirm(
            "Delete this application?"
        )
    ) {
        applications.splice(index, 1);

        saveData();
        renderTable();
    }
}

function updateStats() {

    document.getElementById("totalCount").textContent =
        applications.length;

    document.getElementById("appliedCount").textContent =
        applications.filter(
            a => a.status === "Applied"
        ).length;

    document.getElementById("interviewCount").textContent =
        applications.filter(
            a => a.status === "Interview"
        ).length;

    document.getElementById("rejectedCount").textContent =
        applications.filter(
            a => a.status === "Rejected"
        ).length;

    document.getElementById("offerCount").textContent =
        applications.filter(
            a => a.status === "Offer"
        ).length;
}

document.getElementById("searchInput")
.addEventListener("input", renderTable);

document.getElementById("filterStatus")
.addEventListener("change", renderTable);

renderTable();