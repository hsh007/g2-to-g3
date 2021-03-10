<template>
	<div class="data">
		<a-popconfirm title="确定迁移?" ok-text="确定" cancel-text="取消" @confirm="qianyi" @cancel="cancel">
			<a-button type="primary" :disabled="selectedRowKeys.length<1" :loading="loading">数据迁移</a-button>
			<!-- v-on:click="qianyi()" -->
		</a-popconfirm>		
		<a-divider />
		<a-input placeholder="请输入电站" style="width: 200px" v-model="q.key" />
		<!-- <a-input placeholder="请输入电站" style="width: 200px" v-model="q.migration" /> -->
		<a-select placeholder="迁移状态" v-model="q.success" style="width: 120px;margin-left: 20px;"  >
			<a-select-option value="0">
				未成功
			</a-select-option>
			<a-select-option value="1">
				成功
			</a-select-option>
		</a-select>
		<a-select placeholder="用户选择" v-model="q.customerAdminId" style="width: 250px;margin-left: 20px;"   >
			
			<a-select-option :value="item.id" v-for='item in customerAdminIdList' v-bind:key='item.id'>
				{{item.name}}
			</a-select-option>
		</a-select>
		<a-button type="primary" style="margin-left: 20px;" v-on:click="query()">
			查询
		</a-button>
		<a-button type="primary" style="margin-left: 20px;" v-on:click="reset()">
			重置
		</a-button>
		<a-divider />
		<div>

			<a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columns"	 :pagination="pagination" :data-source="sitedata" @change="onchange" :loading="loading" rowKey="income" size='middle'>
				<span slot="dataSyncStepDesc" slot-scope="text">
					<span>{{text}}</span>
				</span>
				<span slot="finishSyncTime" slot-scope="text">
					<span>{{text}}</span>
				</span>
				<span slot="dataSyncFlag" slot-scope="text">
					<span v-if="text">是</span>
					<span v-if="!text">否</span>
				</span>
				<span slot="executeTask" slot-scope="text">
					<span v-if="text">是</span>
					<span v-if="!text">否</span>
				</span>
				<span slot="updatedAt" slot-scope="text">
					<span>{{text | formatDate}}</span>
				</span>
				<span slot="createdAt" slot-scope="text">
					<span>{{text | formatDate}}</span>
				</span>
			</a-table>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'
	const columns = [{
			title: '电站',
			width: '300px',
			dataIndex: 'name',
		},
		{
			title: 'G3电站',
			width: '250px',
			dataIndex: 'g3SiteName'
		},
		{
			title: '数据同步所处步骤描述',
			width: '250px',
			dataIndex: 'dataSyncStepDesc',
			scopedSlots: {
				customRender: 'dataSyncStepDesc'
			}
		},
		{
			title: '同步完成时间',
			width: '250px',
			dataIndex: 'finishSyncTime',
			scopedSlots: {
				customRender: 'finishSyncTime'
			}
		},
		
		{
			title: '执行中',
			width: '100px',
			dataIndex: 'executeTask',
			scopedSlots: {
				customRender: 'executeTask'
			}
		},
		{
			title: '数据同步完成',
			width: '250px',
			dataIndex: 'dataSyncFlag',
			scopedSlots: {
				customRender: 'dataSyncFlag'
			}
		},
		{
			title: '更新时间',
			width: '250px',
			dataIndex: 'updatedAt',
			scopedSlots: {
				customRender: 'updatedAt'
			}
		},
		{
			title: '创建时间',
			width: '250px',
			dataIndex: 'createdAt',
			scopedSlots: {
				customRender: 'createdAt'
			}
		}
	];
	export default {
		data() {
			return {
				select: [],
				sitedata: [],
				columns,
				selectedRowKeys: [], // Check here to configure the default column
				loading: false,
				pagination: {
					total: 0,
					'default-current': 1,
					'show-size-changer': true,
					'pageSizeOptions': ['10', '20', '30', '40', '50'],
				},
				q: {
					page: 1,
					limit: 10,
					success: undefined,
					customerAdminId:undefined,
				},
				customerAdminIdList:[],
				times:null,
				yuyueloading:false,
			}
		},
		computed: {
			hasSelected() {
				return this.selectedRowKeys.length > 0;
			},
		},
		methods: {
			start() {
				this.loading = true;
				// ajax request after empty completing
				setTimeout(() => {
					this.loading = false;
					this.selectedRowKeys = [];
				}, 1000);
			},
			onSelectChange(selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys;
			},
			onchange(pagination) {
				this.getsitedata(pagination)
			},
			// 获取table列表数据
			getsitedata(pagination) {
				this.loading = true;
				let data = { ...this.q
				};
				if (pagination) {
					data.page = pagination.current;
					data.limit = pagination.pageSize;
				}
	
				this.axios.get('/migration/data/sites?page=' + data.page + '&limit=' + data.limit + '&key='+(data.key || '')+'&success=' +(data.success || '') +'&customerAdminId=' + (data.customerAdminId || ''))
					.then(res => {
						if (res.data.status == 'success') {
							this.selectedRowKeys = [];
							this.sitedata = res.data.data.g2Sites;
							this.pagination.total = res.data.data.pageInfo.count;
							this.customerAdminIdList = res.data.data.userIds;
						}
						this.loading = false
					})
			},
			// 查询
			query() {
				this.q.page = 1;
				this.getsitedata()
			},
			// 迁移事件
			qianyi() {
				this.loading = true;
				let array = [];
				for(var i=0;i<this.selectedRowKeys.length;i++){
					array.push(this.selectedRowKeys[i]) 
				}
				this.axios.post('/migration/data/copy', array)
					.then(res => {
						// console.log(res)
						this.loading = false;
						if (res.data.status == 'success') {
							this.$message.info('迁移成功');
							this.query();
						} else {
							this.$message.error(res.data.message);
						}
					})
					.catch(error => {
						this.loading = false;
						console.log(error)
					})
			},
			confirm(e) {
				console.log(e);
				this.$message.success('Click on Yes');
			},
			cancel() {
				// console.log(e);
				// this.$message.error('Click on No');
			},
			//  下载
			down(){
				// console.log(thi)
				window.open(' http://47.254.38.148:8090/migration/report/download?userId='+this.q.customerAdminId)
			},
			// 预约时间change事件
			datechange(value){
				// console.log('ccccccccccccc')
				console.log(value)
				if(value){
					this.times = value.format()
				}else{
					this.times = null
				}
				
				// console.log('Formatted Selected Time: ', dateString);
			},
			dateok(value){
				this.times = value.format()
			},
			// 预约迁移
			yuyue(){
				this.yuyueloading = true
				const data = {
					"siteIds":this.selectedRowKeys,
					"reservationDate": this.times
				}
				this.axios.post('/migration/reservation/site-migration',data)
				.then(res=>{
					this.yuyueloading = false
					console.log(res);
					if(res.data.status == 'success'){
						this.$message.info('预约成功');
						this.getsitedata();
					}else{
						this.$message.error(res.data.message);
					}
				}).catch(res=>{
					console.log(res)
					this.yuyueloading = false
					
				})
			},
			reset(){
				this.q.success = '';
				this.q.customerAdminId = '';
				this.query();
			}
		},
		mounted: function() {
			this.getsitedata();
		},
		filters: {
			formatDate: function(value) {
				return moment(value).format('YYYY-MM-DD HH:mm:ss')
			}
		}
	
	}
	
</script>

<style>
	.site .ant-btn {
		margin-right: 20px;
	}
	
	.circle {
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #E8E8E8;
		vertical-align: middle;
		margin-right: 10px;
	}
	
	.blue {
		background-color: #1890ff !important;
	}
	
	.green {
		background-color: #52c41a !important;
	}
	
	.red {
		background-color: red !important;
	}
</style>
