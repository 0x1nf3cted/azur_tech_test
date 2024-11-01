document.addEventListener("DOMContentLoaded", () => {

    const postInput = document.querySelector(".post-input");
    const postButton = document.querySelector(".btn-post");
    const postsContainer = document.getElementById("posts-container");
    const postTemplate = document.getElementById("post-template");
    const photoInput = document.querySelector(".photo-input");
    const photoButton = document.querySelector(".btn-photo");

    let selectedImage = null; 

    // Charger et afficher les posts depuis localstorage au chargement de la page
    loadPosts();

    // Écouteur pour le bouton d'ajout de photo
    photoButton.addEventListener("click", () => {
        photoInput.click(); // Ouvre la boîte de dialogue pour sélectionner un fichier
    });

    // Écouteur pour la sélection de l'image
    photoInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            selectedImage = file; // Stocke l'image sélectionnée dans selectedImage

            // Affiche un aperçu de l'image sélectionnée
            const reader = new FileReader();
            reader.onload = () => {
                const previewImage = document.querySelector(".preparing-image");
                previewImage.src = reader.result;
                previewImage.style.display = "block"; // Affiche l'aperçu de l'image
            };
            reader.readAsDataURL(file);
        }
    });

    // Ajouter un événement au bouton de publication de post
    postButton.addEventListener("click", async () => {
        const postText = postInput.value.trim();

        let imageBase64 = null;
        if (selectedImage) {
            imageBase64 = await convertImageToBase64(selectedImage);
        }

        if (postText || imageBase64) {
            const newPost = postTemplate.content.cloneNode(true); 
            newPost.querySelector(".post-text").textContent = postText;
            newPost.querySelector(".author-name").textContent = "Utilisateur"; 
            newPost.querySelector(".post-time").textContent = new Date().toLocaleTimeString(); 

            // Affiche l'image dans le post si une image est sélectionnée
            if (imageBase64) {
                const postImage = newPost.querySelector(".post-image");
                postImage.src = imageBase64;
                newPost.querySelector(".post-image-container").style.display = "block";
            }

            attachReactionListeners(newPost);
            attachCommentListener(newPost);
            postsContainer.prepend(newPost);

            postInput.value = "";
            selectedImage = null;
            photoInput.value = "";

            savePosts();
        }

        document.querySelector(".preparing-image").src = "";
        document.querySelector(".preparing-image").style.display = "none";
    });

    function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }


    // code pour charger les posts à partir de localstorage
    function loadPosts() {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        storedPosts.forEach((post) => {
            const newPost = postTemplate.content.cloneNode(true);
            newPost.querySelector(".post-text").textContent = post.text;
            newPost.querySelector(".author-name").textContent = post.author;
            newPost.querySelector(".post-time").textContent = post.time;
            newPost.querySelector(".like-btn > .count").textContent = post.like;
            newPost.querySelector(".dislike-btn > .count").textContent = post.dislike;
            newPost.querySelector(".heart-btn > .count").textContent = post.heart;

            newPost.querySelector(".like-btn").setAttribute("data-liked", post.liked);
            newPost.querySelector(".dislike-btn").setAttribute("data-disliked", post.disliked);
            newPost.querySelector(".heart-btn").setAttribute("data-hearted", post.hearted);

            if (post.image) {
                const postImage = newPost.querySelector(".post-image");
                postImage.src = post.image;
                newPost.querySelector(".post-image-container").style.display = "block";
            }

            const commentsContainer = newPost.querySelector(".comments-container");
            post.comments?.forEach(comment => {
                const commentEl = document.createElement("p");
                commentEl.textContent = comment;
                commentsContainer.appendChild(commentEl);
            });

            attachReactionListeners(newPost);
            attachCommentListener(newPost);
            postsContainer.prepend(newPost);
        });
    }

    // sauvgarder un post
    function savePosts() {
        const posts = [];
        const allPosts = postsContainer.querySelectorAll(".post");
        allPosts.forEach((post) => {
            const comments = Array.from(post.querySelectorAll(".comments-container p")).map(p => p.textContent);
            posts.push({
                text: post.querySelector(".post-text").textContent,
                author: post.querySelector(".author-name").textContent,
                time: post.querySelector(".post-time").textContent,
                image: post.querySelector(".post-image").src || null,
                like: parseInt(post.querySelector(".like-btn > .count").textContent),
                dislike: parseInt(post.querySelector(".dislike-btn > .count").textContent),
                heart: parseInt(post.querySelector(".heart-btn > .count").textContent),
                liked: post.querySelector(".like-btn").getAttribute("data-liked") === "true",
                disliked: post.querySelector(".dislike-btn").getAttribute("data-disliked") === "true",
                hearted: post.querySelector(".heart-btn").getAttribute("data-hearted") === "true",
                comments: comments
            });
        });
        localStorage.setItem("posts", JSON.stringify(posts));
    }

    function attachReactionListeners(newPost) {
        const likeBtn = newPost.querySelector(".like-btn");
        const dislikeBtn = newPost.querySelector(".dislike-btn");
        const heartBtn = newPost.querySelector(".heart-btn");

        likeBtn.addEventListener("click", () => {
            toggleReaction(likeBtn, "like", dislikeBtn);
            savePosts();
        });

        dislikeBtn.addEventListener("click", () => {
            toggleReaction(dislikeBtn, "dislike", likeBtn);
            savePosts();
        });

        heartBtn.addEventListener("click", () => {
            toggleReaction(heartBtn, "heart");
            savePosts();
        });
    }

    // ce code permet d'implementer la logique des réactions, (un post ne peut pas etre liké et disliké au même temps)
    function toggleReaction(button, reactionType, oppositeButton = null) {
        const countSpan = button.querySelector(".count");
        const isActive = button.getAttribute(`data-${reactionType}d`) === "true";

        if (isActive) {
            countSpan.textContent = parseInt(countSpan.textContent) - 1;
            button.setAttribute(`data-${reactionType}d`, "false");
        } else {
            countSpan.textContent = parseInt(countSpan.textContent) + 1;
            button.setAttribute(`data-${reactionType}d`, "true");

            if (oppositeButton && oppositeButton.getAttribute(`data-${reactionType === "like" ? "disliked" : "liked"}`) === "true") {
                const oppositeCount = oppositeButton.querySelector(".count");
                oppositeCount.textContent = parseInt(oppositeCount.textContent) - 1;
                oppositeButton.setAttribute(`data-${reactionType === "like" ? "disliked" : "liked"}`, "false");
            }
        }
    }

    function attachCommentListener(postElement) {
        const commentInput = postElement.querySelector(".comment-input");
        const commentButton = postElement.querySelector(".btn-comment");
        const commentsContainer = postElement.querySelector(".comments-container");

        commentButton.addEventListener("click", () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                const commentEl = document.createElement("p");
                commentEl.textContent = commentText;
                commentsContainer.appendChild(commentEl);
                commentInput.value = ""; 

                savePosts();
            }
        });
    }
});
