<template>
  <div class="app-container">
    <!-- 開始介面 -->
    <div v-if="!isGameStarted" class="start-screen">
      <h1>西洋棋對戰</h1>
      <!-- <p class="subtitle">與 AI 對戰，提升您的棋藝</p> -->
      <button class="start-button" @click="startGame">開始遊戲</button>
    </div>

    <!-- 遊戲介面 -->
    <div v-else>
      <h1>Chess in Vue</h1>
      <div class="wrap" ref="parent" @click="cancelSelect($event)">
        <div class="main">
          <Chessboard ref="childComponentRef" :parent-piece="selectPieceObj" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chessboard from './components/ChessBoard.vue';

export default {
  components: {
    // ChessPiece,
    Chessboard,
  },
  data() {
    return {
      isGameStarted: false, // 控制遊戲是否開始
      position: {
        row: {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          e: 4,
          f: 5,
          g: 6,
          h: 7,
        },
        col: {
          1: 7,
          2: 6,
          3: 5,
          4: 4,
          5: 3,
          6: 2,
          7: 1,
          8: 0,
        },
      },
    };
  },
  created() {
    this.reset();
  },
  methods: {
    reset() {
    },
    // 取消選取
    cancelSelect(e) {
      let dom = e.target;
      const parents = [];

      while (dom !== this.$refs.parent) {
        parents.push(dom.parentNode.className);
        dom = dom.parentNode;
      }

      // 如果點擊的不是棋盤，則取消選取
      if (!parents.includes('chess-board')) {
        this.$store.commit('setSelectedStatus', {
          piece: {},
          position: {},
        });
        this.$store.commit('setValidMoves', []);
      }
    },
    test() {
      this.$refs.childComponentRef.postAPi();
    },
    // 開始遊戲
    startGame() {
      this.isGameStarted = true;
    },
  },
};
</script>

<style>
/* 重置基本樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #FFFBE9; /* 最淺色作為基底 */
}

h1 {
  text-align: center;
  color: #AD8B73; /* 深色作為標題 */
  margin-top: 40px;
  font-size: 3.5em;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(173, 139, 115, 0.3);
}

.start-screen {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #FFFBE9 0%, #E3CAA5 100%); /* 漸層從最淺到次淺 */
  text-align: center;
  padding: 20px;
}

.start-screen h1 {
  font-size: 4em;
  color: #AD8B73; /* 深色作為標題 */
  margin-bottom: 40px;
  text-shadow: 3px 3px 6px rgba(173, 139, 115, 0.3);
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.start-button {
  padding: 20px 60px;
  font-size: 1.5em;
  background-color: #CEAB93; /* 次深色作為按鈕 */
  color: #FFFBE9; /* 最淺色作為文字 */
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(173, 139, 115, 0.3);
  font-weight: bold;
}

.start-button:hover {
  background-color: #AD8B73; /* hover 時變為深色 */
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(173, 139, 115, 0.4);
}

.start-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(173, 139, 115, 0.3);
}

/* 遊戲介面背景 */
.wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
