<template>
	<div class="container">
		<nav>
			<router-link to="/">
				Explore
			</router-link>
			<router-link to="/add">
				create
			</router-link>
		</nav>
		<router-view></router-view>
		<footer>
			<p>
				Made by <a href="https://jdlrobson.com">Jon Robson</a>.
				Code on <a href="https://github.com/jdlrobson/skins.wmflabs.org">github.com</a>.
				Sourced images: Dead Emoji by André Luiz Gollo from the Noun Project
			</p>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'App'
};
</script>

<style scoped>
  main {
    margin: 12px 0;
  }
  nav {
    display: block;
    border: solid 1px white;
    border-left: none;
    border-right: none;
    padding: 20px 0;
  }
  nav a {
    padding: 0 8px;
    text-decoration: none;
    text-transform: lowercase;
  }
  footer {
    margin-top: 40px;
    font-size: 0.8em;
  }
</style>
