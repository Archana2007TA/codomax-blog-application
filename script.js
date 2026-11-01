document.addEventListener("DOMContentLoaded", function () {
    updateNav();

    if (document.getElementById("home-blog-list")) {
        loadHomeBlogs();
    }
    if (document.getElementById("register-form")) {
        handleRegister();
    }
    if (document.getElementById("login-form")) {
        handleLogin();
    }
    if (document.getElementById("dashboard-blog-list")) {
        loadDashboardBlogs();
    }
    if (document.getElementById("create-blog-form")) {
        handleCreateBlog();
    }
});

function updateNav() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const navLinks = document.getElementById("nav-links");
    if (!navLinks) return;

    if (currentUser) {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="create-blog.html">Create Blog</a></li>
            <li><a href="#" id="logout-btn" class="btn btn-danger">Logout</a></li>
        `;
        document.getElementById("logout-btn").addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    } else {
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html" class="btn btn-primary">Register</a></li>
        `;
    }
}

function handleRegister() {
    const form = document.getElementById("register-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            alert("User already exists with this email.");
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful! Please login.");
        window.location.href = "login.html";
    });
}

function handleLogin() {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password.");
        }
    });
}

function handleCreateBlog() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Please login first to create a blog.");
        window.location.href = "login.html";
        return;
    }

    const form = document.getElementById("create-blog-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.getElementById("blog-title").value;
        const category = document.getElementById("blog-category").value;
        const content = document.getElementById("blog-content").value;

        const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
        const newBlog = {
            id: Date.now(),
            title,
            category,
            content,
            author: currentUser.name,
            authorEmail: currentUser.email,
            date: new Date().toLocaleDateString()
        };

        blogs.push(newBlog);
        localStorage.setItem("blogs", JSON.stringify(blogs));
        alert("Blog published successfully!");
        window.location.href = "index.html";
    });
}

function loadHomeBlogs() {
    const container = document.getElementById("home-blog-list");
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

    if (blogs.length === 0) {
        container.innerHTML = "<p>No blogs published yet. Be the first to publish!</p>";
        return;
    }

    container.innerHTML = blogs.map(blog => `
        <article class="blog-card">
            <div>
                <h3>${blog.title}</h3>
                <p class="author">By ${blog.author} | ${blog.date} | <strong>${blog.category}</strong></p>
                <p>${blog.content}</p>
            </div>
        </article>
    `).join("");
}

function loadDashboardBlogs() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("user-welcome").innerText = `Welcome, ${currentUser.name}!`;
    const container = document.getElementById("dashboard-blog-list");
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const userBlogs = blogs.filter(b => b.authorEmail === currentUser.email);

    if (userBlogs.length === 0) {
        container.innerHTML = "<tr><td colspan='4'>You have not published any blogs yet.</td></tr>";
        return;
    }

    container.innerHTML = userBlogs.map(blog => `
        <tr>
            <td>${blog.title}</td>
            <td>${blog.category}</td>
            <td>${blog.date}</td>
            <td>
                <button onclick="deleteBlog(${blog.id})" class="btn btn-danger">Delete</button>
            </td>
        </tr>
    `).join("");
}

function deleteBlog(id) {
    let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    blogs = blogs.filter(b => b.id !== id);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    loadDashboardBlogs();
}