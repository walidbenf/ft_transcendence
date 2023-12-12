<template>
     <!-- Afficher le formulaire d'inscription -->
  <div v-if="showRegisterModal" class="custom-modal-background">
      <div class="custom-modal">
        <div class="custom-modal-header">
          <h5>Inscription</h5>
          <span @click="showRegisterModal = false" class="custom-modal-close">&times;</span>
        </div>
        <div class="custom-modal-body">
  <form @submit.prevent="submitForm" id="register">
    <div class="form-group">
    <label for="email">Adresse e-mail :</label>
      <input type="email" class="form-control" id="email" name ="email" required placeholder="Entrez votre adresse e-mail">
    </div>

    <div class="form-group">
    <label for="confirm-register-email">Confirmer l'adresse e-mail :</label>
      <input type="email" class="form-control" id="confirm-register-email" name ="confirm-email" required placeholder="Entrez à nouveau votre adresse e-mail">
    </div>


    <div class="form-group">
      <label for="password">Mot de passe :</label>
      <input type="password" class="form-control" id="password" name ="password" required placeholder="Entrez votre mot de passe">
    </div>

    <div class="form-group">
      <label for="confirm-password">Confirmez le mot de passe :</label>
      <input type="password" class="form-control" id="confirm-register-password" name ="confirm-password" required placeholder="Entrez à nouveau votre mot de passe">
    </div>

    <div class="custom-modal-footer">
          <button type="submit" class="btn btn-primary">S'inscrire</button>
          <img src="../assets/icons/42.svg" alt="Register-Icon" class="icon-register" @click="connectWith42" />
        </div>
  </form>
    </div>
      
    </div>
  </div>
    <!-- Fin du formulaire d'inscription -->
</template>
<script>
import * as bcrypt from 'bcryptjs';
//import { setCookie } from 'cookie-universal-nuxt';

export default {
  name: 'HomePage',
  data() {
    return {
      showLoginModal: false,
      //registerEmail: localStorage.getItem('registerEmail') || '', // tests avec du stockage local
      //registerPassword: localStorage.getItem('registerPassword') || '', // tests avec du stockage local
    };
  },methods: {
    async submitForm() {                 // Fonction pour envoyer le formulaire d'inscription
     // Récupérer les données du formulaire
      const formData = new FormData(document.querySelector('form'));
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmEmail = formData.get('confirm-email');
      const confirmPassword = formData.get('confirm-password');
      // Validation de l'adresse e-mail
      if (!email) {
        alert('L\'adresse e-mail est requise');
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(email)) {
        alert('L\'adresse e-mail n\'est pas valide');
        return;
      }

      // Validation du mot de passe
      if (!password) {
        alert('Le mot de passe est requis');
        return;
      }

      if (password.length < 8) {
        alert('Le mot de passe doit comporter au moins 8 caractères');
        return;
      }

      // Autres règles de complexité du mot de passe
      if (!isStrongPassword(password)) {
        alert('Le mot de passe doit être complexe');
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10); // 10 est le coût du hachage
      

      // Vérifier que les champs correspondent
      if (email !== confirmEmail) {
        alert('Les adresses e-mail ne correspondent pas');
        console.error('Les adresses e-mail ne correspondent pas');
        return;
      }
       if (password !== confirmPassword) {
         alert('Les mots de passe ne correspondent pas');
        console.error('Les mots de passe ne correspondent pas');
         return;
       }
      // Créez l'objet `password`.
    const passwordObject = {
    create: {
      salted_password: hashedPassword,
      salt: '',
    },
  };

      //Envoyer la requête POST à l'API
      const response = await fetch('http://localhost:2000/api/user', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password: passwordObject})
      });

     // Traiter la réponse de l'API
      if (response.ok) {
        this.showRegisterModal = false;
        const data = await response.json();
        const authToken = data.token;
        alert('Account created');
        if (data && authToken) {
          const tokenResponse = await fetch('http://localhost:2000/api/tokens', {
            method: 'GET',
            headers: {
            ' Authorization': `Bearer ${authToken}`
          }
        });
          // Traiter la réponse de l'API avec le token
          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;
            const refreshToken = tokenData.refresh_token;
          } else {
            const data = await tokenResponse.json();
            this.error = data.message;
            console.error(this.error);
            }
          }
      }
      else {
        const data = await response.json();
        this.error = data.message;
        alert('Error: can\'t create the account');
        console.error(this.error);
      }
    },
  },
};
</script>
<style>
/* Styles personnalisés pour le formulaire de connexion */
.custom-modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-modal {
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  max-width: 360px;
  width: 100%;
}

.custom-modal-header {
  background: #474444;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-modal-header h5 {
  margin: 0;
  font-size: 20px;
}

.custom-modal-close {
  font-size: 24px;
  cursor: pointer;
}

.custom-modal-body {
  padding: 20px;
}

.custom-modal-footer {
  text-align: right;
  padding: 5px 20px;
}
.custom-modal-body input[type="email"],
.custom-modal-body input[type="password"] {
  border: 2px solid #474444;; /* Couleur de la bordure*/
  border-radius: 4px; /* Arrondir les coins */
  padding: 6px; /* Espacement à l'intérieur du champ */
  width: 100%; /* Largeur du champ */
  margin-bottom: 10px; /* Espacement entre les champs */
}
/* Style personnalisé pour le bouton "Se connecter" */
.custom-modal-footer button.btn-primary {
  background-color: #474444;
  color: #fff;
  border: none; /* Supprimer la bordure par défaut */
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer; /* Curseur de la main au survol */
  transition: background-color 0.3s ease; /* Animation de transition de couleur de fond */
}

/* Style de survol (hover) du bouton */
.custom-modal-footer button.btn-primary:hover {
  background-color: #0056b3; 
}

.header {
  display: flex;
  align-items: center; /* Aligner verticalement au centre */
  justify-content: space-between; /* Espacement égal entre les éléments */
  padding: 10px; /* Ajouter un peu d'espacement autour de l'en-tête */
}
</style>