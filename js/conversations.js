document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.querySelector('.message-input');
    const sendMessageButton = document.querySelector('.send-message-btn');
    const pfp = document.querySelector('.contact-picture');

    // selectionner friendId qui sera passé dans l'url ?friendId=...
    const params = new URLSearchParams(window.location.search);
    const friendId = parseInt(params.get('friendId'));
    const friendsData = JSON.parse(localStorage.getItem('friends')) || []; 

    const conversationsData = JSON.parse(localStorage.getItem('conversations')) || [];
    const messagesData = JSON.parse(localStorage.getItem('messages')) || [];

    // Trouver la conversation avec le friendId
    let conversation = conversationsData.find(c => c.friendId === friendId);

    // trouver friend avec le friendId
    const friend = friendsData.find(f => f.id === friendId);
    const pic = friend ? friend.picture : ""; 
    pfp.src = pic;

    if (conversation) {
        document.querySelector('.contact-name').textContent = conversation.name;
        document.querySelector('.contact-status').textContent = conversation.status;

        // Afficher les messages d'une conversation
        const conversationMessages = messagesData.filter(m => m.conversationId === conversation.id);
        conversationMessages.forEach(message => {
            displayMessage(message);
        });
    } else if (friend) {
        // sinon afficher que le nom et le statut d'un utilisateur
        document.querySelector('.contact-name').textContent = friend.name;
        document.querySelector('.contact-status').textContent = friend.status;
    }

    sendMessageButton.addEventListener('click', () => {
        const newMessageText = messageInput.value.trim();
        if (newMessageText) {
            // si un utilisateur envoie un message, alors  créer une nouvelle conversation s'il n'existe pas de conversation entre les deux utilisateurs
            if (!conversation) {
                conversation = {
                    id: conversationsData.length + 1,
                    friendId: friendId,
                    name: friend.name,
                    status: friend.status,
                    lastMessage: newMessageText,
                    lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    picture: friend.picture,
                    messages: []
                };
                conversationsData.push(conversation);
                localStorage.setItem('conversations', JSON.stringify(conversationsData)); // mettre à jour sur localstorage
            }

            const newMessage = {
                id: messagesData.length + 1,
                conversationId: conversation.id,
                text: newMessageText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                senderId: 1 // on assume que l'utilisateur avec id 1 est moi (l'admin)
            };

            messagesData.push(newMessage);
            localStorage.setItem('messages', JSON.stringify(messagesData)); 
            
            // mettre à jour la conversation
            conversation.lastMessage = newMessageText;
            conversation.lastMessageTime = newMessage.time;
            localStorage.setItem('conversations', JSON.stringify(conversationsData)); 

            displayMessage(newMessage);
            messageInput.value = ""; 
        }
    });


    //afficher les messages
    function displayMessage(message) {
        const messageTemplate = document.getElementById('message-template').content.cloneNode(true);
        messageTemplate.querySelector('.message-text').textContent = message.text;
        messageTemplate.querySelector('.message-time').textContent = message.time;

        messagesContainer.appendChild(messageTemplate);
    }
});
