<template>
  <div v-if="load">
    <nuxt-link to="/"><p>Back to top</p></nuxt-link>
    <p>Player : {{ data.name }}</p>
    <table class="table">
      <thead>
        <tr>
          <th>Epoch</th>
          <th v-for="s in service" :key="s.id">{{ s.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in data.log" :key="d.id">
          <th>{{ d.epoch }}</th>
          <td v-for="i in d.service" :key="i.id">
            <template v-if="i.point == null">
              -
            </template>
            <template v-else>{{ i.point }}pt</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  validate({ params }) {
    // 数値でなければならない
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      data: '',
      service: '',
      load: false,
      error: false
    }
  },
  created() {
    this.getService()
    this.getStatus()
  },
  methods: {
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
    async getStatus() {
      this.error = false
      try {
        const url =
          process.env.API_SERVER_GLOBAL +
          '/score/status/?id=' +
          this.$route.params.id
        const { data } = await axios.get(url)
        this.data = data.data
        this.load = true
      } catch (error) {
        this.error = true
      }
    }
  }
}
</script>
