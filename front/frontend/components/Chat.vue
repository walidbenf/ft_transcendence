<template>
    <div>
      <!-- Chat Section -->
      <div v-if="showChat" class="custom-modal-background">
        <div class="custom-modal">
          <div class="custom-modal-header">
            <h5>Chat en temps réel</h5>
            <span @click="showChat = false" class="custom-modal-close">&times;</span>
          </div>
          <div class="custom-modal-body">
            <div class="chat-messages">
              <div v-for="message in chatMessages" :key="message.id" class="message">
                {{ message.user }} : {{ message.text }}
              </div>
            </div>
            <div class="chat-input">
              <input v-model="newMessage" @keydown.enter="sendMessage" placeholder="Tapez votre message..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showChat: false,
        chatMessages: [],
        newMessage: "",
      };
    },
  
    methods: {
      // Fonction pour envoyer un message dans le chat
      sendMessage() {
        if (this.newMessage) {
          const message = {
            user: "Vous", // Nom de l'utilisateur, peut être dynamique
            text: this.newMessage,
          };
  
          // Ici, nous allons simplement ajouter le message localement
          this.chatMessages.push(message);
          this.newMessage = ""; // Réinitialisez le champ de saisie
        }
      },
    },
  };
  </script>