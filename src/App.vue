<template>
  <h1>Chess With Vue</h1>
  <div class="btn" @click="postAPi()">start</div>
  <div class="wrap" ref="parent" @click="cancelSelect($event)">
    <div class="main">
      <Chessboard :parent-piece="selectPieceObj" />
    </div>
  </div>
</template>

<script>
import Chessboard from './components/ChessBoard.vue';

export default {
  components: {
    // ChessPiece,
    Chessboard
  },
  data() {
  },
  created() {
    this.reset();
  },
  methods: {
    reset() {
    },
    // 取消選取
    cancelSelect(e) {
      let target = e.target;
      let parents = [];

      while (target !== this.$refs.parent) {
        parents.push(target.parentNode.className);
        target = target.parentNode;
      }

      // 如果點擊的不是棋盤，則取消選取
      if (!parents.includes('chess-board')) {
        this.$store.commit('setSelectedStatus', {
          piece: {},
          position: {},
        })
        this.$store.commit('setValidMoves', []);
      }
    },
    postAPi() {
      axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": "Say this is a test!"}],
        temperature: 0.7
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
      }
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => { 
          console.error(error);
        });
    }
  }
};
</script >

<style>
h1 {
  text-align: center;
  font-family: Arial, sans-serif;
  font-size: 4rem;
  color: #3eaf7c;
}

.wrap {
  display: flex;
  justify-content: center;
  height: 100vh;
}

.main {
  position: relative;
  height: 700px;
  display: flex;
  justify-content: center;
}
</style> 