<template>
  <div>
    <title>Cyberpong 2042</title>
    <div class="header">
    <img src="../assets/icons/home.svg" alt="Home-Icon" class="icon-home" @click="redirectToHome" />
    <div class="icon-container">
      <!-- Icône Profile (visible si l'utilisateur est connecté) -->
      <img v-if="isUserLoggedIn" src="../assets/icons/user.svg" alt="Profile-Icon" class="icon-user" @click="showProfilePage = true" />
      <img v-if="isUserLoggedIn" src="../assets/icons/disconnect.svg" alt="Register-Icon" class="icon-door" @click="logout" />

      <!-- Icônes Login et Register (cachées si l'utilisateur est connecté) -->
      <img v-if="!isUserLoggedIn" src="../assets/icons/login.svg" alt="Login-Icon" class="icon-login" @click="showLoginModal = true" />
      <img v-if="!isUserLoggedIn" src="../assets/icons/lock.svg" alt="Register-Icon" class="icon-register" @click="showRegisterModal = true" />
    </div>
</div>
    <!--  Page de profil -->
    <div v-if="showProfilePage" class="custom-modal-background">
      <div class="custom-modal">
        <div class="custom-modal-header">
          <h5>Profil</h5>
          <span @click="showProfilePage = false" class="custom-modal-close">&times;</span>
        </div>
        <div class="custom-modal-body">
          <p>Vous êtes connecté en tant que Player</p>
          <p>Parties : 0</p>
          <p>Victoires : 0</p>
          <p>Défaites : 0</p>
          <img src="./user-circle.png" class="profile-img" />
          <button @click="showProfilePage = false" class="profile-btn">Retour</button>
          <!-- Temporaire : bouton de modification de profil -->
          <button @click="showProfilePage = false, showProfileModal = true" class="profile-btn">Modifier le profil</button>
        </div>
      </div>
    </div>
    <!-- Formulaire de connexion -->
    <div v-if="showLoginModal" class="custom-modal-background">
      <div class="custom-modal">
        <div class="custom-modal-header">
          <h5>Connexion</h5>
          <span @click="showLoginModal = false" class="custom-modal-close">&times;</span>
        </div>
        <div class="custom-modal-body">
          <!-- Contenu du formulaire connexion -->
          <form @submit.prevent="login" id="login">
            <div class="form-group">
              <label for="email">Adresse e-mail </label>
              <input type="email" class="form-control" id="email" name="email" required placeholder="Entrez votre adresse e-mail">
            </div>
            <div class="form-group">
              <label for="password">Mot de passe </label>
              <input type="password" class="form-control" id="password" name="password" required placeholder="Entrez votre mot de passe">
            </div>
            <div class="custom-modal-footer">
          <button type="submit" class="btn btn-primary">Se connecter</button>
          <img src="../assets/icons/42.svg" alt="Register-Icon" class="icon-register" @click="connectWith42" />
        </div>
          </form>
        </div>
      </div>
    </div>
      <!-- Fin du formulaire de connexion -->

  <!-- Afficher le formulaire d'inscription -->
  <div v-if="showRegisterModal" class="custom-modal-background">
      <div class="custom-modal">
        <div class="custom-modal-header">
          <h5>Inscription</h5>
          <span @click="showRegisterModal = false" class="custom-modal-close">&times;</span>
        </div>
        <div class="custom-modal-body">
          <!-- Contenu du formulaire d'inscription -->
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
  <!-- Fin du formulaire d'inscription -->
    </div>
    </div>
  </div>
  <!-- Afficher le formulaire de modification de compte -->
  <div v-if="showProfileModal" class="custom-modal-background">
      <div class="custom-modal">
        <div class="custom-modal-header">
          <h5>Modifier les informations du profil</h5>
          <span @click="showProfileModal = false" class="custom-modal-close">&times;</span>
        </div>
        <div class="custom-modal-body">
          <!-- Contenu des formulaires de modification -->
          <form @submit.prevent="submitProfile" id="profile">
            <div class="form-group">
              <label for="email">Ancienne adresse e-mail :</label>
              <input type="email" class="form-control" id="email" name ="email" required placeholder="Entrez votre adresse e-mail actuelle">
            </div>

            <div class="form-group">
            <label for="newEmail">Nouvelle adresse e-mail :</label>
              <input type="email" class="form-control" id="new-register-email" name ="new-email" required placeholder="Entrez votre nouvelle adresse e-mail">
            </div>
            
            <div class="form-group">
            <label for="confirm-newEmail">Nouvelle adresse e-mail :</label>
              <input type="email" class="form-control" id="confirm-new-register-email" name ="confirm-new-email" required placeholder="Entrez à nouveau votre nouvelle adresse e-mail">
            </div>

            <!-- Formulaire de changement de nom -->
            <div class="form-group">
              <label for="name">Nom :</label>
              <input type="name" class="form-control" id="name" name ="name" required placeholder="Entrez votre nom">
            </div>

            <div class="form-group">
              <label for="confirm-name">Confirmez votre nom :</label>
              <input type="name" class="form-control" id="confirm-name" name ="confirm-name" required placeholder="Confirmez votre nom">
            </div>

            <!-- Formulaire de changement de pseudo -->
            <div class="form-group">
              <label for="nickname">Pseudo :</label>
              <input type="nickname" class="form-control" id="nickname" name ="nickname" required placeholder="Entrez votre pseudo">
            </div>

            <div class="form-group">
              <label for="confirm-nickname">Confirmez votre pseudo :</label>
              <input type="nickname" class="form-control" id="confirm-nickname" name ="confirm-nickname" required placeholder="Confirmez votre pseudo">
            </div>

            <!-- Formulaire de changement de mdp -->
            <div class="form-group">
              <label for="name">Mot de passe :</label>
              <input type="password" class="form-control" id="password" name ="password" required placeholder="Entrez votre mot de passe">
            </div>

            <div class="form-group">
              <label for="confirm-password">Confirmez le mot de passe :</label>
              <input type="password" class="form-control" id="confirm-register-password" name ="confirm-password" required placeholder="Entrez à nouveau votre mot de passe">
            </div>

            <div class="custom-modal-footer">
                  <button type="submit" class="btn btn-primary">Soumettre les modifications</button>
            </div>
          </form>
    <!-- Fin des formulaires de modif -->
    </div>
    </div>
  </div>
</div>

    <!-- Afficher le modal de confirmation d'inscription -->
    <div v-if="showRegisterModal">
      <p>Inscription réussie !</p>
      <button @click="showRegisterModal = false">OK</button>
    </div>
    
    <!-- Afficher le modal de confirmation d'inscription -->
    <div v-if="showProfileModal">
      <p>Modifications envoyées !</p>
      <button @click="showProfileModal = false">OK</button>
    </div>
    <Game ref="gameComponent" />
    <canvas ref="scorezone" />
    <canvas ref="gamezone" />
    <div class="footer">
      <div class="icon-container">
    <img src="../assets/icons/chat.svg" alt="Chat-Icon" class="icon-chat" @click="showChat = true" />
      </div>
    </div>
</template>

<script>
import * as bcrypt from 'bcryptjs';
import { useCookies } from "vue3-cookies";
import Game from './Game.vue';

export default {
  name: 'HomePage',
  data() {
    return {
      mouseEvent: null,
      showProfilePage: false,
      showProfileModal: false,
      showLoginModal: false,
      showRegisterModal: false,
      showChat: false,
      showProfileIcon: false,
      isUserLoggedIn: false
      //registerEmail: localStorage.getItem('registerEmail') || '', // tests avec du stockage local
      //registerPassword: localStorage.getItem('registerPassword') || '', // tests avec du stockage local
    };
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  mounted() {
    const authToken = this.cookies.get("authToken");
    
    if (authToken) {
      // Le cookie "authToken" existe, cela signifie que l'utilisateur est connecté.
      // Vous pouvez exécuter des actions pour gérer la connexion ici.
      this.isUserLoggedIn = true;
      // D'autres actions à exécuter en cas de connexion.

    } else {
      // Le cookie "authToken" n'existe pas, l'utilisateur n'est pas connecté.
      // Vous pouvez exécuter des actions pour gérer la déconnexion ici.
      this.isUserLoggedIn = false;
      // D'autres actions à exécuter en cas de déconnexion.
    }
    fetch('http://localhost:2000/game')
    .then(response => response.json())
    .then(data => {
      // Utilisez l'élément game ici
      console.log(data.game);
    })
    .catch(error => {
      console.error('Une erreur s\'est produite :', error);
    });
    
  },
  components : {
    Game,
  },
  computed : {
    // scoreCanvas : this.$refs.scorezone,
    // gameCanvas : this.$refs.gamezone
  },
  methods: {
    redirectToHome() {
      window.location.reload();
    },
    connectWith42() {
      // Redirigez l'utilisateur vers la page d'authentification de 42
      const clientID = 'u-s4t2ud-953c08a4bf98abe8fd58ab07f5eeeaa867dbee781c748db3d0d45fd68e666727'; // client ID
      const redirectURI = 'http://localhost:2002/'; // URL de redirection
      const responseType = 'code';

      const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseType}`;

      window.location.href = authURL;
    },
    async login() { //Fonction pour se connecter 
     // Récupérer les données du formulaire
      const formData = new FormData(document.querySelector('#login'));
      const email = formData.get('email');
      const password = formData.get('password');
      // Créez l'objet `password`.
    // const passwordObject = {
    // create: {
    //   salted_password: password,
    //   salt: '',
    //     },
    //   };
    const response = await fetch('http://localhost:2000/auth/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password// Envoyez le mot de passe
      })
    });
      // Traiter la réponse de l'API
      if (response.ok) {
        this.showLoginModal = false;
        const data = await response.json();
        const authToken = data.access_token;
        this.cookies.set("authToken", authToken);
        console.log(authToken);
        this.isUserLoggedIn = true;
    }
      else {
        const data = await response.json();
        console.log(data);
        this.error = data.message;
        alert('Error: can\'t find the associated account');
        console.error('Error: can\'t find the associated account');
      }
    },
    logout (){
                const response = confirm("Are you sure you want to do that?");

                if (response) {
                    alert("Vous êtes déconnecté");
                    this.cookies.remove("authToken");
              this.isUserLoggedIn = false;
                } else {
                    alert("Cancel was pressed");
                }
    },
    async submitForm() {                 // Fonction pour envoyer le formulaire d'inscription
     // Récupérer les données du formulaire
      const formData = new FormData(document.querySelector('#register'));
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmEmail = formData.get('confirm-email');
      const confirmPassword = formData.get('confirm-password');
      // Validation du mot de passe
      if (password.length < 8) {
        alert('Le mot de passe doit comporter au moins 8 caractères');
        return;
      }

      // Vérifier la présence d'au moins une lettre majuscule
      if (!/[A-Z]/.test(password)) {
        alert('Le mot de passe doit contenir au moins une lettre majuscule');
        return;
      }

      // Vérifier la présence d'au moins une lettre minuscule
      if (!/[a-z]/.test(password)) {
        alert('Le mot de passe doit contenir au moins une lettre minuscule');
        return;
      }

      // Vérifier la présence d'au moins un chiffre
      if (!/\d/.test(password)) {
        alert('Le mot de passe doit contenir au moins un chiffre');
        return;
      }
      const saltRounds = 10; // Number of salt rounds (cost factor)
      const salt = bcrypt.genSaltSync(saltRounds); // Generate a salt
      const hashedPassword = bcrypt.hashSync(password, salt);
      

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
        salt: salt,
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
        const authToken = data.access_token;
        alert('Account created');
      }
      else {
        const data = await response.json();
        this.error = data.message;
        alert('Error: can\'t create the account');
        console.error(this.error);
      }
    },
    async submitProfile() {
    },
    getGameZone() {
      return this.$refs.gamezone; // marche partiellement
      // return this.$refs.gameComponent.$refs.gamezone; // a voir, mais ne marche pas encore
    },
  },
};
</script>

<style>
/*Styles pour les boutons */
.icon-home, .icon-login,.icon-chat{
  width: 24px;
  height: 24px;
  align-items: center;
  margin-top: auto;
  cursor: pointer;
}

.icon-register, .icon-user, .icon-door{
  width: 24px;
  height: 24px;
  margin-left: 10px;
  margin-top: auto;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

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

.icon-container {
  display: flex;
  align-items: center; /* Aligner verticalement au centre */
  background-color: #474444;
}

.profile-img {
  width: 100px;
  height: 100px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.profile-btn {
  width: 60px;
  height: 40px;
  margin-left: 10px;
  display:inline-block;
}

</style>
<!-- TO DO :
- transfert des données du frontend au backend de façon optimal => PRIORITÉ
-->
