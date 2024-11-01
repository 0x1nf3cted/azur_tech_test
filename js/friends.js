document.addEventListener("DOMContentLoaded", () => {
  const friendsListContainer = document.getElementById("friends-list");
  const searchInput = document.querySelector(".search-input");
  const friendsData = JSON.parse(localStorage.getItem("friends")) || [];

  // Afficher la liste des amis
  function displayFriends(friends) {
    friendsListContainer.innerHTML = "";
    friends.forEach((friend) => {
      const friendTemplate = document
        .getElementById("friend-template")
        .content.cloneNode(true);
      friendTemplate.querySelector(".friend-picture").src = friend.picture;
      friendTemplate.querySelector(".friend-name").textContent = friend.name;
      friendTemplate.querySelector(".friend-status").textContent =
        friend.status.charAt(0).toUpperCase() + friend.status.slice(1);
      friendTemplate.querySelector(
        ".mutual-friends"
      ).textContent = `${friend.mutual} amis communs`;

      const messageButton = friendTemplate.querySelector(".message-btn");
      messageButton.addEventListener("click", () => {
        // quand le button est cliqué, redérige  vers la page de conversation avec un id (pour être utilisé comme foreign key)
        // la page de conversation serait crée aprés
        window.location.href = `conversation.html?friendId=${friend.id}`;
      });

      // Ajouter des events listeners
      const friendItem = friendTemplate.querySelector(".friend-item");  
      friendItem.setAttribute("draggable", "true");  
      friendItem.addEventListener("dragstart", dragStart);
      friendItem.addEventListener("dragover", dragOver);
      friendItem.addEventListener("drop", drop);
      friendItem.addEventListener("dragenter", dragEnter);
      friendItem.addEventListener("dragleave", dragLeave);

      friendsListContainer.appendChild(friendTemplate);
    });
  }

  function dragStart(event) {
    draggedFriend = event.target;
    event.dataTransfer.effectAllowed = "move";
  }

  function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    
  }

  function drop(event) {
    event.preventDefault();
    if (event.target.classList.contains("friend-item")) {
      const droppedOnFriend = event.target;
      if (draggedFriend !== droppedOnFriend) {
        friendsListContainer.insertBefore(
          draggedFriend,
          droppedOnFriend.nextSibling
        );
      }
    }
    event.target.classList.remove("drag-over");

  }

  function dragEnter(event) {
    event.target.classList.add("drag-over");
  }

  function dragLeave(event) {
    event.target.classList.remove("drag-over");
  }

  displayFriends(friendsData);

  // filtre la liste des amis en fonction du query de la barre de recherche
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredFriends = friendsData.filter((friend) =>
      friend.name.toLowerCase().includes(query)
    );
    displayFriends(filteredFriends);
  });
});
