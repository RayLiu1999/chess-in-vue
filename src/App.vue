<template>
  <h1>Chess With Vue</h1>
  <div class="wrap">
    <div class="main">
      <Chessboard/>
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
    return {
      boardSize: 8,

    };
  },
  created() {
    this.reset();
  },
  methods: {
    reset() {
      
    },
    squareClasses(rowIndex, colIndex) {
      const classes = [];
      if ((rowIndex + colIndex) % 2 === 0) {
        classes.push('light-square');
      } else {
        classes.push('dark-square');
      }
      if (this.selectedSquare && this.selectedSquare[0] === rowIndex && this.selectedSquare[1] === colIndex) {
        classes.push('selected');
      }
      return classes; 
    },
    movePiece(rowIndex, colIndex) {
      if (this.selectedSquare) {
        const [selectedRow, selectedCol] = this.selectedSquare;
        this.board[selectedRow][selectedCol] = null;
        this.board[rowIndex][colIndex] = 'P';
        this.selectedSquare = null;
      } else {
        this.selectedSquare = [rowIndex, colIndex];
      }
    },
    isValidMove(fromRow, fromCol, toRow, toCol) {
      const piece = this.board[fromRow][fromCol];
      switch (piece) {
        case "pawn":
          // Pawn move logic here
          break;
        case "rook":
          // Rook move logic here
          break;
        case "knight":
          // Knight move logic here
          break;
        case "bishop":
          // Bishop move logic here
          break;
        case "queen":
          // Queen move logic here
          break;
        case "king":
          // King move logic here
          break;
        default:
          return false;
      }
      return true;
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
