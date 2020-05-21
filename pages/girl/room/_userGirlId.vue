<template>
<div class="columns">
	<div class="column chara-area is-6 is-offset-3-desktop">
		<Character :code="info.girl.code"
			:emote="emote"
			:voice="voice"
			@click="touched()"
			@voiceEnded="resetVoice()" />
		<MessageWindow
			v-if="serifu"
			:text="serifu"
			width="is-6"
			:name="info.girl.name"
			:border-color="info.girl.color2"
			:back-color="info.girl.color" />
	</div>
	<div class="like-counter" :class="{ 'mobile': $device.isMobile , 'pc': !$device.isMobile }">
		<p>{{ info.relation_status }}</p>
	</div>
</div>
</template>

<script>
import Character from '@/components/Character.vue'
import MessageWindow from '@/components/MessageWindow.vue'
import Card from '@/components/Card.vue'
export default {
	layout: 'fullScreenWithHeader',
	components: {
		Character,
		MessageWindow,
		Card
	},
	async asyncData({ app, route }) {
		const info = await app.$api.userGirl.show(route.params.userGirlId)
		const serifu = await app.$api.serifu.index({ girl_id: info.data.girl.id, situation: 'greeting,touch' })
		return { info: info.data, serifu: serifu.data.greeting.text, emote: serifu.data.greeting.emotion, serifuObj: serifu.data }
	},
	mounted() {
		this.voice = 'greeting'
	},
	data() {
		return {
			voice: '',
			emote: ''
		}
	},
	methods: {
		touched() {
			this.voice = 'touch'
			this.emote = this.serifuObj.touch.emotion
		},
		resetVoice() {
			this.voice = ''
			this.emote = 'normal'
		}
	}
}
</script>

<style lang="scss" scoped>
.columns {
	background-image: url('/images/bg-room.webp');
	background-size: cover;
	text-align: center;
	position: relative;
	.chara-area {
		display: flex;
		justify-content: center;
		overflow: hidden;
		padding: 0;
		height: 100%;
	}
	.like-counter {
		height: 8rem;
		width: 8rem;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		color: white;
		background: linear-gradient(175.48711174823706deg, rgba(255, 156, 160,1) 8.759601262012552%,rgba(254, 207, 238,1) 86.2560455083508%);
		filter: drop-shadow(0 3px 5px rgb(173, 164, 165));
		font-family: 'lightNovel';
		z-index: 2;
		position: absolute;
		&.mobile {
			top: 1rem;
			left: 1rem;
			height: 6rem;
			width: 6rem;
			font-size: 1.5rem;
		}
		&.pc {
			top: 3.25rem;
			left: 3.25rem;
		}
	}
}

</style>