<template>
	<div id="app">
		<a-config-provider :locale="locale">
			<router-view :style="{height:height+'px'}" style="overflow-y: auto;width: 100%;" />
		</a-config-provider>
	</div>
</template>
<script>
	import zhCN from 'ant-design-vue/es/locale/zh_CN';
	export default {
		data() {
			return {
				height: window.innerHeight,
				locale: zhCN,
			}
		}
	}
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
	}

	#nav {
		padding: 30px;
	}

	#nav a {
		font-weight: bold;
		color: #2c3e50;
	}

	#nav a.router-link-exact-active {
		color: #42b983;
	}
</style>
