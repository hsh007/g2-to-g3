<template>
	<div class="uphistory">
		<a-button type="primary" v-on:click="refresh">刷新</a-button>
		<a-divider />
		<a-table :columns="columns" :pagination="pagination" :data-source="historydata" :loading="loading" @change="onchange"  size='middle'>
			<span slot="step" slot-scope="text">
				<!-- <a>{{ record }}</a> -->
				<span v-if="text == 0">预约成功</span>
				<span v-if="text == 1">任务初始化</span>
				<span v-if="text == 2">同步电站</span>
				<span v-if="text == 3">同步网关设备</span>
			</span>
			<span slot="status" slot-scope="text" style="vertical-align: middle;">
				<!-- <a>{{ record }}</a> -->
				<span class="circle"  v-bind:class="[text==0 ? '' :(text==1 ? 'blue' : (text==2 ? 'green' : (text==3 ? 'red' : ''))) ]"></span>
				<!-- <span class="circle"  v-bind:class="[text==1 ? 'blue' : '']"></span>
				<span class="circle"  v-bind:class="[text==2 ? 'green' : '']"></span>
				<span class="circle"  v-bind:class="[text==3 ? 'red' : '']"></span> -->
				<span v-if="text == 0">初始化</span>
				<span v-if="text == 1">进行中</span>
				<span v-if="text == 2">成功</span>
				<span v-if="text == 3">失败</span>
				<span v-if="text == 4">等待中</span>
			</span>
			<span slot="process" slot-scope="text,record">
				<a-progress v-if="record.status == 0 || record.status == 1" :percent="text" status="active" />
				<a-progress v-if="record.status == 2" :percent="text"  status="success"/>
				<a-progress v-if="record.status == 3" :percent="text" status="exception" />
			</span>
			<span slot="reservation" slot-scope="text">
				<span  v-if="text">是</span>
				<span  v-if="!text">否</span>
				
			</span>
			<span slot="updatedAt" slot-scope="text">
				<span>{{text | formatDate}}</span>
			</span>
			<span slot="migrationLog" slot-scope="record">
				<!-- <a-button type="primary" @click="show(record)">升级历史</a-button> -->
					<popover :record="record" ></popover>
			</span>
		</a-table>
		<!-- <a-popover v-model="visible"  > -->
			<!-- <a slot="content" @click="hide">
				<template>
					<a-timeline>
						<a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
						<a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
						<a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
						<a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
					</a-timeline>
				</template>
			</a> -->
		
		<!-- </a-popover> -->
		<!-- <div>
			
		</div> -->
		
	
	</div>
</template>

<script>
	import Popover from './Popover.vue'
	import moment from 'moment'
	const columns = [{
			title: '电站',
			width: '250px',
			dataIndex: 'siteName',
		},
		{
			title: '任务阶段',
			width: '300px',
			dataIndex: 'step',
			scopedSlots: {
				customRender: 'step'
			}
		},
		{
			title: '状态',
			width: '300px',
			dataIndex: 'status',
			scopedSlots: {
				customRender: 'status'
			}
		},
		{
			title: '迁移进度',
			width: '250px',
			dataIndex: 'process',
			scopedSlots: {
				customRender: 'process'
			}
		},
		{
			title: '任务描述',
			width: '250px',
			dataIndex: 'taskDesc',
		},
		{
			title: '预计时间（s）',
			width: '250px',
			dataIndex: 'estimateTime',
		},
		{
			title: '执行时间（s）',
			width: '250px',
			dataIndex: 'actualTime',
		},
		{
			title: '预约迁移',
			width: '100px',
			dataIndex: 'reservation',
			scopedSlots: {
				customRender: 'reservation'
			}
		},
		{
			title: '预约时间',
			width: '250px',
			dataIndex: 'reservationDate',
		},
		{
			title: '迁移时间',
			width: '250px',
			dataIndex: 'updatedAt',
			scopedSlots: {
				customRender: 'updatedAt'
			}
		},
		{
			title: '迁移日志',
			width: '250px',
			dataIndex: 'migrationLog',
			scopedSlots: {
				customRender: 'migrationLog'
			}
		}
		
	]
	// @ is an alias to /src
	// import Popovertemplate from '@/views/Popovertemplate.vue'
	
	export default {
		name: 'Uphistory',
		components:{
			Popover
		},
		data() {
			return {
				columns,
				historydata: [],
				loading: false,
				id: this.$route.query.id,
				visible: false,
				pagination: {
					total: 0,
					'default-current': 1,
					'show-size-changer': true,
					'pageSizeOptions': ['10', '20', '30', '40', '50'],
				},
				q: {
					page: 1,
					limit: 10,
				},
				fullPath:''
			}
		},
		methods: {
			gethistory: function(pagination) {
				let data = { ...this.q
				};
				if(pagination){
					data.page = pagination.current;
					data.limit = pagination.pageSize;
				}
				// migration/getTaskLogs
				this.loading = true;
				this.axios.get('migration/getTaskLogs?siteId=' + this.id+'&page='+data.page+'&limit='+data.limit).then(res => {
					this.loading = false;
					if (res.data.status == 'success') {
						this.historydata = res.data.data.list;
						this.pagination.total = res.data.data.pageInfo.count
					}
				})
			},
			show: function() {
				this.visible = true
			},
			hide() {
				this.visible = false;
			},
			onchange(pagination) {
				this.gethistory(pagination)
			},
			setid:function(){
				this.fullPath = this.$route.fullPath;
				this.id = this.$route.query.id
				this.$store.getters.gethistoryid(this.id);
			},
			refresh:function(){
				this.pagination= {
					total: 0,
					'default-current': 1,
					'show-size-changer': true,
					'pageSizeOptions': ['10', '20', '30', '40', '50'],
				},
				this.q= {
					page: 1,
					limit: 10,
				}
				this.gethistory();
			}
		},
		mounted: function() {
			this.setid();
			this.gethistory();
		},
		watch: {
			'$route'(to) {
				if(to.path == '/uphistory'){
					if(to.fullPath !== this.fullPath){
						this.setid();
						this.gethistory();
					}
				}
			}
		},
		filters:{
			formatDate: function (value) {
				return moment(value).format('YYYY-MM-DD HH:mm:ss')
			}
		}
	}
</script>

<style>
	.circle{
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #E8E8E8;
		vertical-align: middle;
		margin-right: 10px;
	}
	.blue{
		background-color: #1890ff !important;
	}
	.green{
		background-color: #52c41a !important;
	}
	.red{
		background-color: red !important;
	}
	
</style>
