<template>
	<div class="gateway-details">

		<a-table :columns="columns" :pagination="false" :data-source="gatewaydata" :loading="loading" size='middle'>
			<span slot="connected" slot-scope="text">
				<!-- <a>{{ record }}</a> -->
				<span v-if="text">在线</span>
				<span v-if="!text">离线</span>
			</span>
			<span slot="manual_migration" slot-scope="text">
				<span v-if="!text">自动迁移</span>
				<span v-if="text">手动迁移</span>
			</span>
			<span slot="migration_flag" slot-scope="text">
				<span v-if="text">已迁移</span>
				<span v-if="!text">未迁移</span>
			</span>
			<span slot="migration_date" slot-scope="text">
				<span v-if='text'>{{text | formatDate}}</span>
				<span v-if='!text'>--</span>
			</span>
		</a-table>
	</div>
</template>

<script>
	import moment from 'moment'
	const columns = [{
			title: '序列号',
			width: '250px',
			dataIndex: 'sn',
		},
		{
			title: '网关状态',
			width: '300px',
			dataIndex: 'connected',
			scopedSlots: {
				customRender: 'connected'
			}
		},
		{
			title: '迁移类型',
			width: '300px',
			dataIndex: 'manual_migration',
			scopedSlots: {
				customRender: 'manual_migration'
			}
		},
		{
			title: '迁移状态',
			width: '300px',
			dataIndex: 'migration_flag',
			scopedSlots: {
				customRender: 'migration_flag'
			}
		},
		{
			title: '迁移日期',
			width: '250px',
			dataIndex: 'migration_date',
			scopedSlots: {
				customRender: 'migration_date'
			}
		},
		{
			title: '错误原因',
			width: '250px',
			dataIndex: 'reason',

		}
	]
	export default {
		data() {
			return {
				id: this.$route.query.id,
				columns,
				gatewaydata: [],
				loading: false,
				fullPath:''
			}
		},
		methods: {
			getgateway: function() {
				this.loading = true;
				this.axios.get('migration/getDetail?siteId=' + this.id).then(res => {
					this.loading = false;
					if (res.data.status == 'success') {
						this.gatewaydata = res.data.data
					} else {
						this.gatewaydata = []
					}
				})
			},
			setid: function() {
				this.fullPath = this.$route.fullPath
				this.id = this.$route.query.id;
				this.$store.getters.getgatewayid(this.id);
			}
		},
		watch: {
			'$route'(to) {
				if(to.path == '/gateway-details'){
					if(to.fullPath !== this.fullPath){
						this.setid();
						this.getgateway();
					}
				}
			}
		},
		mounted: function() {
			this.setid();
			this.getgateway();
		},
		filters: {
			formatDate: function(value) {
				return moment(value).format('YYYY-MM-DD HH:mm:ss')
			}
		},

	}
</script>

<style>
</style>
