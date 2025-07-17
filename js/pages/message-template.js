const apiURL =
  "https://6874d13cdd06792b9c955d04.mockapi.io/api/auth/message-template";
const messageTemplateContainer =
  document.getElementsByClassName("main-content")[0];
const messageTemplateForm = document.getElementById("message-template-form");
const messageTemplateFormDiv = document.getElementById(
  "message-template-form-div",
);
let messageTemplates = [];
let cardToEdit = "";
let isAdd = true;
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
      <label class="card-label">Tag:</label>
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
const editTemplateFiller = (data) => {
  return `
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
      <label class="card-label">Tag:</label>
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
`;
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
    messageTemplateContainer.innerHTML = "No message templates available.";
    return;
  } else {
    messageTemplates.forEach((messageTemplate) => {
      messageTemplateContainer.appendChild(templateFiller(messageTemplate));
    });
  }
};
const getMessageTemplateById = async (id) => {
  let messageTemplate = "";
  try {
    await fetch(apiURL + `/${id}`)
      .then((res) => res.json())
      .then((data) => {
        messageTemplate = data;
      });
  } catch (error) {
    console.log(`Error while calling api:${error}`);
  } finally {
    if (messageTemplate === "") {
      console.log("No campaign found with the given ID.");
      return { error: "No campaign found" };
    } else {
      return messageTemplate;
    }
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
    cardToEdit = event.target.closest("div .card");
    isAdd = false;
    editMessageTemplateById(id);
  } else if (clickRegistered === "Delete") {
    const deleteButton = event.target.closest(".delete.button");
    const id = deleteButton.dataset.id;
    console.log(`Delete button id: ${id}`);
    if (confirm(`Are you sure you want to delete this message template?`)) {
      await deleteMessageTemplateById(id);
    }
  }
});
messageTemplateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(messageTemplateForm);
  const data = Object.fromEntries(formData.entries());
  console.log(`message template form data:`, data);
  try {
    //edit
    if (!isAdd) {
      await fetch(`${apiURL}/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(() => {
          console.log("Contact updated successfully", editTemplateFiller(data));
          cardToEdit.innerHTML = editTemplateFiller(data);
        })
        .then(() => {
          toggleForm();
          messageTemplateForm.reset();
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
        console.log("Contact added successfully");
        window.location.href = "./message-template.html";
      });
    }
  } catch (err) {
    console.log(`Error in message template form submission: ${err}`);
  }
  // window.location.href = "./contacts.html";
});
const toggleForm = () => {
  messageTemplateFormDiv.classList.toggle("display-none");
  document.body.classList.toggle("no-scroll");
};
const fillForm = async (id) => {
  const messageTemplate = await getMessageTemplateById(id);
  messageTemplateForm.id.value = messageTemplate.id;
  messageTemplateForm.img.src = messageTemplate.AssetUrl;
  messageTemplateForm.AssetUrl.value = messageTemplate.AssetUrl;
  messageTemplateForm.Name.value = messageTemplate.Name;
  messageTemplateForm.Type.value = messageTemplate.Type;
  messageTemplateForm.Tag.value = messageTemplate.Tag;
  messageTemplateForm.Workspace.value = messageTemplate.Workspace;
  messageTemplateForm.Content.value = messageTemplate.Content;
};
const addBtn = () => {
  toggleForm();
  document.getElementById("form-img").style.display = "none";
  messageTemplateForm.getElementsByClassName("title")[0].innerText = "Add Form";
  isAdd = true;
};
const closeBtn = () => {
  messageTemplateForm.reset();
  toggleForm();
};
const editMessageTemplateById = async (id) => {
  messageTemplateForm.getElementsByClassName("title")[0].innerText =
    "Edit Form";
  toggleForm();
  messageTemplateForm.reset();
  fillForm(id);
};
AssetUrl.addEventListener("input", (e) => {
  document.getElementById("form-img").style.display = "block";
  if (e.data !== "") {
    document.getElementById("form-img").setAttribute("src", e.data);
  }
});
getAllMessageTemplates();
