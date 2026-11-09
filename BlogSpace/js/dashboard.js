// Dashboard list, post actions and logout
document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const welcomeName = document.getElementById("welcomeName");
  const avatar = document.getElementById("userAvatar");

  if (welcomeName) {
    welcomeName.textContent = user.name.split(" ")[0];
  }

  if (avatar) {
    avatar.textContent = user.name.charAt(0).toUpperCase();
  }

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("blogspace_currentUser");
      window.location.href = "index.html";
    });
  }

  renderDashboard(user);
});

function renderDashboard(user) {
  const allPosts = getPosts();
  const myPosts = allPosts.filter(function (post) {
    return post.userId === user.id;
  });

  const totalStories = document.getElementById("totalStories");
  const publishedStories = document.getElementById("publishedStories");
  const draftStories = document.getElementById("draftStories");

  if (totalStories) totalStories.textContent = String(myPosts.length);
  if (publishedStories) publishedStories.textContent = String(myPosts.filter(function (post) { return post.status === "published"; }).length);
  if (draftStories) draftStories.textContent = String(myPosts.filter(function (post) { return post.status === "draft"; }).length);

  const tableBody = document.getElementById("dashboardPosts");
  const emptyState = document.getElementById("dashboardEmpty");

  if (emptyState) {
    emptyState.hidden = myPosts.length > 0;
  }

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = myPosts.map(function (post) {
    const statusClass = post.status === "draft" ? "status-pill status-draft" : "status-pill";

    return `
      <tr>
        <td class="post-title-cell">${escapeHTML(post.title)}</td>
        <td>${escapeHTML(post.category)}</td>
        <td><span class="${statusClass}">${post.status === "draft" ? "Draft" : "Published"}</span></td>
        <td>${formatDate(post.updatedAt || post.date)}</td>
        <td>
          <button class="table-action" data-action="edit" data-id="${post.id}">Edit</button>
          <button class="table-action delete" data-action="delete" data-id="${post.id}">Delete</button>
        </td>
      </tr>`;
  }).join("");

  tableBody.querySelectorAll("button").forEach(function (button) {
    button.addEventListener("click", function () {
      const postId = Number(button.dataset.id);

      if (button.dataset.action === "edit") {
        window.location.href = "create-blog.html?edit=" + postId;
        return;
      }

      deletePost(postId, user);
    });
  });
}

function deletePost(postId, user) {
  const shouldDelete = window.confirm("Are you sure you want to delete this story?");
  if (!shouldDelete) return;

  const posts = getPosts().filter(function (post) {
    return !(post.id === postId && post.userId === user.id);
  });

  savePosts(posts);
  renderDashboard(user);
}
