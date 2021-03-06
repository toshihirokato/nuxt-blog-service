import moment from '~/plugins/moment'

export const state = () => ({
  posts: []
})

export const getters = {
  posts: state => state.posts
}

export const mutations = {
  addPost (state, { post }) {
    state.posts.push(post)
  },
  updatePost (state, { post }) {
    state.posts = state.posts.map(p => (p.id === post.id ? post : p))
  },
  clearPosts (state) {
    state.posts = []
  }
}

export const actions = {
  // 投稿一覧ページの実装
  async fetchPosts ({ commit }) {
    const posts = await this.$axios.$get(`/posts.json`)
    commit('clearPosts')
    //! オブジェクトへループして投稿オブジェクト内に id キーを用意
    //! Firebase の自動採番 ID を代入し、Vuex ストア二配列の一要素として追加
    Object.entries(posts)
      .reverse()
      .forEach(([id, content]) =>
        commit('addPost', {
          post: {
            id,
            ...content
          }
        })
      )
  },
  async publishPost ({ commit }, { payload }) {
    const user = await this.$axios.$get(`/users/${payload.user.id}.json`)
    // eslint-disable-next-line
    const post_id = (await this.$axios.$post('/posts.json', payload)).name
    // eslint-disable-next-line
    const created_at = moment().format()
    const post = { id: post_id, ...payload, created_at }
    // eslint-disable-next-line
    delete putData.user
    await this.$axios.$put(`/users/${user.id}/posts.json`, [
      ...(user.posts || []),
      // eslint-disable-next-line
      putData
    ])
    commit('addPost', { post })
  }
}
