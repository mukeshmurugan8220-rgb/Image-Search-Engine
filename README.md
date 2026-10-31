# 📸 Pixora – Image Search Engine

Pixora is a responsive image search application that allows users to discover and explore images based on keywords. It uses the Wikimedia Commons API to fetch images and displays them in a dynamic gallery with a lightbox preview.

## ✨ Features

* 🔍 Search images using keywords.
* 🏷️ Popular search tags for quick discovery.
* 🖼️ Dynamic image gallery.
* ⚡ Debounced search functionality.
* 🔎 Lightbox preview with next and previous navigation.
* 📱 Responsive user interface.
* ⚠️ Loading and error handling.
* 🧑‍🎨 Displays image titles and artist information.

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* DOM Manipulation

### Backend

* Node.js
* Express.js
* CORS
* Wikimedia Commons API

## 📂 Project Structure

```text
Image-Search-Engine/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── backend/
    ├── server.js
    ├── package.json
    └── package-lock.json
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mukeshmurugan8220-rgb/Image-Search-Engine.git
```

### 2. Navigate to the Project

```bash
cd Image-Search-Engine
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Start the Backend Server

```bash
node server.js
```

Backend runs at:

```text
http://localhost:5000
```

### 5. Run the Frontend

Open `index.html` in your browser using VS Code Live Server.

## 🔗 API Endpoint

Pixora uses the Wikimedia Commons API through its Express backend.

**Search Images:**

```http
GET http://localhost:5000/api/artworks?q=Nature
```

Replace `Nature` with any keyword to search for images.

## 🖼️ How It Works

1. Enter an image keyword in the search bar.
2. Pixora sends the search request to the Express backend.
3. The backend fetches relevant images from Wikimedia Commons.
4. Search results are displayed in a responsive image gallery.
5. Click an image to view it in the lightbox preview.

## 👨‍💻 Developer

**Mukesh M**

Full Stack MERN Stack Developer

* GitHub: [mukeshmurugan8220-rgb](https://github.com/mukeshmurugan8220-rgb)
* LinkedIn: [Mukesh M](https://linkedin.com/in/mukesh-m-0b3582312)

## 📄 Image Credits

Images are retrieved from Wikimedia Commons. Image licenses and attribution requirements may vary. Please check the original image description page before reusing an image.

---

⭐ If you like this project, consider giving it a star!
