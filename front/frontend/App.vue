<template>
	<div id="app">
		<HomePage />
	</div>
  </template>
  
<script>
import HomePage from './components/Home.vue'

export default {
  name: 'App',
  components: {
    HomePage,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color:#474444;
  height: 100vh;
}
</style>
