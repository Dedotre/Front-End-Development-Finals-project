# Front-End-Development-Finals-project
Front End Development Finals project

# Nova Market

A lightweight, zero-dependency e-commerce client built exclusively with standard web technologies. It prioritizes performance, native browser capabilities, and a minimal execution footprint.

## Architecture & Stack

This application rejects heavy frameworks and state management libraries in favor of native platform APIs:

* **View Layer:** Semantic HTML5 and CSS3. 
* **Styling:** CSS variables for theming. Dark mode is handled natively via `@media (prefers-color-scheme: dark)` with zero JavaScript overhead.
* **Logic:** Vanilla JavaScript (ES6+).
* **State Management:** Global state (the shopping cart) is persisted entirely via the native `localStorage` API.
* **Data Source:** Asynchronous hydration via [FakeStoreAPI](https://fakestoreapi.com/).

## Operational Directory Structure
```text
/
├── index.html
├── products.html
├── product-detail.html
├── contact.html
├── css/
│   └── style.css
└── js/
    └── app.js
