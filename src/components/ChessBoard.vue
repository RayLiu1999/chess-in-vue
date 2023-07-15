<template>
  <div ref="child" class="chess-board">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="chess-row">
      <div v-for="(col, colIndex) in row" :key="colIndex" class="chess-col">
        <div :class="['box', { 'selected': classSelected(rowIndex, colIndex) }]" @click="clickPiece(rowIndex, colIndex)">
          <ChessPiece v-if="col" :class="col.color" :type="col.type" :color="col.color" />
          <div :class="{
            'canMove': col == null && classMove(rowIndex, colIndex),
            'canEat': col != null && classMove(rowIndex, colIndex)
          }
          ">
          </div>
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
      whoesTurn: 'white',
    };
  },
  computed: {
    ...mapState(['selectedStatus', 'validMoves']),
  },
  created() {
    this.initialBoardState();
  },
  mounted() {
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

      // 選擇旗子
      if (
        // 有點到棋子，無選擇棋子狀態
        this.board[row][col] != null && !this.isSelected() ||
        // 有點到棋子，有選擇棋子狀態，且點到同色棋子
        (
          this.board[row][col] != null &&
          this.isSelected() && 
          this.board[row][col].color == this.selectedStatus.piece.color
        )
        ) {

        // 判斷回合
        switch (this.whoesTurn) {
          case 'white':
            if (this.board[row][col].color == 'black') {
              return;
            }
            break;
          case 'black':
            if (this.board[row][col].color == 'white') {
              return;
            }
            break;
        }

        // 加入選中狀態
        this.$store.commit('setSelectedStatus', {
          piece: this.board[row][col],
          position: { row, col }
        })
        
        this.$store.commit('setValidMoves', this.getAvailableMoves({ row, col }, this.board[row][col]));
      }
      else if (this.isSelected() && this.canMove()) {
        // 移動棋子
        for (let dir of this.validMoves) {
          if (dir.row == row && dir.col == col) {
            this.board[this.selectedStatus.position.row][this.selectedStatus.position.col] = null;
            this.board[row][col] = this.selectedStatus.piece;
            this.selectedStatus.position = { row, col };
            console.log(this.selectedStatus.position);
            if (this.checkWin()) {
              alert(this.whoesTurn + 'win!');
              return;
            }
            this.cleanSelected();
            this.whoesTurn = this.whoesTurn == 'white' ? 'black' : 'white';
          }
        }
      }
      else if (this.isSelected()) {
        this.cleanSelected();
      }
    },
    // 選取狀態
    isSelected() {
      return Object.keys(this.selectedStatus.piece).length > 0;
    },
    // 可移動狀態
    canMove() {
      return this.validMoves.length > 0;
    },
    // 清除選中狀態
    cleanSelected() {
      this.$store.commit('setSelectedStatus', {
        piece: {},
        position: {}
      })
      this.$store.commit('setValidMoves', []);
    },
    // 判斷是否為有效選中(className用)
    classSelected(row, col) {
      if (this.selectedStatus.position) {
        return this.selectedStatus.position.row == row && this.selectedStatus.position.col == col;
      }
      return false;
    },
    // 判斷是否為有效移動(className用)
    classMove(row, col) {
      for (let dir of this.validMoves) {
        if (dir.row == row && dir.col == col) {
          return true;
        }
      }
      return false;
    },
    // 定義棋子可以移動的範圍
    getAvailableMoves(position, piece) {
      let x = position.col;
      let y = position.row;
      let color = piece.color;
      let type = piece.type;

      // 檢查選取棋子類型
      switch (type) {
        case this.pieces.king:
          return this.getAvailableMovesForKing(x, y, color);
        case this.pieces.queen:
          return this.getAvailableMovesForQueen(x, y, color);
        case this.pieces.rook:
          return this.getAvailableMovesForRook(x, y, color);
        case this.pieces.knight:
          return this.getAvailableMovesForKnight(x, y, color);
        case this.pieces.bishop:
          return this.getAvailableMovesForBishop(x, y, color);
        case this.pieces.pawn:
          return this.getAvailableMovesForPawn(x, y, color);
        default:
          return [];
      }
    },
    // 定義士兵可以移動的範圍
    getAvailableMovesForPawn(x, y, color) {
      let dirs = null;
      const blackDirs = [[0, 1], [0, 2], [1, 1], [-1, 1]];
      const whiteDirs = [[0, -1], [0, -2], [1, -1], [-1, -1]];
      let moves = [];

      // 檢查顏色
      if (color == 'black') {
        dirs = blackDirs;
      }
      else if (color == 'white') {
        dirs = whiteDirs;
      }

      // 檢查每個方向
      for (let dir of dirs) {
        // 計算座標
        let nx = x + dir[0];
        let ny = y + dir[1];

        // 檢查是否可以移動
        let canMove = true;

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

          // 檢查是否為吃子
          if (Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1) {
            if (target != null && target.color != color) {
              moves.push({ row: ny, col: nx });
              continue;
            } 
            else {
              canMove = false;
            }
          }
          // 檢查前方有異色棋子時，不能移動
          else if (Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 && target != null) {
            canMove = false;
          }
          // 移動兩步時，前方兩格都要檢查
          else if (Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 2) {
            if (target != null || this.board[ny - 1][nx] != null) {
              canMove = false;
            }
          }
          
          // 檢查是否可以移動
          if (canMove) {
            moves.push({ row: ny, col: nx });
          }
        }
      }

      return moves;
    },
    // 定義主教可以移動的範圍
    getAvailableMovesForBishop(x, y, color) {
      const dirs = [[1, 1], [-1, 1], [1, -1], [-1, -1]]; // 定義方向
      let moves = [];

      // 檢查每個方向
      for (let dir of dirs) {
        // 計算座標
        let nx = x;
        let ny = y;

        // 檢查是否可以移動
        let canMove = true;

        while (canMove) {
          nx += dir[0];
          ny += dir[1];

          if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
            // 獲取目標棋子
            let target = this.board[ny][nx];

            // 檢查目標方格是否為空或異色
            if (target == null || target.color != color) {
              moves.push({ row: ny, col: nx });
            }

            // 檢查目標方格是否為空
            if (target != null) {
              canMove = false;
            }
          } else {
            canMove = false;
          }
        }
      }

      return moves;
    },
    // 定義騎士可以移動的範圍
    getAvailableMovesForKnight(x, y, color) {
      const dirs = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]; // 定義方向
      let moves = [];

      // 檢查每個方向
      for (let dir of dirs) {
        // 計算座標
        let nx = x + dir[0];
        let ny = y + dir[1];

        // 檢查是否可以移動
        let canMove = true;

        // 檢查是否在棋盤範圍內
        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
          // 獲取目標棋子
          let target = this.board[ny][nx];

          // 檢查目標方格是否為空或異色
          if (target == null || target.color != color) {
            moves.push({ row: ny, col: nx });
          }
        }
      }

      return moves;
    },
    // 定義車可以移動的範圍
    getAvailableMovesForRook(x, y, color) {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // 定義方向
      let moves = [];

      // 檢查每個方向
      for (let dir of dirs) {
        // 計算座標
        let nx = x;
        let ny = y;

        // 檢查是否可以移動
        let canMove = true;

        while (canMove) {
          nx += dir[0];
          ny += dir[1];

          if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
            // 獲取目標棋子
            let target = this.board[ny][nx];

            // 檢查目標方格是否為空或異色
            if (target == null || target.color != color) {
              moves.push({ row: ny, col: nx });
            }

            // 檢查目標方格是否為空
            if (target != null) {
              canMove = false;
            }
          } else {
            canMove = false;
          }
        }
      }

      return moves;
    },
    // 定義皇后可以移動的範圍
    getAvailableMovesForQueen(x, y, color) {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]; // 定義方向
      let moves = [];

      // 檢查每個方向
      for (let dir of dirs) {
        // 計算座標
        let nx = x;
        let ny = y;

        // 檢查是否可以移動
        let canMove = true;

        while (canMove) {
          nx += dir[0];
          ny += dir[1];

          if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
            // 獲取目標棋子
            let target = this.board[ny][nx];

            // 檢查目標方格是否為空或異色
            if (target == null || target.color != color) {
              moves.push({ row: ny, col: nx });
            }

            // 檢查目標方格是否為空
            if (target != null) {
              canMove = false;
            }
          } else {
            canMove = false;
          }
        }
      }

      return moves;
    },
    // 定義王可以移動的範圍
    getAvailableMovesForKing(x, y, color) {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]; // 定義方向
      let moves = [];

      // 檢查每個方向
      for (let dir of dirs) {
        // 計算座標
        let nx = x + dir[0];
        let ny = y + dir[1];

        // 檢查是否可以移動
        let canMove = true;

        // 檢查是否在棋盤範圍內
        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
          // 獲取目標棋子
          let target = this.board[ny][nx];

          // 檢查目標方格是否為空或異色
          if (target == null || target.color != color) {
            moves.push({ row: ny, col: nx });
          }
        }
      }

      return moves;
    },
    // 判斷輸贏
    checkWin() {
      // 獲取對方顏色
      let color = this.whoesTurn == "white" ? "black" : "white";

      // 獲取對方王的位置
      let kingPosition = this.findKing(color);

      // 獲取對方王可以移動的範圍
      let Kingmoves = this.getAvailableMoves(kingPosition, { type: "king", color: color });

      // 獲取移動後棋子可移動範圍
      let pieceMoves = this.getAvailableMoves(this.selectedStatus.position, this.selectedStatus.piece);

      // 是否成功將軍
      let check = false;

      // 檢查當下移動的棋子是否可以吃掉王
      console.log(pieceMoves);
      pieceMoves.some((move) => {
        if (move.row == kingPosition.row && move.col == kingPosition.col) {
          check = true;
        }
      });

      if (check == false) {
        return false;
      }

      check = false;
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          let piece = this.board[row][col];

          // 判斷對方是否可以吃掉我方移動後的棋子
          if (piece != null && piece.color == color) {
            let moves = this.getAvailableMoves({ row: row, col: col }, piece);

            if (moves.some((move) => move.row == this.selectedStatus.position.row && move.col == this.selectedStatus.position.col)) {
              return false;
            }
          }

          // 判斷對方國王移動範圍是否都在我方任何棋的吃棋範圍內
          if (piece != null && piece.color != color) {
            let moves = this.getAvailableMoves({ row: row, col: col }, piece);

            // 有符合國王移動範圍就把國王移動範圍過濾掉
            moves.some((move) => {
              Kingmoves = Kingmoves.filter((kingMove) => {
                if (kingMove.row == move.row && kingMove.col == move.col) {
                  console.log(move.row, move.col);
                  return false;
                }
                return true;
              });
            });
          }
        }
      }

      // 如果國王移動範圍為空，則表示對方無法移動，判斷為輸
      if (Kingmoves.length == 0) {
        return true;
      }
      
      return check;
    },
    findKing(color) {
      // 獲取王的位置
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          let piece = this.board[row][col];

          if (piece != null && piece.type == "king" && piece.color == color) {
            return { row: row, col: col };
          }
        }
      }
    }
  }
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
.canMove {
  width: 50px;
  height: 50px;
  background-color: #e5d7cbab;
  border-radius: 50%;
}

.canEat {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 10px solid #cccccc54;
}

/* .::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 10px solid #f00;
} */
</style>
