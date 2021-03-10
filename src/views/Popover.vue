<template>
	<div class="popover">
		<a-popover v-model="visible" trigger="click" placement="left">
			<a slot="content" >
				<a-timeline>
					<a-timeline-item v-for="item in record" v-bind:key="item">{{item}}</a-timeline-item>
				</a-timeline>
			</a>
			<a-button type="primary">
				查看日志
			</a-button>

		</a-popover>



	</div>
</template>

<script>
	export default {
		name: 'popover',
		props: ['record'],
		data() {
			return {
				visible: false
			}
		},
		methods: {
			hide() {
				this.visible = false;
			},
		}
	}
</script>

<style>
	.ant-timeline-item-last{
		padding-bottom: 0 !important;
		height: 40px !important;
	}
</style>
