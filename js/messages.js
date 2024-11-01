document.addEventListener("DOMContentLoaded", () => {
    const conversationsContainer = document.querySelector('.conversations-container');
    const searchInput = document.querySelector('.search-input');
    const conversationsData = JSON.parse(localStorage.getItem('conversations')) || [];
    const friendsData = JSON.parse(localStorage.getItem('friends')) || []; // extraire la liste des amis (on se permet de le faire comme ça, car y en a pas beaucoup)

    // Afficher les conversations
    function displayConversations(conversations) {
        conversationsContainer.innerHTML = '';

        conversations.forEach(conversation => {
            // trouver friend en se basant  sur l'id friend
            const friend = friendsData.find(f => f.id === conversation.friendId);
            
            if (friend) {
                const conversationTemplate = document.getElementById('conversation-template').content.cloneNode(true);
                conversationTemplate.querySelector('.contact-picture').src = friend.picture;
                conversationTemplate.querySelector('.contact-name').textContent = friend.name;
                conversationTemplate.querySelector('.last-message').textContent = conversation.lastMessage.substr(0, 20) + '...';
                conversationTemplate.querySelector('.last-message-time').textContent = conversation.lastMessageTime;

                // Redérige vers la conversations
                conversationTemplate.querySelector('.conversation-item').addEventListener('click', () => {
                    window.location.href = `conversation.html?friendId=${conversation.friendId}`;
                });

                conversationsContainer.appendChild(conversationTemplate);
            } else {
                console.error(`Amis avec Id ${conversation.friendId} n'existe pas.`);
            }
        });
    }

    displayConversations(conversationsData);

    // Filtrer les conversations
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredConversations = conversationsData.filter(conversation => {
            const friend = friendsData.find(f => f.id === conversation.friendId);
            return friend && friend.name.toLowerCase().includes(query);
        });
        displayConversations(filteredConversations);
    });
});
