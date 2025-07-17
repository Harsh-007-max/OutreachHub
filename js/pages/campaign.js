const apiURL = "https://6874f40add06792b9c9604b4.mockapi.io/mock/Campaign";
const campaignContainer = document.getElementsByClassName("main-content")[0];
const campaignForm = document.getElementById("campaign-form");
const campaignFormDiv = document.getElementById("campaign-form-div");
let campaigns = [];
let cardToEdit = "";
let isAdd = true;
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
              <span class="chip">${dateFormatter(data.CampaignStartDate)} - ${dateFormatter(
    data.CampaignEndDate,
  )}</span>
            </div>
            <div class="line">
              <label class="card-label">Tags:</label>
              <span class="chip">${data.CampaignTags}</span>
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
const editTemplateFiller = (data) => {
  return `
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
              <span class="chip">${dateFormatter(data.CampaignStartDate)} - ${dateFormatter(
    data.CampaignEndDate,
  )}</span>
            </div>
            <div class="line">
              <label class="card-label">Tags:</label>
              <span class="chip">${data.CampaignTags}</span>
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
`;
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
const getCampaignById = async (id) => {
  let campaign = "";
  try {
    await fetch(apiURL + `/${id}`)
      .then((res) => res.json())
      .then((data) => {
        campaign = data;
      });
  } catch (error) {
    console.log(`Error while calling api:${error}`);
  } finally {
    if (campaign === "") {
      console.log("No campaign found with the given ID.");
      return { error: "No campaign found" };
    } else {
      return campaign;
    }
  }
};
const deleteCampaignById = async (id) => {
  try {
    await fetch(apiURL + `/${id}`, { method: "DELETE" })
      .then((res) => console.log(res))
      .catch((err) => console.log("error in api call: ", err));
    campaigns = campaigns.filter((campaign) => {
      if (campaign.id) console.log(campaign);
      return campaign.id != id;
    });
    if (campaigns.length === 0) {
      campaignContainer.innerHTML = "No campaigns available.";
      return;
    } else {
      campaignContainer.innerHTML = "";
      campaigns.forEach((campaign) => {
        campaignContainer.appendChild(templateFillerMulti(campaign));
      });
    }
  } catch (error) {
    console.log("Error while calling api:", error);
  }
};
campaignContainer.addEventListener("click", async (e) => {
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
    cardToEdit = e.target.closest("div .card");
    isAdd = false;
    editCampaignById(id);
  } else if (editButton === "Delete") {
    const deleteButton = e.target.closest(".delete.button");
    const id = deleteButton.dataset.id;
    console.log(`Delete button id: ${id}`);

    if (confirm("Are you sure you want to delete this campaign? ")) {
      await deleteCampaignById(id);
    }
  }
});
campaignForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(campaignForm);
  const data = Object.fromEntries(formData.entries());
  console.log(`campaign form data:`, data);
  try {
    //edit
    if (!isAdd) {
      await fetch(`${apiURL}/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(() => {
          console.log(
            "Campaign updated successfully",
            editTemplateFiller(data),
          );
          cardToEdit.innerHTML = editTemplateFiller(data);
        })
        .then(() => {
          toggleForm();
          campaignForm.reset();
        })
        .catch((err) =>
          console.log(`Campaing not updated error in API: ${err}`),
        );
    } else {
      await fetch(`${apiURL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(() => {
        console.log("Campaign added successfully");
        window.location.href = "./campaign.html";
      });
    }
  } catch (err) {
    console.log(`Error in campaign form submission: ${err}`);
  }
  // window.location.href = "./campaigns.html";
});
const toggleForm = () => {
  campaignFormDiv.classList.toggle("display-none");
  document.body.classList.toggle("no-scroll");
};
const fillForm = async (id) => {
  const campaign = await getCampaignById(id);
  campaignForm.id.value = campaign.id;
  campaignForm.img.src = campaign.CampaignBanner;
  campaignForm.CampaignBanner.value = campaign.CampaignBanner;
  campaignForm.CampaignTitle.value = campaign.CampaignTitle;
  campaignForm.CampaignStatus.value = campaign.CampaignStatus;
  campaignForm.CampaignStartDate.value = campaign.CampaignStartDate;
  campaignForm.CampaignEndDate.value = campaign.CampaignEndDate;
  campaignForm.CampaignTags.value = campaign.CampaignTags;
  campaignForm.CampaignDescription.value = campaign.CampaignDescription;
};
const addBtn = () => {
  toggleForm();
  document.getElementById("form-img").style.display = "none";
  campaignForm.getElementsByClassName("title")[0].innerText = "Add Form";
  isAdd = true;
};
const closeBtn = () => {
  campaignForm.reset();
  toggleForm();
};
const editCampaignById = async (id) => {
  campaignForm.getElementsByClassName("title")[0].innerText = "Edit Form";
  toggleForm();
  campaignForm.reset();
  fillForm(id);
};
CampaignBanner.addEventListener("input", (e) => {
  document.getElementById("form-img").style.display = "block";
  if (e.data !== "") {
    document.getElementById("form-img").setAttribute("src", e.data);
  }
});
getAllCampaigns();
