<template>
  <h1>Chess With Vue</h1>
  <div class="wrap" ref="parent" @click="cancelSelect($event)">
    <div class="main">
      <Chessboard :parent-piece="selectPieceObj" />
    </div>
  </div>
</template>

<script>
// import ChessPiece from './components/ChessPiece.vue';
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



<!-- <template>
  <div id="app">
    <h1>Vue Chess</h1>
    <Chessboard/>
    <button @click="reset">Reset</button>
  </div>
</template> -->

<!-- <style scoped>
.chessboard {
  max-width: 1000px;
  display: flex;
  flex-wrap: wrap;
}

.row {
  width: 1000px;
  height: 100px;
  display: flex;
}

.square {
  width: 12.5%;
  padding-bottom: 12.5%;
}

.light-square {
  background-color: #f0d9b5;
}

.dark-square {
  background-color: #b58863;
}

.selected {
  background-color: #ffa07a;
}
</style> -->


<!-- <script>
import Board from '@/chess/board.svg'
// import Soldier from '@/chess/soldier.svg'
import King from './components/King.vue'

export default {
  name: 'App',
  data() {
    return {
      activeColor: 'red',
      width: 100
    }
  },
  components: {
    Board,
    King
  },
}
</script> -->
