<template>
	<div class="home">
		<template>
			<a-layout id="components-layout-demo-top" class="layout">
				<a-layout-header>
					<div class="logo" >
						<img src="http://photovoltaic-logo-picture.oss-cn-hangzhou.aliyuncs.com/5afb7d319391572b1a35062e/logo/0?39829830571859670000" >
					</div>
					<a-menu theme="dark" mode="horizontal" :default-selected-keys="['1']" :selectedKeys='selectedkey' :style="{ lineHeight: '64px','margin-left':'250px' }">
						<a-menu-item key="1">
							<router-link :to="{path:'/site'}">电站列表</router-link>
						</a-menu-item>
						<a-menu-item key="4" >
							<router-link :to="{path:'/data'}">数据迁移</router-link>
						</a-menu-item>
						<a-menu-item key="2" v-if="gateway">
							<router-link :to="{path:'/gateway-details',query: {id:gateway}}">网关详情</router-link>
						</a-menu-item>
						<a-menu-item key="3" v-if="history">
							<router-link :to="{path:'/uphistory',query: {id:history}}">升级历史</router-link>
						</a-menu-item>
					</a-menu>
				</a-layout-header>
				<a-layout-content style="padding: 20px 50px">

					<div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
						<keep-alive >
							<router-view />
						</keep-alive>
						<!-- <router-view /> -->
						
					</div>
				</a-layout-content>
			</a-layout>
		</template>
	</div>
</template>

<script>
	// @ is an alias to /src
	export default {
		data() {
			return {
				
			};
		},
		computed:{
			gateway:function(){
				return  this.$store.state.gatewayid;
			},
			history:function(){
				return  this.$store.state.historyid;
			},
			selectedkey:function(){
				let num = ['1'];
				if(this.$route.path == '/site'){
					num = ['1'];
				}
				if(this.$route.path == '/gateway-details'){
					num = ['2'];
				}
				if(this.$route.path == '/uphistory'){
					num = ['3'];
				}
				if(this.$route.path == '/data'){
					num = ['4'];
				}
				return num;
			}
		},
		components: {
		},
		created() {
		}
	};
</script>

<style>
	#components-layout-demo-top .logo {
		width: 120px;
		height: 40px;
		background: rgba(255, 255, 255, 0.2);
		margin: 12px 24px 12px 0;
		float: left;
	}
	.logo img{
		width: 100%;
		height: 100%;
		vertical-align: baseline;
		
	}


	#components-layout-demo-top {
		height: 100%;
		overflow: auto;

	}
</style>
