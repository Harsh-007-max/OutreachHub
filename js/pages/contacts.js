const apiURL = "https://6874d57add06792b9c95705b.mockapi.io/api/v1/Contact";
const contactContainer = document.getElementsByClassName("main-content")[0];
const contactForm = document.getElementById("contact-form");
const contactFormDiv = document.getElementById("contact-form-div");
let contacts = [];
let cardToEdit = "";
let isAdd = true;
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
const editTemplateFiller = (data) => {
  return `
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
`;
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
const getContactById = async (id) => {
  let contact = "";
  try {
    await fetch(apiURL + `/${id}`)
      .then((res) => res.json())
      .then((data) => {
        contact= data;
      });
  } catch (error) {
    console.log(`Error while calling api:${error}`);
  } finally {
    if (contact=== "") {
      console.log("No campaign found with the given ID.");
      return { error: "No campaign found" };
    } else {
      return contact;
    }
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
    cardToEdit = e.target.closest("div .card");
    isAdd = false;
    editContactById(id);
  } else if (editButton === "Delete") {
    const deleteButton = e.target.closest(".delete.button");
    const id = deleteButton.dataset.id;
    console.log(`Delete button id: ${id}`);
    if (confirm(`Are you sure you want to delete this contact?`)) {
      await deleteContactById(id);
    }
  }
});
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());
  console.log(`contact form data:`, data);
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
            "Contact updated successfully",
            editTemplateFiller(data),
          );
          cardToEdit.innerHTML = editTemplateFiller(data);
        })
        .then(() => {
          toggleForm();
          contactForm.reset();
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
        window.location.href = "./contacts.html";
      });
    }
  } catch (err) {
    console.log(`Error in contact form submission: ${err}`);
  }
  // window.location.href = "./contacts.html";
});
const toggleForm = () => {
  contactFormDiv.classList.toggle("display-none");
  document.body.classList.toggle("no-scroll");
};
const fillForm = async (id) => {
  const contact = await getContactById(id);
  contactForm.id.value = contact.id;
  contactForm.img.src = contact.Avatar;
  contactForm.Avatar.value = contact.Avatar;
  contactForm.Name.value = contact.Name;
  contactForm.Company.value = contact.Company;
  contactForm.JobTitle.value = contact.JobTitle;
  contactForm.Tags.value = contact.Tags;
  contactForm.PhoneNo.value = contact.PhoneNo;
  contactForm.Email.value = contact.Email;
};
const addBtn = () => {
  toggleForm();
  document.getElementById("form-img").style.display = "none";
  contactForm.getElementsByClassName("title")[0].innerText = "Add Form";
  isAdd = true;
};
const closeBtn = () => {
  contactForm.reset();
  toggleForm();
};
const editContactById = async (id) => {
  contactForm.getElementsByClassName("title")[0].innerText = "Edit Form";
  toggleForm();
  contactForm.reset();
  fillForm(id);
};
Avatar.addEventListener("input", (e) => {
  document.getElementById("form-img").style.display = "block";
  if (e.data !== "") {
    document.getElementById("form-img").setAttribute("src", e.data);
  }
});
getAllContacts();
