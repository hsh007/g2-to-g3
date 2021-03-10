<template>
	<div class="site">
		<a-popconfirm title="确定迁移?" ok-text="确定" cancel-text="取消" @confirm="qianyi" @cancel="cancel">
			<a-button type="primary" :disabled="selectedRowKeys.length<1" :loading="loading">电站迁移</a-button>
			<!-- v-on:click="qianyi()" -->
		</a-popconfirm>

		<router-link :to="{path:'/gateway-details', query: {id:selectedRowKeys[0]}}">
			<a-button type="primary" :disabled='selectedRowKeys.length != 1'>网关详情</a-button>
		</router-link>
		<router-link :to="{path:'/uphistory', query: {id:selectedRowKeys[0]}}">
			<a-button type="primary" :disabled="selectedRowKeys.length != 1">升级历史</a-button>
		</router-link>
		
		<a-date-picker show-time  placeholder="预约时间" @change="datechange" @ok="dateok" />
		<!-- <a-button type="primary" :disabled="!times" @click='yuyue'>预约迁移</a-button> -->
		<a-button type="primary" :disabled="!(times  && selectedRowKeys.length >=1)" @click='yuyue' style="margin-left:20px ;" :loading="yuyueloading">预约迁移</a-button>
		<!-- <a-alert message="可同时迁移电站最多为5台!" banner style="display: inline-block;" /> -->

		<a-divider />
		<a-input placeholder="请输入电站" style="width: 200px" v-model="q.siteName" />
		<!-- <a-input placeholder="请输入电站" style="width: 200px" v-model="q.migration" /> -->
		<a-select placeholder="迁移状态" v-model="q.migration" style="width: 120px;margin-left: 20px;"  >
			<a-select-option value="false">
				未迁移
			</a-select-option>
			<a-select-option value="true">
				已迁移
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
		<a-button type="primary"  v-on:click="reset()">
			重置
		</a-button>
		<a-button type="primary" style="margin-left: 20px;" v-on:click="down()" :disabled="!q.customerAdminId">
			报表下载
		</a-button>
		<a-divider />
		<div>
			<!-- <div style="margin-bottom: 16px">
				<a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="start">
					Reload
				</a-button>
				<span style="margin-left: 8px">
					<template v-if="hasSelected">
						{{ `Selected ${selectedRowKeys.length} items` }}
					</template>
				</span>
			</div> -->
			<a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columns"	 :pagination="pagination" :data-source="sitedata" @change="onchange" :loading="loading" rowKey="income" size='middle'>
				<span slot="migrationFlag" slot-scope="text">
					<!-- <a>{{ record }}</a> -->
					<span v-if="!text">未迁移</span>
					<span v-if="text">已迁移</span>
				</span>
				<span slot="executeTask" slot-scope="text">
					<span class="circle" v-bind:class="[text? 'blue' :'' ]"></span>
					<span v-if="!text">空闲</span>
					<span v-if="text">执行中</span>
				</span>
				<span slot="income" slot-scope="text,recod">
					<!-- {{recod }}
					{{recod.migrationDate }} -->
					<span v-if="recod.migrationDate">{{recod.migrationDate | formatDate}}</span>
					<span v-if="!recod.migrationDate">--</span>
				</span>
				<span slot="migrationDate" slot-scope="text,recod">
					<span v-if="!text && recod.migrationFlag">
						是
					</span>
					<span v-else>
						否
					</span>
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
			width: '250px',
			dataIndex: 'name',
		},
		{
			title: '电站状态',
			width: '150px',
			dataIndex: 'status',
		},
		{
			title: '迁移状态',
			width: '250px',
			dataIndex: 'migrationFlag',
			scopedSlots: {
				customRender: 'migrationFlag'
			}
		},
		{
			title: '任务状态',
			width: '250px',
			dataIndex: 'executeTask',
			scopedSlots: {
				customRender: 'executeTask'
			}
		},
		{
			title: '迁移时间',
			width: '300px',
			dataIndex: 'income',
			scopedSlots: {
				customRender: 'income'
			}
		},
		{
			title: '手动迁移',
			width: '100px',
			dataIndex: 'migrationDate',
			scopedSlots: {
				customRender: 'migrationDate'
			}
		},
		{
			title:'备注',
			width:'300px',
			dataIndex: 'reservationDesc'
		},
		{
			title: '更新时间',
			width: '300px',
			dataIndex: 'updatedAt',
			scopedSlots: {
				customRender: 'updatedAt'
			}
		},
		{
			title: '创建时间',
			width: '300px',
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
					siteName: '',
					migration: undefined,
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

				this.axios.get('migration/sites?page=' + data.page + '&limit=' + data.limit + '&siteName=' + data.siteName +'&migration=' +(data.migration || '') +'&customerAdminId=' + (data.customerAdminId || ''))
					.then(res => {
						if (res.data.status == 'success') {
							this.selectedRowKeys = [];
							this.sitedata = res.data.data.list;
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
				// this.loading = true;
				let str = '';
				for(var i=0;i<this.selectedRowKeys.length;i++){
						if(i == this.selectedRowKeys.length-1 ){
							str += this.selectedRowKeys[i]
						}else{
							str += this.selectedRowKeys[i] +','
						}
				}
				window.open('http://47.254.38.148:8090/migration/site-migration?siteIds='+ str)
				// this.axios.post('migration/site-migration?siteIds='+ str, this.selectedRowKeys)
				// 	.then(res => {
				// 		this.loading = false;
				// 		if (res.data.status == 'success') {
				// 			this.$message.info('迁移成功');
				// 			this.getsitedata();
				// 		} else if (res.data.status == 'info') {
				// 			let info = '';
				// 			res.data.data.forEach(item => {
				// 				info += item + '、'
				// 			})
				// 			this.$message.info(info);
				// 			this.getsitedata();
				// 		} else {
				// 			this.$message.error(res.data.message);
				// 		}
				// 	})
				// 	.catch(error => {
				// 		this.loading = false;
				// 		console.log(error)
				// 	})
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
				this.q.siteName = '';
				this.q.migration = '';
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
