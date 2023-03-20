<template>
  <div ref="child" class="chess-board">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="chess-row">
      <div v-for="(col, colIndex) in row" :key="colIndex" class="chess-col">
        <div :class="['box', { 'selected': isSelected(rowIndex, colIndex) }]" @click="clickPiece(rowIndex, colIndex)">
          <ChessPiece v-if="col" :class="col.color" :type="col.type" :color="col.color" />
          <div :class="{ 'available': isAvailable(rowIndex, colIndex) }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChessPiece from './ChessPiece.vue';
import { mapState } from 'vuex'

export default {
  components: {
    ChessPiece,
  },
  data() {
    return {
      size: 8,
      pieces: {
        pawn: 'pawn',
        rook: 'rook',
        knight: 'knight',
        bishop: 'bishop',
        queen: 'queen',
        king: 'king'
      },
      colors: {
        white: 'white',
        black: 'black'
      },
      board: {},
    };
  },
  computed: {
    ...mapState(['selectedStatus', 'validMoves']),
  },
  created() {
    this.initialBoardState();
  },
  mounted() {
    // 取消選取
    // window.addEventListener('click', (event) => {
    //     // console.log(event.target.classList);
    //     // console.log(event.target.className);
    //     if (
    //         // 點擊棋盤且無棋子
    //         (  
    //             event.target.className !==  'available' &&
    //             event.target.children.length === 0
    //         ) || 
    //         // 點擊棋盤以外的地方
    //         (
    //             !event.target.classList.contains('box') &&
    //             event.target.tagName !== 'svg' &&
    //             event.target.tagName !== 'path'
    //         ) 
    //         ) {
    //         this.selectedStatus.piece = null;
    //         this.selectedStatus.position = null;
    //         this.selectedStatus.validMoves = [];
    //     }
    // });
  },
  methods: {
    initialBoardState() {
      // 初始化棋盤
      for (let row = 0; row < this.size; row++) {
        this.board[row] = [];
        for (let col = 0; col < this.size; col++) {
          this.board[row][col] = null;
        }
      }
      // 初始化黑方棋子
      this.board[0][0] = { type: this.pieces.rook, color: this.colors.black };
      this.board[0][1] = { type: this.pieces.knight, color: this.colors.black };
      this.board[0][2] = { type: this.pieces.bishop, color: this.colors.black };
      this.board[0][3] = { type: this.pieces.queen, color: this.colors.black };
      this.board[0][4] = { type: this.pieces.king, color: this.colors.black };
      this.board[0][5] = { type: this.pieces.bishop, color: this.colors.black };
      this.board[0][6] = { type: this.pieces.knight, color: this.colors.black };
      this.board[0][7] = { type: this.pieces.rook, color: this.colors.black };
      for (let col = 0; col < this.size; col++) {
        this.board[1][col] = { type: this.pieces.pawn, color: this.colors.black };
      }
      // 初始化白方棋子
      this.board[7][0] = { type: this.pieces.rook, color: this.colors.white };
      this.board[7][1] = { type: this.pieces.knight, color: this.colors.white };
      this.board[7][2] = { type: this.pieces.bishop, color: this.colors.white };
      this.board[7][3] = { type: this.pieces.queen, color: this.colors.white };
      this.board[7][4] = { type: this.pieces.king, color: this.colors.white };
      this.board[7][5] = { type: this.pieces.bishop, color: this.colors.white };
      this.board[7][6] = { type: this.pieces.knight, color: this.colors.white };
      this.board[7][7] = { type: this.pieces.rook, color: this.colors.white };
      for (let col = 0; col < this.size; col++) {
        this.board[6][col] = { type: this.pieces.pawn, color: this.colors.white };
      }
    },
    clickPiece(row, col) {
      row = parseInt(row);
      col = parseInt(col);

      if (this.board[row][col] === null) {
        return;
      }

      this.$store.commit('setSelectedStatus', {
        piece: this.board[row][col],
        position: { row, col }
      })
      this.$store.commit('setValidMoves', this.getAvailableMoves());
    },
    isSelected(row, col) {
      if (this.selectedStatus.position) {
        return this.selectedStatus.position.row == row && this.selectedStatus.position.col == col;
      }
      return false;
    },
    isAvailable(row, col) {
      for (let dir of this.validMoves) {
        if (dir.row == row && dir.col == col) {
          return true;
        }
      }
    },
    // 定義一個方法來判斷一個棋子是否可以移動到指定的位置
    // canMoveTo(row, col) {
    //     // 檢查該位置是否超出棋盤邊界
    //     if (row < 0 || col < 0 || row >= this.size || col >= this.size) {
    //         return false
    //     }
    //     // 檢查該位置是否已經有一個棋子
    //     const pieceAtDestination = this.pieces.find(p => p.row === row && p.col === col)
    //     if (pieceAtDestination) {
    //         return false
    //     }
    //     return true;
    // },
    // 移動棋子
    movePiece(row, col) {
      // 檢查該位置是否可以移動
      if (!this.canMoveTo(row, col)) {
        return
      }
      // 移動棋子
      this.selectedStatus.piece.row = row
      this.selectedStatus.piece.col = col
      // 取消選取
      this.selectedStatus.piece = null
      this.selected = null
    },
    // 定義棋子可以移動的範圍
    getAvailableMoves() {
      let type = this.selectedStatus.piece.type;
      let x = this.selectedStatus.position.col;
      let y = this.selectedStatus.position.row;

      // 檢查選取棋子類型
      switch (type) {
        case this.pieces.king:
          return this.getAvailableMovesForKing(x, y);
        case this.pieces.queen:
          return this.getAvailableMovesForQueen(x, y);
        case this.pieces.rook:
          return this.getAvailableMovesForRook(x, y);
        case this.pieces.knight:
          return this.getAvailableMovesForKnight(x, y);
        case this.pieces.bishop:
          return this.getAvailableMovesForBishop(x, y);
        case this.pieces.pawn:
          return this.getAvailableMovesForPawn(x, y);
        default:
          return [];
      }
    },
    getAvailableMovesForPawn(x, y) {
      const dirs = [[0, 1], [0, 2], [0, -1], [0, -2], [1, 1], [-1, 1], [1, -1], [-1, -1]];
      let moves = [];
      let color = this.selectedStatus.piece.color;

      for (let dir of dirs) {
        // 計算座標
        let nx = x + dir[0];
        let ny = y + dir[1];

        // 檢查是否可以移動
        let canMove = true;

        // console.log(nx);
        // console.log(ny);

        // 檢查是否在棋盤範圍內
        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
          // 獲取目標棋子
          let target = this.board[ny][nx];

          // 步數為2時，檢查是否第一次移動
          if (Math.abs(dir[1]) == 2) {
            if (color == 'white' && y != 6) {
              canMove = false;
            }
            if (color == 'black' && y != 1) {
              canMove = false;
            }
          }

          // 檢查目標方格是否為空或異色
          if (target == null || target.color != color) {
            // 檢查是否為吃子
            if (Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1) {
              if (target != null) {
                moves.push({ row: ny, col: nx });
              }
            } else {
              // 檢查是否可以移動
              if (canMove) {
                moves.push({ row: ny, col: nx });
              }
            }
          }
        }
      }

      // console.log(moves);
      return moves;
    },
    // 定義王可以移動的範圍
    getAvailableMovesForKing() {
      const moves = []
      // 檢查王是否可以向上移動
      if (this.canMoveTo(this.selectedStatus.piece.row - 1, this.selectedStatus.piece.col)) {
        moves.push({ row: this.selectedStatus.piece.row - 1, col: this.selectedStatus.piece.col })
      }
      // 檢查王是否可以向右上移動
      if (this.canMoveTo(this.selectedStatus.piece.row - 1, this.selectedStatus.piece.col + 1)) {
        moves.push({ row: this.selectedStatus.piece.row - 1, col: this.selectedStatus.piece.col + 1 })
      }
      // 檢查王是否可以向右移動
      if (this.canMoveTo(this.selectedStatus.piece.row, this.selectedStatus.piece.col + 1)) {
        moves.push({ row: this.selectedStatus.piece.row, col: this.selectedStatus.piece.col + 1 })
      }
      // 檢查王是否可以向右下移動
      if (this.canMoveTo(this.selectedStatus.piece.row + 1, this.selectedStatus.piece.col + 1)) {
        moves.push({ row: this.selectedStatus.piece.row + 1, col: this.selectedStatus.piece.col + 1 })
      }
      // 檢查王是否可以向下移動
      if (this.canMoveTo(this.selectedStatus.piece.row + 1, this.selectedStatus.piece.col)) {
        moves.push({ row: this.selectedStatus.piece.row + 1, col: this.selectedStatus.piece.col })
      }
      // 檢查王是否可以向左下移動
      if (this.canMoveTo(this.selectedStatus.piece.row + 1, this.selectedStatus.piece.col - 1)) {
        moves.push({ row: this.selectedStatus.piece.row + 1, col: this.selectedStatus.piece.col - 1 })
      }
      // 檢查王是否可以向左移動
      if (this.canMoveTo(this.selectedStatus.piece.row, this.selectedStatus.piece.col - 1)) {
        moves.push({ row: this.selectedStatus.piece.row, col: this.selectedStatus.piece.col - 1 })
      }
      // 檢查王是否可以向左上移動
      if (this.canMoveTo(this.selectedStatus.piece.row - 1, this.selectedStatus.piece.col - 1)) {
        moves.push({ row: this.selectedStatus.piece.row - 1, col: this.selectedStatus.piece.col - 1 })
      }
      return moves
    },
    // 定義王后可以移動的範圍

  },
  // watch: {
  //   parentPiece(selectPieceObj) {
  //     this.selectedStatus.position = selectPieceObj.position;
  //     this.selectedStatus.piece = selectPieceObj.piece;
  //     this.selectedStatus.validMoves = selectPieceObj.validMoves;
  //   }
  // }
};
</script>
<style scoped>
.selected {
  background-color: #e0872f98;
}

