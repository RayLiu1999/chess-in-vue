<template>
  <h1>Chess With Vue</h1>
  <div class="btn" @click="test()">start</div>
  <div class="wrap" ref="parent" @click="cancelSelect($event)">
    <div class="main">
      <Chessboard ref="childComponentRef" :parent-piece="selectPieceObj" />
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
  },
};
</script>

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
