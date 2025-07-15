const apiURL =
  "https://6874d13cdd06792b9c955d04.mockapi.io/api/auth/message-template";
const messageTemplateContainer =
  document.getElementsByClassName("main-content")[0];
let messageTemplates = [];
const templateFiller = (data) => {
  const template = document.createElement("div");
  template.innerHTML = `
<div class="card" data-id="${data.id}">
  <div class="hero-image">
    <img src="${data.AssetUrl}" alt="" loading="lazy" />
  </div>
  <div class="card-body">
    <h5>${data.Name}</h5>
    <div class="line">
      <label class="card-label">Type:</label>
      <span class="chip">${data.Type}</span>
    </div>
    <div class="line">
      <label class="card-label">Tags:</label>
      <span class="chip">${data.Tag}</span>
    </div>
    <div class="line">
      <label class="card-label">Workspace:</label>
      <span class="chip">${data.Workspace}</span>
    </div>
    <div class="card-description">
      <p>${data.Content}</p>
    </div>
    <div class="card-actions">
      <a href="#" class="edit button" data-id="${data.id}">Edit</a>
      <a href="#" class="delete button" data-id="${data.id}">Delete</a>
    </div>
  </div>
</div>
`;
  return template.firstElementChild;
};
const getAllMessageTemplates = async () => {
  console.log("Message Template page loaded");
  messageTemplateContainer.innerHTML = "Loading...";
  let message = "";
  try {
    await fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        messageTemplates = data;
      })
      .catch((err) => console.log(`Error in api call: ${err}`));
  } catch (error) {
    message = "Error fetching message template. Please try again later.";
    console.log("GetAll message template failed: ", e);
  } finally {
    messageTemplateContainer.innerHTML = message;
  }
  if (messageTemplates.length === 0) {
    messageTemplateContainer.innerHTML = "No contacts available.";
    return;
  } else {
    messageTemplates.forEach((messageTemplate) => {
      messageTemplateContainer.appendChild(templateFiller(messageTemplate));
    });
  }
};
const deleteMessageTemplateById = async (id) => {
  try {
    await fetch(apiURL + `/${id}`, { method: "DELETE" })
      .then((res) => console.log(res))
      .catch((err) => console.log(`error in api call: ${err}`));
    messageTemplates = messageTemplates.filter(
      (messageTemplate) => messageTemplate.id != id,
    );
    if (messageTemplates.length === 0) {
      messageTemplateContainer.innerHTML = "No Message Templates available";
      return;
    } else {
      messageTemplateContainer.innerHTML = "";
      messageTemplates.forEach((messageTemplate) => {
        messageTemplateContainer.appendChild(templateFiller(messageTemplate));
      });
    }
  } catch (error) {
    console.log(`Error while calling api: ${error}`);
  }
};
messageTemplateContainer.addEventListener("click", async (event) => {
  event.preventDefault();
  const clickRegistered = event.target.closest(".edit.button")
    ? "Edit"
    : event.target.closest(".delete.button")
      ? "Delete"
      : null;
  if (clickRegistered === "Edit") {
    const editButton = event.target.closest(".edit.button");
    const id = editButton.dataset.id;
    console.log(`Edit button id: ${id}`);
  } else if (clickRegistered === "Delete") {
    const deleteButton = event.target.closest(".delete.button");
    const id = deleteButton.dataset.id;
    console.log(`Delete button id: ${id}`);
    if (confirm(`Are you sure you want to delete this contact?`)) {
      await deleteMessageTemplateById(id);
    }
  }
});
getAllMessageTemplates();
