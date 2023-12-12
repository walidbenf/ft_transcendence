<template>
	<div>
	  <div class="matchmaking">
		<h2>Joueurs disponibles</h2>
		<ul>
		  <li v-for="player in availablePlayers" :key="player.id">
			{{ player.name }}
			<button @click="addPlayerToGame(player)">Rejoindre la partie non classée</button>
		  </li>
		</ul>
	  </div>
	  <div class="game">
		<h2>Joueurs sélectionnés</h2>
		<ul>
		  <li v-for="player in selectedPlayers" :key="player.id">
			{{ player.name }}
			<button @click="removePlayerFromGame(player)">Quitter le matchmaking</button>
		  </li>
		</ul>
		<button @click="startGame">Lancer la partie</button>
	  </div>
	  <div class="result">
		<h2>Résultat de la partie</h2>
		<p>{{ gameResult }}</p>
	  </div>
	</div>
  </template>
  
  <script>
  import axios from 'axios';		// à adapter en fonction du fetch de l'API
  import Home from './Home.vue';
  
  export default {
	name: 'Matchmaking',
	components: {
	  Home,
	},
	data() {
	  return {
		availablePlayers: [],
		selectedPlayers: [],
		gameResult: '',
	  };
	},
	mounted() {
	  this.getAvailablePlayers();
	},
	methods: {
	  getAvailablePlayers() {
		const response = fetch('http://localhost:2000/api/user'), {
		  method: GET,
		  },
		}
	  },
	  addPlayerToGame(player) {
		this.selectedPlayers.push(player);
		this.availablePlayers = this.availablePlayers.filter((p) => p.id !== player.id);
	  },
	  removePlayerFromGame(player) {
		this.availablePlayers.push(player);
		this.selectedPlayers = this.selectedPlayers.filter((p) => p.id !== player.id);
	  },
	  startGame() {
		axios.post('/api/game', this.selectedPlayers).then((response) => {
		  this.gameResult = response.data.result;
		});
	  },
	},
  };
  </script>