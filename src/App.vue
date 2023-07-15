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
    return {
      api: {
        role: 'user',
        moveStep: '1. d4 Nf6 2. c4 g6 3. g3 Bg7 4. Bg2 d6 5. Nc3 Nf6 6. Nf3 Ng8f6 7. O-O e-5 8. d5 O-O 9. e4 Nh5 10. Rb1',
        message: '現在開始一場西洋棋，我是白方你是黑方，目前移動狀況為:',
        message2: '請移動你的棋子，並只返回目前步數與移動後棋子代號，例如: 2. f3'
      }, 
      position: {
        row: {          
          'a': 0,
          'b': 1,
          'c': 2,
          'd': 3,
          'e': 4,
          'f': 5,
          'g': 6,
          'h': 7,
        },
        col: {
          '1': 7,
          '2': 6,
          '3': 5,
          '4': 4,
          '5': 3,
          '6': 2,
          '7': 1,
          '8': 0,
        }
      }
    }
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
      let msg = this.api.message + this.api.moveStep + this.api.message2;

      axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": msg}],
        temperature: 0.7,
        max_tokens: 100,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ import.meta.env.VITE_OPEN_API_KEY ,
        },
      }
      )
        .then((response) => {
          const messageContent = response.data.choices[0].message.content;
          console.log(messageContent);
        }) 
        .catch((error) => { 
          console.error(error.response.data); 
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