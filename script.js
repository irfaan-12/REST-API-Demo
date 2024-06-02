async function fetchPosts() {
    console.log("Fetching posts...");
    try {
        const postResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await postResponse.json();
        console.log("Posts fetched:", posts);

        const userResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await userResponse.json();
        console.log("Users fetched:", users);

        const userMap = new Map();
        users.forEach(user => userMap.set(user.id, user));

        posts.forEach(post => {
            const user = userMap.get(post.userId);
            post.userName = user.name;
            post.userEmail = user.email;
        });

        displayPosts(posts);
    } catch (error) {
        console.error("Error fetching posts or users:", error);
    }
}

function displayPosts(posts) {
    console.log("Displaying posts...");
    const postContainer = document.getElementById('postContainer');
    postContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <p><strong>Posted by:</strong> ${post.userName} (${post.userEmail})</p>
        `;
        postElement.addEventListener('click', () => displayPostDetails(post.id));
        postContainer.appendChild(postElement);
    });
}

async function displayPostDetails(postId) {
    console.log("Fetching post details for postId:", postId);
    try {
        const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        const post = await postResponse.json();
        console.log("Post details:", post);

        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`);
        const user = await userResponse.json();
        console.log("User details:", user);

        const commentResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const comments = await commentResponse.json();
        console.log("Comments:", comments);

        const postDetailsContainer = document.getElementById('postDetailsContainer');
        postDetailsContainer.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <p><strong>Posted by:</strong> ${user.name} (${user.email})</p>
            <h4>Comments:</h4>
            <ul>
                ${comments.map(comment => `<li>${comment.body} - <em>${comment.email}</em></li>`).join('')}
            </ul>
        `;
        postDetailsContainer.style.display = 'block';
    } catch (error) {
        console.error("Error fetching post details or comments:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchPosts);
