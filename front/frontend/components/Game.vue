<template>
	 <!-- Temporaire : sera remplacé par la zone de score et des joueurs -->
    <div class="body">
      <canvas ref="scorezone" :scorezone="scorezone" id="score-zone" width="800" height="256" class="player_score_zone"></canvas>
    </div>
	<div class="body">
	  <!-- Fin de la zone de score -->
	  <canvas ref="gamezone" :gamezone="gamezone" id="game-zone" width="800" height="600" class ="game-zone" @mousemove="playerMove($event, game)" v-if="showCanvas"></canvas>
    <button class="start" @click= "start()">Démarrer</button>
    <!-- <button class="stop" @click= "stop(game)">Arrêter/Abandonner la partie</button> -->
    <!-- Fin de la zone de jeu -->
	</div>
</template>

<script>
export default { 
  name: 'Game',
  data() {
    return {
      mouseEvent: null,
	    showCanvas: false,

      game : {
      timer: 125.0,       //provisoire, captée par le backend
      date: new Date(),  //provisoire, captée par le backend
      player: {
        y: 0,
        score: 0
      },
      computer: {
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
    },
  };
},
props: {
  gamezone: {
      type: Object,
      default: null
    },
    scorezone: {
      type: Object,
      default: null
    }
  },
  mounted() {
    // Get the DPR and size of the canvas
    
    // this.change_field();
    // this.play(game);
  },
  methods: {
	  change_field() {
      const dpr = window.devicePixelRatio;
      const rect = this.$refs.gamezone.getBoundingClientRect();
      this.$refs.gamezone.width = rect.width * dpr;
      this.$refs.gamezone.height = rect.height * dpr;

      var context = this.$refs.gamezone.getContext('2d');
      context.translate(this.$refs.gamezone.width / 2, this.$refs.gamezone.height / 2); // change the origin of the canvas x & y
    },
	  start() {
      this.showCanvas = true;
      // Set the "actual" size of the canvas
      this.change_field();
      this.play(this.game);
	  },
    draw(game){
      const dpr = window.devicePixelRatio;
      var context = this.$refs.gamezone.getContext('2d');
      // Scale the context to ensure correct drawing operations
      context.scale(dpr, dpr);

      // N.B: (canvas.width /2, canvas.height / 2) should be defined as the new (0,0)
      // and canvas.width /2, canvas.height / 2 should be the new unit (+1,0, +1,0) to match the backend unit method
      const PLAYER_HEIGHT = 100;
      const PLAYER_WIDTH = 5;
      const FIELD_HEIGHT_LEN = this.$refs.gamezone.height/2; //= 1.0 in height length
      const FIELD_WIDTH_LEN = this.$refs.gamezone.width/2; //= 1.0 in width length
     
      //clear the previous positions of the players and the ball
      context.clearRect(-FIELD_WIDTH_LEN, -FIELD_HEIGHT_LEN, this.$refs.gamezone.width, this.$refs.gamezone.height);
      // Draw field
      context.fillStyle = 'purple';
      context.fillRect(-FIELD_WIDTH_LEN, -FIELD_HEIGHT_LEN, this.$refs.gamezone.width, this.$refs.gamezone.height);
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
    // //change direction function
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
      this.$refs.scorezone.width = this.$refs.scorezone.height * (this.$refs.scorezone.clientWidth / this.$refs.scorezone.clientHeight);
      var context = this.$refs.scorezone.getContext('2d');
      context.scale(dpr, dpr);

      var scoreP1 = game.player.score;
      var scoreP2 = game.computer.score;

      context.font = "30px Arial";
      context.fillStyle = "purple";
      context.textAlign = "center";
      context.text
      context.fillText("TIME :", this.$refs.scorezone.width/2, this.$refs.scorezone.height/2);
      context.fillText(game.timer, this.$refs.scorezone.width/2, this.$refs.scorezone.height/2 + 25);
      context.fillText("Player 1: " + scoreP1 + " | " + scoreP2 + " : Player 2", this.$refs.scorezone.width/2, this.$refs.scorezone.height/2 + 50); // Les player 1 et player 2 seront remplacés par les noms des joueurs
    },
    //player movement, will change with player2 introduction
    playerMove(event, game) {
      const PLAYER_HEIGHT = 100;
      const FIELD_HEIGHT_LEN = this.$refs.gamezone.height/2; //= 1.0 in height length

      // get the mouse location in the canvas
      var canvasLocation = this.$refs.gamezone.getBoundingClientRect();
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
      const FIELD_HEIGHT_LEN = this.$refs.gamezone.height/2; //= 1.0 in height length
      const FIELD_WIDTH_LEN = this.$refs.gamezone.width/2; //= 1.0 in width length

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
      this.$refs.gamezone.addEventListener('mousemove', (event) => this.playerMove(event, game)); // got issues on crashing the session
      var anim;
      this.ballMove(game);
      this.score(game);
      this.draw(game);
      this.computerMove(game);
      anim = requestAnimationFrame(() => this.play(game));
      this.$refs.gamezone.removeEventListener('mousemove', (event) => this.playerMove(event, game));
    },
    stop(game) {
      var anim;

      cancelAnimationFrame(anim);
    },
	},
};
</script>
<style>
.start {
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
.start:hover {
  background-color: #0056b3;
}

.stop {
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
.stop:hover {
  background-color: red;
}

.player_score_zone {
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  display:block;
  width: 60%;
  height: 200px;
  background-color: #474444;
}

.game-zone {
  margin-bottom: 10px;
  margin: 0 auto; /* Auto-marge horizontale pour centrer */
  display: block; /* Afficher en tant que bloc */
  background-color: #474444;
}

</style>