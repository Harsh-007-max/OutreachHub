const apiURL = "https://6874d57add06792b9c95705b.mockapi.io/api/v1/Contact";
const contactContainer = document.getElementsByClassName("main-content")[0];
let contacts = [];
console.log("Hello");
const templateFiller = (data) => {
  const template = document.createElement("div");
  template.innerHTML = `
<div class="card" data-id="${data.id}">
  <div class="hero-image">
    <img src="${data.Avatar}" alt="" loading="lazy" />
  </div>
  <div class="card-body">
    <h5>${data.Name}</h5>
    <div class="line">
      <label class="card-label">Company:</label>
      <span class="chip">${data.Company}</span>
    </div>
    <div class="line">
      <label class="card-label">Job Title:</label>
      <span class="chip">${data.JobTitle}</span>
    </div>
    <div class="card-description">
      <div class="line">
        <label class="card-label">Tags:</label>
        <span class="chip">${data.Tags}</span>
      </div>
      <div class="line">
        <label class="card-label">Phone No:</label>
        <span class="chip">${data.Phone}</span>
      </div>
      <div class="line">
        <label class="card-label">Email:</label>
        <span class="chip">${data.Email}</span>
      </div>
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
const getAllContacts = async () => {
  console.log("Contacts module loaded");
  contactContainer.innerHTML = "Loading...";
  let message = "";
  try {
    await fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        contacts = data;
      })
      .catch((err) => {
        console.log("Error in api call: ", err);
      });
  } catch (e) {
    message = "Error fetching contacts. Please try again later.";
    console.log("GetAll contacts failed: ", e);
  } finally {
    contactContainer.innerHTML = message;
  }
  if (contacts.length === 0) {
    contactContainer.innerHTML = "No contacts available.";
    return;
  } else {
    contacts.forEach((contact) => {
      contactContainer.appendChild(templateFiller(contact));
    });
  }
};
const deleteContactById = async (id) => {
  try {
    await fetch(apiURL + `/${id}`, { method: "DELETE" })
      .then((res) => console.log(res))
      .catch((err) => console.log(`error in api call: ${err}`));
    contacts = contacts.filter((contact) => contact.id != id);
    if (contacts.length === 0) {
      contactContainer.innerHTML = "No contacts available.";
      return;
    } else {
      contactContainer.innerHTML = "";
      contacts.forEach((contact) => {
        contactContainer.appendChild(templateFiller(contact));
      });
    }
  } catch (error) {
    console.log(`Error while calling api: ${error}`);
  }
};
contactContainer.addEventListener("click", async (e) => {
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
    if (confirm(`Are you sure you want to delete this contact?`)) {
      await deleteContactById(id);
    }
  }
});
getAllContacts();
