// Blog post storage and the public home page
const starterPosts = [
  {
    id: 101,
    title: "Small habits that make a big difference",
    category: "Lifestyle",
    excerpt: "You do not need to change your whole life overnight. Sometimes a few small habits are enough to get moving.",
    content: "Big changes often begin with small decisions. Start by choosing one habit that makes your day a little better. It could be reading a few pages, taking a short walk, or writing down what you learned. Keep it simple and give yourself time. Progress is not always loud, but it adds up.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85",
    author: "Maya Fernando",
    status: "published",
    date: "2026-10-18"
  },
  {
    id: 102,
    title: "Learning to build things on the web",
    category: "Technology",
    excerpt: "A beginner's journey through HTML, CSS and JavaScript, and why making small projects is worth the effort.",
    content: "The best way to learn web development is to make something. Begin with a page, add a little style, and then make one button work. You will meet errors along the way. That is normal. Every problem you solve helps you understand how the pieces fit together.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
    author: "Daniel Perera",
    status: "published",
    date: "2026-10-14"
  },
  {
    id: 103,
    title: "A calmer way to think about design",
    category: "Design",
    excerpt: "Good design is not about adding more. It is about making the important things easier to notice and use.",
    content: "A clean design gives every element a reason to be there. Start with the content and the people who will use it. Use space to make things easier to read, choose a small set of colours, and keep the layout consistent. A design should feel helpful before it feels impressive.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85",
    author: "Aisha Rahman",
    status: "published",
    date: "2026-10-09"
  },
  {
    id: 104,
    title: "The joy of being a lifelong learner",
    category: "Learning",
    excerpt: "There is always something new to discover when you stay curious and give yourself permission to be a beginner.",
    content: "Learning does not have to happen in a classroom. It can happen through a conversation, a project, a book, or a mistake. Follow your curiosity and keep notes about what you discover. You do not need to know everything today. You only need to stay open to the next lesson.",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=85",
    author: "Nimal Jay",
    status: "published",
    date: "2026-10-03"
  },
  {
    id: 105,
    title: "Finding inspiration in everyday places",
    category: "Lifestyle",
    excerpt: "A change of scenery can help you notice details and ideas that you might usually walk straight past.",
    content: "Inspiration is not always waiting in a big moment. Sometimes it is in a street you have never walked down, a conversation at a small shop, or the quiet time before the day begins. Pay attention to ordinary things. They often have a story.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85",
    author: "Sara Iqbal",
    status: "published",
    date: "2026-09-28"
  },
  {
    id: 106,
    title: "Make time for the work that matters",
    category: "Technology",
    excerpt: "A few practical ways to protect your focus when your screen is full of distractions.",
    content: "Focus is easier when you make a clear plan. Decide what needs to be done before opening a dozen tabs. Work for a short period, take a break, and return to the task. Keep your phone away if it pulls your attention. Small changes to your environment can make a real difference.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85",
    author: "Irfan Ali",
    status: "published",
    date: "2026-09-21"
  }
];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85";

function getPosts() {
  const savedPosts = readStorageValue("blogspace_posts", starterPosts);

  if (!Array.isArray(savedPosts)) {
    return starterPosts.slice();
  }

  return savedPosts;
}

function savePosts(posts) {
  writeStorageValue("blogspace_posts", posts);
}

function formatDate(dateString) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return replacements[character];
  });
}

function renderHomePosts(category) {
  const list = document.getElementById("homeBlogList");
  if (!list) return;

  const posts = getPosts().filter(function (post) {
    return post.status === "published" && (category === "All" || post.category === category);
  });

  list.innerHTML = posts.map(function (post) {
    const image = post.image || FALLBACK_IMAGE;

    return `
      <article class="blog-card">
        <img class="blog-card-image" src="${escapeHTML(image)}" alt="" loading="lazy" onerror="this.src='${FALLBACK_IMAGE}'">
        <div class="blog-card-body">
          <div class="blog-meta"><span class="category-label">${escapeHTML(post.category)}</span><span>${formatDate(post.date)}</span></div>
          <h3>${escapeHTML(post.title)}</h3>
          <p>${escapeHTML(post.excerpt)}</p>
          <a class="card-read" href="login.html">Read story ↗</a>
        </div>
      </article>`;
  }).join("");

  const empty = document.getElementById("homeEmpty");
  if (empty) empty.hidden = posts.length > 0;
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("homeBlogList")) {
    renderHomePosts("All");

    document.querySelectorAll(".topic-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".topic-chip").forEach(function (item) {
          item.classList.remove("selected");
        });

        chip.classList.add("selected");
        renderHomePosts(chip.dataset.category);
      });
    });
  }

  const blogForm = document.getElementById("blogForm");
  if (blogForm) {
    setupBlogEditor();
  }
});

function setupBlogEditor() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const blogForm = document.getElementById("blogForm");
  if (!blogForm) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const editId = Number(params.get("edit"));
  const posts = getPosts();
  const existingPost = posts.find(function (post) {
    return post.id === editId && post.userId === user.id;
  });

  if (editId && !existingPost) {
    window.location.href = "dashboard.html";
    return;
  }

  if (existingPost) {
    const editorHeading = document.getElementById("editorHeading");
    const blogTitle = document.getElementById("blogTitle");
    const blogCategory = document.getElementById("blogCategory");
    const blogImage = document.getElementById("blogImage");
    const blogExcerpt = document.getElementById("blogExcerpt");
    const blogContent = document.getElementById("blogContent");
    const publishButton = document.getElementById("publishButton");

    if (editorHeading) {
      editorHeading.innerHTML = 'Edit your story<span class="heading-dot">.</span>';
    }

    if (blogTitle) blogTitle.value = existingPost.title;
    if (blogCategory) blogCategory.value = existingPost.category;
    if (blogImage) blogImage.value = existingPost.image || "";
    if (blogExcerpt) blogExcerpt.value = existingPost.excerpt;
    if (blogContent) blogContent.value = existingPost.content;
    if (publishButton) publishButton.textContent = "Update story ↗";
  }

  function savePost(status) {
    const title = document.getElementById("blogTitle").value.trim();
    const category = document.getElementById("blogCategory").value;
    const image = document.getElementById("blogImage").value.trim();
    const excerpt = document.getElementById("blogExcerpt").value.trim();
    const content = document.getElementById("blogContent").value.trim();
    const message = document.getElementById("blogMessage");

    if (!title || !category || !excerpt || !content) {
      showMessage(message, "Please complete the title, category, introduction and story.", "error");
      return;
    }

    const currentPosts = getPosts();
    if (existingPost) {
      const index = currentPosts.findIndex(function (post) {
        return post.id === existingPost.id && post.userId === user.id;
      });

      if (index !== -1) {
        currentPosts[index] = {
          ...currentPosts[index],
          title: title,
          category: category,
          image: image,
          excerpt: excerpt,
          content: content,
          status: status,
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      }
    } else {
      currentPosts.unshift({
        id: Date.now(),
        userId: user.id,
        title: title,
        category: category,
        image: image,
        excerpt: excerpt,
        content: content,
        author: user.name,
        status: status,
        date: new Date().toISOString().slice(0, 10)
      });
    }

    savePosts(currentPosts);
    window.location.href = "dashboard.html";
  }

  blogForm.addEventListener("submit", function (event) {
    event.preventDefault();
    savePost("published");
  });

  const saveDraftButton = document.getElementById("saveDraftButton");
  if (saveDraftButton) {
    saveDraftButton.addEventListener("click", function () {
      savePost("draft");
    });
  }
}
