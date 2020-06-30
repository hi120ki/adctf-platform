<template>
  <div v-if="load">
    <h1>Epoch : {{ epoch }}</h1>
    <h1>Count : {{ timerCount }}</h1>
    <h1>Start : {{ startDate }}</h1>
    <h1>End : {{ endDate }}</h1>
    <table class="table">
      <thead>
        <tr>
          <th>Place</th>
          <th>Name</th>
          <th>Point</th>
          <th v-for="s in service" :key="s.id">{{ s.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in data" :key="d.id">
          <th>{{ d.place }}</th>
          <td>
            <nuxt-link :to="'/user/' + d.id">{{ d.name }}</nuxt-link>
          </td>
          <td>{{ d.point }}pt</td>
          <td v-for="i in d.service" :key="i.id">
            {{ i.point }}pt
            <br />
            <b-icon icon="check-outline" size="is-small" />
            {{ i.health }} (+{{ i.last }})
            <b-icon icon="flag" size="is-small" />
            +{{ i.getflag }} -{{ i.lostflag }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
  name: 'HomePage',
  data() {
    return {
      data: '',
      service: '',
      epoch: 0,
      start: 0,
      end: 0,
      load: false,
      error: false,
      timerCount: 0
    }
  },
  computed: {
    startDate() {
      return dayjs(this.start * 1000).format('YYYY/MM/DD HH:mm:ss')
    },
    endDate() {
      return dayjs(this.end * 1000).format('YYYY/MM/DD HH:mm:ss')
    }
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount -= 1
          }, 1000)
        } else {
          this.epoch += 1
          this.getScore()
          this.getCount()
        }
      },
      immediate: true
    }
  },
  created() {
    this.getEpoch()
    this.getService()
    this.getScore()
    this.getCount()
  },
  methods: {
    async getEpoch() {
      this.error = false
      try {
        const url = process.env.API_SERVER_GLOBAL + '/epoch'
        const { data } = await axios.get(url)
        this.epoch = data.epoch
        this.start = data.start
        this.end = data.end
        this.load = true
      } catch (error) {
        this.error = true
      }
    },
    async getScore() {
      this.error = false
      try {
        const url = process.env.API_SERVER_GLOBAL + '/score'
        const { data } = await axios.get(url)
        this.data = data.data
        this.load = true
      } catch (error) {
        this.error = true
      }
    },
    async getService() {
      this.error = false
      try {
        const url = process.env.API_SERVER_GLOBAL + '/service'
        const { data } = await axios.get(url)
        this.service = data.data
        this.load = true
      } catch (error) {
        this.error = true
      }
    },
    getCount() {
      this.timerCount = 120 - ((dayjs().unix() - this.start) % 120)
    }
  }
}
</script>
