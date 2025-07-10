# SaaS Contact & Campaign Management Platform

## 📌 Project Summary

This project is a **Software-as-a-Service (SaaS)** platform built to help businesses manage their contacts, create message templates, and run targeted outreach campaigns. The platform supports **multi-tenant architecture**, where each business operates in its own isolated workspace.

It consists of two primary portals:

* **Admin Portal:** For admins to manage business workspaces and users
* **OutreachHub Portal:** For workspace users to manage contacts, message templates, and campaigns

This is a **learning project** designed to progressively incorporate core **full-stack development** technologies, resulting in a complete web application.

---

## 🚀 Features

### Admin Portal

* **Authentication**: Admin login/logout
* **Workspaces Management**

  * Create, update, delete, and view workspaces
  * Manage users within each workspace

### OutreachHub Portal (Workspace Users)

* **User Roles**

  * **Editor**: Full access (Create, Read, Update, Delete)
  * **Viewer**: Read-only access
* **Authentication**: Login/logout for workspace users
* **Home Dashboard**

  * Welcome message
  * **Analytics with Charts**

    * Number of campaigns per day (filterable by date range)
    * Number of messages sent per type (Text/Text & Image)
    * Contacts reached per day
  * **Analytics Tables**

    * Recent 5 campaigns with targeted contact tags
    * Top 5 tags with highest number of contacts
* **Contacts Module**

  * CRUD operations for contacts
  * Contacts tagged with multiple labels
  * Contacts identified primarily by phone number
* **Message Templates**

  * Create and manage templates (Text / Text & Image)
* **Campaigns Module**

  * Create, update, delete, copy campaigns
  * Campaigns start as drafts and can be launched
  * Store campaign messages (contact-specific data) in DB
  * Campaign status updates from draft → running → completed using polling
  * Only draft campaigns can be edited

### 🔄 Additional Use Case

* A single user with the same email can belong to multiple workspaces. The application must support easy switching between workspaces in the OutreachHub portal.

---

## 🛠️ Technologies Used

### Frontend

* **HTML5**
* **CSS3 / SCSS / SASS**
* **Vanilla JavaScript**

### Backend

* **Node.js** (JavaScript)

### Database

* **MongoDB**

---

## 📂 GitHub Workflow

* All code will be maintained on GitHub to manage version control and track progress.

---

## 📚 Learning Objectives

* Understand and implement multi-tenant architecture
* Learn full-stack development using JavaScript technologies
* Build scalable modules with proper role-based access
* Practice Git-based project management