/* 棋盤最外層樣式 */
.chess-board {
  display: flex;
  flex-wrap: wrap;
  width: 800px;
  /* 可以自行調整 */
  height: 800px;
  margin: auto;
  border: 1rem solid rgb(239, 183, 160);
  /* 可以自行調整 */
  /* background-color: #e0872f98; */
}

/* 水平網格 */
.chess-row {
  display: flex;
  width: 100%;
}

/* 垂直網格 */
.chess-col {
  box-sizing: border-box;
  width: 12.5%;
  height: 0;
  padding-bottom: 12.5%;
  position: relative;
}

/* 格子樣式 */
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chess-row:nth-of-type(odd) .chess-col:nth-child(odd) {
  background-color: rgb(210, 154, 129);
}

.chess-row:nth-of-type(odd) .chess-col:nth-child(even) {
  background-color: rgb(152, 123, 103);
}

.chess-row:nth-of-type(even) .chess-col:nth-child(odd) {
  background-color: rgb(152, 123, 103);
}

.chess-row:nth-of-type(even) .chess-col:nth-child(even) {
  background-color: rgb(210, 154, 129);
}

/* 響應 */
@media (max-width: 800px) {
  .chess-board {
    width: 600px;
    height: 600px;
  }
}

@media (max-width: 600px) {
  .chess-board {
    width: 400px;
    height: 400px;
  }
}

/* 可移動空格樣式 */
.available {
  width: 50px;
  height: 50px;
  background-color: #e5d7cbab;
  border-radius: 50%;
}
</style>
