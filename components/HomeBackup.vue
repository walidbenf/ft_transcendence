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

  <!-- Temporaire : sera remplacé par la zone de score et des joueurs -->
    <div>
      <canvas id="score-zone" width="800" height="256" class="player_score_zone"></canvas>
    </div>
    <canvas id="canvas" width="800" height="600" class ="game-zone" @mousemove="playerMove($event, game)" v-if="showCanvas"></canvas>
    <button class="quit" @click="showCanvas = false, stop(game)">Quitter la partie (abandon)</button>
    <!-- Fin de la zone de jeu -->
    <div class="footer">
      <div class="icon-container">
    <img src="../assets/icons/chat.svg" alt="Chat-Icon" class="icon-chat" @click="showChat = true" />
      </div>
    </div>
</template>

<script>
import * as bcrypt from 'bcryptjs';
import { useCookies } from "vue3-cookies";

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
      showCanvas: true,
      showProfileIcon: false,
      isUserLoggedIn: false,
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
    
    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();
    var isConnected = true;

    // Set the "actual" size of the canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    var game = {
      timer: 125.0,       //provisoire, captée par le backend
      date: new Date(),  //provisoire, captée par le backend
      player: {
        y: 0,
        score: 0
      },
      computer: {         // remplacé par player2/user2 plus tard dans le backend
        y: 0,
        score: 0
      },
      ball:{
        x: 0,
        y: 0,
        r: 5,
        speed: {
          x: 1.2,  //provisoire
          y: 1.2 //provisoire
        }
      }
    };

    this.change_field();
    this.play(game);
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
    change_field() {
      var context = canvas.getContext('2d');
      context.translate(canvas.width / 2, canvas.height / 2); // change the origin of the canvas x & y
    },
    draw(game){
      const dpr = window.devicePixelRatio;
      var context = canvas.getContext('2d');
      // Scale the context to ensure correct drawing operations
      context.scale(dpr, dpr);

      // N.B: (canvas.width /2, canvas.height / 2) should be defined as the new (0,0)
      // and canvas.width /2, canvas.height / 2 should be the new unit (+1,0, +1,0) to match the backend unit method
      const PLAYER_HEIGHT = 100;
      const PLAYER_WIDTH = 5;
      const FIELD_HEIGHT_LEN = canvas.height/2; //= 1.0 in height length
      const FIELD_WIDTH_LEN = canvas.width/2; //= 1.0 in width length
     
      //clear the previous positions of the players and the ball
      context.clearRect(-FIELD_WIDTH_LEN, -FIELD_HEIGHT_LEN, canvas.width, canvas.height);
      // Draw field
      context.fillStyle = 'purple';
      context.fillRect(-FIELD_WIDTH_LEN, -FIELD_HEIGHT_LEN, canvas.width, canvas.height);
      // Draw middle line
      context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(0, -FIELD_HEIGHT_LEN);
      context.lineTo(0, FIELD_HEIGHT_LEN);
      context.stroke();

      // Draw players
      context.fillStyle = 'blue';
      context.fillRect(-FIELD_WIDTH_LEN, game.player.y, PLAYER_WIDTH, -PLAYER_HEIGHT/2);
      context.fillRect(-FIELD_WIDTH_LEN, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT/2);

      context.fillStyle = 'red';
      context.fillRect(FIELD_WIDTH_LEN, game.computer.y, -PLAYER_WIDTH, -PLAYER_HEIGHT/2);
      context.fillRect(FIELD_WIDTH_LEN, game.computer.y, -PLAYER_WIDTH, PLAYER_HEIGHT/2);

      // Draw ball
      context.beginPath();
      context.fillStyle = 'yellow';
      context.arc(game.ball.x, game.ball.y, 5, 0, Math.PI * 2, false);
      context.fill();
    },
    //change direction function
    changeDirection(game, playerPosition) {
      const PLAYER_HEIGHT = 100;
      const MAX_SPEED = 5;

      var impact = game.ball.y - playerPosition - PLAYER_HEIGHT/2;
      var ratio = 100 / (PLAYER_HEIGHT / 2); // default height is 100, so ratio = 2
      // optional part for ball speed increase
      game.ball.speed.y *= Math.round(impact * ratio / 100);
      if (game.ball.speed.y >= MAX_SPEED)
        game.ball.speed.y = -MAX_SPEED;
      else if (game.ball.speed.y <= -MAX_SPEED)
        game.ball.speed.y = MAX_SPEED;
    },
    // collision function
    collide(game, player) {
      const PLAYER_HEIGHT = 100;
      const MAX_SPEED = 5;

      if (game.ball.y < player.y - PLAYER_HEIGHT / 2 || game.ball.y > player.y + PLAYER_HEIGHT / 2 ) {
        //reset the ball and the players to the center;
        game.ball.x = 0;
        game.ball.y = 0;
        game.player.y = 0;
        game.computer.y = 0;
        //reset speed
        game.ball.speed.x = 1.2;
        game.ball.speed.y = 1.2;
      }
      else {
        //increase the speed (to change) + change its direction
        if (game.ball.speed.x >= MAX_SPEED)
          game.ball.speed.x = -MAX_SPEED;
        else if (game.ball.speed.x <= -MAX_SPEED)
          game.ball.speed.x = MAX_SPEED;
        else
          game.ball.speed.x *= -1.2;
        this.changeDirection(game, player.y);
      }
    },
    //change/show the game scores
    score(game) {
      const dpr = window.devicePixelRatio;
      // Scale the context to ensure correct drawing operations
      var scoreZone = document.getElementById('score-zone');
      scoreZone.width = scoreZone.height * (scoreZone.clientWidth / scoreZone.clientHeight);
      var context = scoreZone.getContext('2d');
      context.scale(dpr, dpr);

      var scoreP1 = game.player.score;
      var scoreP2 = game.computer.score;

      context.font = "30px Arial";
      context.fillStyle = "purple";
      context.textAlign = "center";
      context.text
      context.fillText("TIME :", scoreZone.width/2, scoreZone.height/2);
      context.fillText(game.timer, scoreZone.width/2, scoreZone.height/2 + 25);
      context.fillText("Player 1: " + scoreP1 + " | " + scoreP2 + " : Player 2", scoreZone.width/2, scoreZone.height/2 + 50); // les player 1 et player 2 seront remplacés par les noms des joueurs
    },
    //player movement, will change with player2 introduction
    playerMove(event, game) {
      const PLAYER_HEIGHT = 100;
      const FIELD_HEIGHT_LEN = canvas.height/2; //= 1.0 in height length

      // get the mouse location in the canvas
      var canvasLocation = canvas.getBoundingClientRect();
      var mouseLocation = event.clientY - canvasLocation.top - FIELD_HEIGHT_LEN;
      // move the player
      if (game && game.player) {
        if (mouseLocation < -FIELD_HEIGHT_LEN / + PLAYER_HEIGHT / 2)
            game.player.y = mouseLocation + PLAYER_HEIGHT / 2;
          else if (mouseLocation > FIELD_HEIGHT_LEN - PLAYER_HEIGHT / 2)
            game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
          else
            game.player.y = mouseLocation;
          // Send the player's coordinates to the backend, later on the backend will send the coordinates of the other player
          //const userData = {
          //  id: game.player.id,
          //  y: game.player.y,
          //};
          //axios.post('/api/coordinates', userData) // to replace with the real path of the backend
          //  .then(response => {
          //    console.log(response.data);
          //  })
          //  .catch(error => {
          //    console.error(error);
          //  });
      }
    },
    computerMove(game) {
      game.computer.y += game.ball.speed.y * 0.85;
    },
    ballMove(game) {
      const FIELD_HEIGHT_LEN = canvas.height/2; //= 1.0 in height length
      const FIELD_WIDTH_LEN = canvas.width/2; //= 1.0 in width length

      // rebounds on the top and bottom lines of the canvas
      if (game.ball.y > FIELD_HEIGHT_LEN - 5 || game.ball.y < -FIELD_HEIGHT_LEN + 5)
        game.ball.speed.y *= -1.2;
      // collision with players
      if (game.ball.x >= FIELD_WIDTH_LEN - 10)
        this.collide(game, game.computer);
      else if (game.ball.x <= -FIELD_WIDTH_LEN + 10)
        this.collide(game, game.player);
      game.ball.x += game.ball.speed.x;
      game.ball.y += game.ball.speed.y;
    },
    play(game) {
      canvas.addEventListener('mousemove', (event) => this.playerMove(event, game)); // got issues on crashing the session
      var anim;
      this.ballMove(game);
      this.score(game);
      this.draw(game);
      this.computerMove(game);
      anim = requestAnimationFrame(() => this.play(game));
      canvas.removeEventListener('mousemove', (event) => this.playerMove(event, game));
    },
    stop(game) {
      var anim;

      cancelAnimationFrame(anim);
    }
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
}

.player_score_zone {
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  display:block;
  width: 60%;
  height: 200px;
}

.game-zone {
  margin-bottom: 10px;
  margin: 0 auto; /* Auto-marge horizontale pour centrer */
  display: block; /* Afficher en tant que bloc */
}

.quit {
  height:8%;
  width: 15%;
  margin-left: 42%;
  text-align: center;
  color: #fff;
  background: rgba(102, 105, 105);
  border: none; /* Supprimer la bordure par défaut */
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer; /* Curseur de la main au survol */
  transition: background-color 0.3s ease; /* Animation de transition de couleur de fond */
}
.quit:hover {
  background-color: #0056b3; 
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
