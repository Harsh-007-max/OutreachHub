const apiURL = "https://6874f40add06792b9c9604b4.mockapi.io/mock/Campaign";
const campaignContainer = document.getElementsByClassName("main-content")[0];

const templateFillerMulti = (data) => {
  const template = document.createElement("div");
  template.innerHTML = `
        <div class="card" data-id="${data.id}">
          <div class="hero-image">
            <img src="${data.CampaignBanner}" alt="" loading="lazy" >
          </div>
          <div class="card-body">
            <h5>${data.CampaignTitle}</h5>
            <div class="line">
              <label class="card-label">Status:</label>
              <span class="chip">${data.CampaignStatus}</span>
            </div>
            <div class="line">
              <label class="card-label">Duration:</label>
              <span class="chip">${dateFormatter(data.CampaignStartDate)} - ${dateFormatter(data.CampaignEndDate)}</span>
            </div>
            <div class="card-description">
              <p>
                ${data.CampaignDescription}
              </p>
            </div>
            <div class="card-actions">
              <a href="#" class="edit button" data-id="${data.id}" >Edit</a>
              <a href="#" class="delete button" data-id="${data.id}" >Delete</a>
            </div>
          </div>
        </div>
`;
  return template.firstElementChild;
};
const dateFormatter = (date) => {
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
const getAllCampaigns = async () => {
  console.log("Campaign module loaded");
  let campaigns = [];
  campaignContainer.innerHTML = "Loading...";
  let message = "";
  try {
    await fetch(apiURL)
      .then((res) => res.json())
      .then((data) => (campaigns = data));
  } catch (e) {
    message = "Error fetching campaigns. Please try again later.";
    console.log("Error fetching campaigns:", e);
  } finally {
    campaignContainer.innerHTML = message;
  }
  if (campaigns.length === 0) {
    campaignContainer.innerHTML = "No campaigns available.";
    return;
  } else {
    // do multiple small operations in dom
    campaigns.forEach((campaign) => {
      campaignContainer.appendChild(templateFillerMulti(campaign));
    });
  }
};
campaignContainer.addEventListener("click", (e) => {
  e.preventDefault();
  const editButton = e.target.closest(".edit.button")
    ? "Edit"
    : e.target.closest(".delete.button")
      ? "Delete"
      : null;
  if (editButton === "Edit") {
    const editButton = e.target.closest(".edit.button");
    const id = editButton.dataset.id;
    console.log(`Edit button id: ${id}`);
  } else if (editButton === "Delete") {
    const deleteButton = e.target.closest(".delete.button");
    const id = deleteButton.dataset.id;
    console.log(`Delete button id: ${id}`);
  }
});
getAllCampaigns();
