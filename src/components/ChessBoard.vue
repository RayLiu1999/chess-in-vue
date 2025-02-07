<template>
  <div ref="child" class="chess-board">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="chess-row">
      <!-- {{ Math.abs(8 - parseInt(rowIndex)) }} -->
      <div v-for="(col, colIndex) in row" :key="colIndex" class="chess-col">
        <div
          :class="['box', { selected: classSelected(parseInt(rowIndex), parseInt(colIndex)) }]"
          @click="clickPiece(parseInt(rowIndex), parseInt(colIndex))">
          <ChessPiece v-if="col" :class="col.color" :type="col.type" :color="col.color" />
          <div
            :class="{
              canMove: col === null && classMove(parseInt(rowIndex), parseInt(colIndex)),
              canEat: col != null && classMove(parseInt(rowIndex), parseInt(colIndex)),
            }">
            <!-- {{ word(parseInt(rowIndex), parseInt(colIndex)) }} -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import ChessPiece from './ChessPiece.vue';
import stockfishService from '@/services/stockfish.service';

export default {
  components: {
    ChessPiece,
  },
  data() {
    return {
      size: 8,
      pieces: {
        pawn: 'Pawn',
        rook: 'Rook',
        knight: 'Knight',
        bishop: 'Bishop',
        queen: 'Queen',
        king: 'King',
      },
      colors: {
        white: 'white',
        black: 'black',
      },
      board: {},
      whoesTurn: 'white',
      stockfishReady: false, // Stockfish狀態
      colToWord: {
        0: 'a',
        1: 'b',
        2: 'c',
        3: 'd',
        4: 'e',
        5: 'f',
        6: 'g',
        7: 'h',
      },
      wordToCol: {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6,
        h: 7,
      },
    };
  },
  computed: {
    ...mapState(['selectedStatus', 'validMoves', 'round']),
  },
  created() {
    this.initialBoardState();
  },
  async mounted() {
    try {
      console.log('正在初始化Stockfish引擎...');
      await stockfishService.init();
      this.stockfishReady = true;
      console.log('Stockfish引擎初始化成功');
    } catch (error) {
      console.error('Stockfish引擎初始化失敗:', error);
    }
  },
  beforeUnmount() {
    stockfishService.destroy();
  },
  methods: {
    word(rowIndex, colIndex) {
      const intRowIndex = parseInt(rowIndex, 10);
      if (intRowIndex === 7) {
        return this.colToWord[colIndex];
      }
      return '';
    },
    // async chatWithFunctionCalling() {
    //   const API_KEY = import.meta.env.VITE_OPEN_API_KEY;
    //   const API_URL = 'https://api.openai.com/v1/chat/completions';

    //   const chatMessages = [
    //     {
    //       role: 'user',
    //       content: "What's the weather like in Boston?",
    //     },
    //   ];

    //   const functions = [
    //     {
    //       name: 'get_current_weather',
    //       description: 'Get the current weather in a given location',
    //       parameters: {
    //         type: 'object',
    //         properties: {
    //           location: {
    //             type: 'string',
    //             description: 'The city and state, e.g. San Francisco, CA',
    //           },
    //           unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
    //         },
    //         required: ['location'],
    //       },
    //     },
    //   ];

    //   const response = await axios.post(
    //     API_URL,
    //     {
    //       // model: 'gpt-3.5-turbo-0613',
    //       // model: 'gpt-4-0613',
    //       model: 'gpt-4-1106-preview',
    //       messages: chatMessages,
    //       functions,
    //       function_call: 'auto',
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${API_KEY}`,
    //       },
    //     },
    //   );

    //   const responseData = response.data;
    //   console.log(responseData.choices[0].message);
    //   console.log(responseData.choices[0].message.function_call);

    //   if (responseData.function_calls && responseData.function_calls.length > 0) {
    //     const functionCall = responseData.function_calls[0];
    //     if (functionCall.name === 'tell_joke') {
    //       console.log('Telling a joke...');
    //       // Call your tell_joke function here
    //     }
    //   }
    // },
    setNotation(originPosition, isEat) {
      const { col } = this.selectedStatus.position;
      const { row } = this.selectedStatus.position;
      const { round } = this;
      let piece = this.selectedStatus.piece.type;
      const targetPostion = this.convertToAlgebraicNotation(row, col);
      const action = isEat ? 'x' : '';

      if (piece === this.pieces.pawn) piece = '';
    },
    initialBoardState() {
      // 初始化棋盤
      for (let row = 0; row < this.size; row += 1) {
        this.board[row] = [];
        for (let col = 0; col < this.size; col += 1) {
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
      for (let col = 0; col < this.size; col += 1) {
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
      for (let col = 0; col < this.size; col += 1) {
        this.board[6][col] = { type: this.pieces.pawn, color: this.colors.white };
      }
    },
    // 移動棋子
    movePiece(
      col,
      row,
      originCol = this.selectedStatus.position.col,
      originRow = this.selectedStatus.position.row,
    ) {
      const originPiece = this.board[originRow][originCol];
      const targetPiece = this.board[row][col];
      const isEat = targetPiece !== null;

      // 判斷移動是否合法
      this.validMoves.forEach((vaildDir) => {
        if (vaildDir.row === row && vaildDir.col === col) {
          // 移動棋子
          this.board[originRow][originCol] = null;
          this.board[row][col] = originPiece;
          this.selectedStatus.position = { row, col };

          // 判斷輸贏
          if (this.checkWin()) {
            alert(`${originPiece.color === 'white' ? '白方' : '黑方'}勝利！，請刷新頁面重玩。`);
            return;
          }

          if (this.whoesTurn === 'white') {
            const originPosition = this.convertToAlgebraicNotation(originRow, originCol);
            this.setNotation(originPosition, isEat);
            this.whoesTurn = 'black';
            // 在玩家（白方）移動後，觸發 AI（黑方）走子
            this.$nextTick(() => {
              this.makeAIMove();
            });
          } else if (this.whoesTurn === 'black') {
            this.$store.commit('addRound');
            this.whoesTurn = 'white';
          }

          this.cleanSelected();
        }
      });
    },
    // 點擊棋子
    clickPiece(row, col) {
      // 如果是 AI 的回合（黑色方），不允許玩家操作
      if (this.whoesTurn === 'black' && this.board[row][col]?.color !== 'black') {
        return;
      }

      // 選擇旗子
      if (
        // 有點到棋子，無選擇棋子狀態
        (
          this.board[row][col] != null && !this.isSelected()
        )
        // 有點到棋子，有選擇棋子狀態，且點到同色棋子
        || (
          this.board[row][col] != null
          && this.isSelected()
          && this.board[row][col].color === this.selectedStatus.piece.color
        )
      ) {
        // 只允許移動當前回合方的棋子
        if (this.board[row][col].color !== this.whoesTurn) {
          return;
        }

        // 加入選中狀態
        this.$store.commit('setSelectedStatus', {
          piece: this.board[row][col],
          position: { row, col },
        });

        this.$store.commit('setValidMoves', this.getAvailableMoves(col, row));
      } else if (this.isSelected() && this.canMove()) {
        // 移動棋子
        this.movePiece(col, row);
      } else if (this.isSelected()) {
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
        position: {},
      });
      this.$store.commit('setValidMoves', []);
    },
    // 判斷是否為有效選中(className用)
    classSelected(row, col) {
      if (this.selectedStatus.position) {
        return this.selectedStatus.position.row === row && this.selectedStatus.position.col === col;
      }
      return false;
    },
    // 判斷是否為有效移動(className用)
    classMove(row, col) {
      let canMove = false;
      // 檢查是否有選中的棋子
      if (!this.selectedStatus.piece) {
        return false;
      }
      
      // 檢查目標位置的棋子
      const targetPiece = this.board[row][col];
      // 如果目標位置有棋子且顏色相同，則不顯示移動樣式
      if (targetPiece && targetPiece.color === this.selectedStatus.piece.color) {
        return false;
      }

      // 檢查是否在有效移動列表中
      this.validMoves.forEach((dir) => {
        if (dir.row === row && dir.col === col) {
          // 如果是國王，需要額外檢查目標位置是否安全
          if (this.selectedStatus.piece.type === this.pieces.king) {
            canMove = !this.isSquareUnderAttack(row, col, this.selectedStatus.piece.color);
          } else {
            canMove = true;
          }
        }
      });

      return canMove;
    },
    // 定義棋子可以移動的範圍
    getAvailableMoves(col, row) {
      const piece = this.board[row][col];
      const { type } = piece;

      // 檢查選取棋子類型
      switch (type) {
        case this.pieces.king:
          return this.getAvailableMovesForKing(col, row);
        case this.pieces.queen:
          return this.getAvailableMovesForQueen(col, row);
        case this.pieces.rook:
          return this.getAvailableMovesForRook(col, row);
        case this.pieces.knight:
          return this.getAvailableMovesForKnight(col, row);
        case this.pieces.bishop:
          return this.getAvailableMovesForBishop(col, row);
        case this.pieces.pawn:
          return this.getAvailableMovesForPawn(col, row);
        default:
          // 處理未知的棋子類型
          console.warn(`未知的棋子類型: ${piece.type}`);
          return [];
      }
    },
    // 定義士兵可以移動的範圍
    getAvailableMovesForPawn(col, row) {
      const { color } = this.board[row][col];
      let directions = null;
      const blackDirections = [
        { dx: 0, dy: 1 }, { dx: 0, dy: 2 },
        { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
      ];
      const whiteDirections = [
        { dx: 0, dy: -1 }, { dx: 0, dy: -2 },
        { dx: 1, dy: -1 }, { dx: -1, dy: -1 },
      ];
      const moves = [];

      // 檢查顏色
      if (color === 'black') {
        directions = blackDirections;
      } else if (color === 'white') {
        directions = whiteDirections;
      }

      // 檢查每個方向
      directions.forEach(({ dx, dy }) => {
        // 計算座標
        const newCol = col + dx;
        const newRow = row + dy;

        // 檢查是否在棋盤範圍內
        if (this.isValidPosition(newCol, newRow)) {
          // 獲取目標棋子
          const targetPiece = this.board[newRow][newCol];

          // 步數為2時，檢查是否第一次移動
          if (Math.abs(dy) === 2) {
            if (color === 'white' && row !== 6) {
              return;
            }
            if (color === 'black' && row !== 1) {
              return;
            }
          }

          // 檢查是否為吃子
          if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
            if (targetPiece === null || targetPiece.color === color) {
              return;
            }
          } else if (Math.abs(dx) === 0 && Math.abs(dy) === 1 && targetPiece != null) {
            // 檢查前方有異色棋子時，不能移動
            return;
          } else if (Math.abs(dx) === 0 && Math.abs(dy) === 2) {
            // 移動兩步時，先檢查目標位置是否有棋子
            if (targetPiece != null) {
              if (color === 'white' && this.board[newRow + 1][newCol] != null) {
                return;
              }

              if (color === 'black' && this.board[newRow - 1][newCol] != null) {
                return;
              }
            }
          }

          // 加入可以移動的座標
          moves.push({ row: newRow, col: newCol });
        }
      });

      return moves;
    },
    // 定義主教可以移動的範圍
    getAvailableMovesForBishop(col, row) {
      const { color } = this.board[row][col];
      const directions = [
        { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
        { dx: 1, dy: -1 }, { dx: -1, dy: -1 },
      ];
      const moves = [];

      // 檢查每個方向
      directions.forEach(({ dx, dy }) => {
        let newCol = col;
        let newRow = row;
        let canMove = true;

        while (canMove) {
          newCol += dx;
          newRow += dy;

          if (this.isValidPosition(newCol, newRow)) {
            // 獲取目標棋子
            const targetPiece = this.board[newRow][newCol];

            // 檢查目標方格是否為空或異色
            if (targetPiece === null || targetPiece.color !== color) {
              moves.push({ row: newRow, col: newCol });
            }

            // 檢查目標方格是否為空
            if (targetPiece != null) {
              canMove = false;
            }
          } else {
            canMove = false;
          }
        }
      });

      return moves;
    },
    // 定義騎士可以移動的範圍
    getAvailableMovesForKnight(col, row) {
      const { color } = this.board[row][col];
      const directions = [
        { dx: 1, dy: 2 }, { dx: -1, dy: 2 },
        { dx: 1, dy: -2 }, { dx: -1, dy: -2 },
        { dx: 2, dy: 1 }, { dx: -2, dy: 1 },
        { dx: 2, dy: -1 }, { dx: -2, dy: -1 },
      ];
      const moves = [];

      // 檢查每個方向
      directions.forEach(({ dx, dy }) => {
        // 計算座標
        const newCol = col + dx;
        const newRow = row + dy;

        // 檢查是否在棋盤範圍內
        if (this.isValidPosition(newCol, newRow)) {
          // 獲取目標棋子
          const targetPiece = this.board[newRow][newCol];

          // 檢查目標方格是否為空或異色
          if (targetPiece === null || targetPiece.color !== color) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      });

      return moves;
    },
    // 定義車可以移動的範圍
    getAvailableMovesForRook(col, row) {
      const { color } = this.board[row][col];
      const directions = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
      ];
      const moves = [];

      // 檢查每個方向
      directions.forEach(({ dx, dy }) => {
        let newCol = col;
        let newRow = row;
        let canMove = true;

        while (canMove) {
          newCol += dx;
          newRow += dy;

          if (this.isValidPosition(newCol, newRow)) {
            // 獲取目標棋子
            const targetPiece = this.board[newRow][newCol];

            // 檢查目標方格是否為空或異色
            if (targetPiece === null || targetPiece.color !== color) {
              moves.push({ row: newRow, col: newCol });
            }

            // 檢查目標方格是否為空
            if (targetPiece != null) {
              canMove = false;
            }
          } else {
            canMove = false;
          }
        }
      });

      return moves;
    },
    // 定義皇后可以移動的範圍
    getAvailableMovesForQueen(col, row) {
      const { color } = this.board[row][col];
      const directions = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
        { dx: 1, dy: -1 }, { dx: -1, dy: -1 },
      ];
      const moves = [];

      // 檢查每個方向
      directions.forEach(({ dx, dy }) => {
        let newCol = col;
        let newRow = row;
        let canMove = true;

        while (canMove) {
          newCol += dx;
          newRow += dy;

          if (this.isValidPosition(newCol, newRow)) {
            // 獲取目標棋子
            const targetPiece = this.board[newRow][newCol];

            // 檢查目標方格是否為空或異色
            if (targetPiece === null || targetPiece.color !== color) {
              moves.push({ row: newRow, col: newCol });
            }

            // 檢查目標方格是否為空
            if (targetPiece != null) {
              canMove = false;
            }
          } else {
            canMove = false;
          }
        }
      });

      return moves;
    },
    // 定義王可以移動的範圍
    getAvailableMovesForKing(col, row) {
      const { color } = this.board[row][col];
      const directions = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
        { dx: 1, dy: -1 }, { dx: -1, dy: -1 },
      ];
      const moves = [];

      // 使用陣列方法替代for循環
      directions.forEach(({ dx, dy }) => {
        // 計算座標
        const newRow = row + dy;
        const newCol = col + dx;

        // 檢查是否在棋盤範圍內
        if (this.isValidPosition(newRow, newCol)) {
          // 獲取目標棋子
          const targetPiece = this.board[newRow][newCol];

          // 檢查目標位置是否為空或者是敵方棋子
          if (targetPiece === null || targetPiece.color !== color) {
            // 檢查目標位置是否安全（不在對方的攻擊範圍內）
            if (!this.isSquareUnderAttack(newRow, newCol, color)) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        }
      });

      return moves;
    },
    // 判斷輸贏(移動棋子後，切換回合前進行)
    checkWin() {
      // 獲取對方顏色
      const color = this.whoesTurn === 'white' ? 'black' : 'white';

      // 獲取對方王的位置
      const kingPosition = this.findKing(color);

      // 如果對方王不存在，遊戲結束
      if (!kingPosition) {
        return true; // 對方王不存在，對方輸贏
      }

      // 檢查國王是否被將軍
      const isKingInCheck = this.isSquareUnderAttack(kingPosition.row, kingPosition.col, color);

      if (!isKingInCheck) {
        return false; // 如果國王沒有被將軍，遊戲繼續
      }

      // 檢查是否是將死
      // 1. 檢查國王是否有安全的移動位置
      const kingMoves = this.getAvailableMovesForKing(kingPosition.col, kingPosition.row);
      if (kingMoves.length > 0) {
        return false; // 國王還可以移動，不是將死
      }

      // 2. 檢查其他棋子是否能解救國王
      for (let row = 0; row < this.size; row += 1) {
        for (let col = 0; col < this.size; col += 1) {
          const piece = this.board[row][col];
          if (piece && piece.color === color && piece.type !== this.pieces.king) {
            // 獲取這個棋子的所有可能移動
            const moves = this.getAvailableMoves(col, row);
            
            // 檢查每個可能的移動是否能解救國王
            if (!moves.some((move) => {
              // 暫存原始位置的棋子
              const originalPiece = this.board[move.row][move.col];
              const currentPiece = this.board[row][col];
              
              // 模擬移動
              this.board[row][col] = null;
              this.board[move.row][move.col] = currentPiece;
              
              // 檢查移動後國王是否安全
              const isSafe = !this.isSquareUnderAttack(kingPosition.row, kingPosition.col, color);

              // 還原棋盤
              this.board[row][col] = currentPiece;
              this.board[move.row][move.col] = originalPiece;
              
              return isSafe; // 如果找到安全的移動，some() 會返回 true，我們需要取反
            })) {
              return false; // 找到一個可以解救國王的移動，不是將死
            }
          }
        }
      }

      // 如果所有檢查都通過，確認是將死
      return true;
    },
    // 獲取王的位置
    findKing(color) {
      for (let row = 0; row < this.size; row += 1) {
        for (let col = 0; col < this.size; col += 1) {
          const piece = this.board[row][col];

          if (piece != null && piece.type === this.pieces.king && piece.color === color) {
            return { row, col };
          }
        }
      }
      return null;
    },
    // index轉換成棋盤座標
    convertToAlgebraicNotation(row, col) {
      return this.colToWord[col] + (8 - row);
    },
    // 棋盤座標轉換成index
    convertToAlgebraic(postion) {
      const col = postion[0];
      const row = postion[1];

      return {
        row: 8 - row,
        col: this.wordToCol[col],
      };
    },
    // 生成FEN格式棋盤狀態（用於Stockfish）
    generateFEN() {
      let fen = '';
      let emptyCount = 0;

      // 遍歷棋盤
      for (let row = 0; row < this.size; row += 1) {
        for (let col = 0; col < this.size; col += 1) {
          const piece = this.board[row][col];
          if (piece === null) {
            emptyCount += 1;
          } else {
            // 如果之前有空格，先加入數字
            if (emptyCount > 0) {
              fen += emptyCount;
              emptyCount = 0;
            }
            // 添加棋子符號
            let pieceSymbol = '';
            switch (piece.type) {
              case this.pieces.pawn:
                pieceSymbol = 'p';
                break;
              case this.pieces.rook:
                pieceSymbol = 'r';
                break;
              case this.pieces.knight:
                pieceSymbol = 'n';
                break;
              case this.pieces.bishop:
                pieceSymbol = 'b';
                break;
              case this.pieces.queen:
                pieceSymbol = 'q';
                break;
              case this.pieces.king:
                pieceSymbol = 'k';
                break;
              default:
                // 處理未知的棋子類型
                console.warn(`未知的棋子類型: ${piece.type}`);
                break;
            }
            // 白方用大寫
            if (piece.color === 'white') {
              pieceSymbol = pieceSymbol.toUpperCase();
            }
            fen += pieceSymbol;
          }
        }
        // 處理行尾的空格
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        // 除了最後一行，每行加上'/'
        if (row < this.size - 1) {
          fen += '/';
        }
      }

      // 添加當前回合方
      fen += ` ${this.whoesTurn === 'white' ? 'w' : 'b'}`;
      
      // 添加王車易位權限（這裡簡化處理）
      fen += ' KQkq';
      
      // 添加過路兵位置（這裡簡化處理）
      fen += ' -';
      
      // 添加半回合計數和全回合數
      fen += ' 0 1';

      return fen;
    },
    // 檢查位置是否在棋盤內
    isValidPosition(row, col) {
      if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
        return true;
      }

      return false;
    },
    // 檢查某個格子是否在對方的攻擊範圍內
    isSquareUnderAttack(row, col, kingColor) {
      // 檢查每個格子
      for (let checkRow = 0; checkRow < this.size; checkRow += 1) {
        for (let checkCol = 0; checkCol < this.size; checkCol += 1) {
          const piece = this.board[checkRow][checkCol];
          if (piece && piece.color !== kingColor) {
            // 獲取棋子的攻擊範圍
            let moves = [];
            switch (piece.type) {
              case this.pieces.queen:
                // 皇后的攻擊範圍和移動範圍相同
                moves = this.getAvailableMovesForQueen(checkCol, checkRow);
                break;
              case this.pieces.rook:
                // 車的攻擊範圍和移動範圍相同
                moves = this.getAvailableMovesForRook(checkCol, checkRow);
                break;
              case this.pieces.knight:
                // 騎士的攻擊範圍和移動範圍相同
                moves = this.getAvailableMovesForKnight(checkCol, checkRow);
                break;
              case this.pieces.bishop:
                // 主教的攻擊範圍和移動範圍相同
                moves = this.getAvailableMovesForBishop(checkCol, checkRow);
                break;
              case this.pieces.pawn:
                // 兵的攻擊範圍只有斜向
                const pawnAttackDirections = piece.color === 'black' 
                  ? [{ dx: 1, dy: 1 }, { dx: -1, dy: 1 }]  // 黑兵的攻擊方向
                  : [{ dx: 1, dy: -1 }, { dx: -1, dy: -1 }]; // 白兵的攻擊方向
                
                pawnAttackDirections.forEach(({ dx, dy }) => {
                  const newRow = checkRow + dy;
                  const newCol = checkCol + dx;
                  if (this.isValidPosition(newRow, newCol)) {
                    moves.push({ row: newRow, col: newCol });
                  }
                });
                break;
              case this.pieces.king:
                // 王的攻擊範圍和移動範圍相同（但不考慮是否安全）
                const kingDirections = [
                  { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
                  { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
                  { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
                  { dx: 1, dy: -1 }, { dx: -1, dy: -1 },
                ];
                kingDirections.forEach(({ dx, dy }) => {
                  const newRow = checkRow + dy;
                  const newCol = checkCol + dx;
                  if (this.isValidPosition(newRow, newCol)) {
                    moves.push({ row: newRow, col: newCol });
                  }
                });
                break;
              default:
                console.warn(`未知的棋子類型: ${piece.type}`);
                break;
            }

            // 檢查是否有任何移動可以到達目標格子
            if (moves.some((move) => move.row === row && move.col === col)) {
              return true; // 格子在攻擊範圍內
            }
          }
        }
      }
      return false; // 格子安全
    },
    // AI走棋
    async makeAIMove() {
      if (!this.stockfishReady) {
        console.error('Stockfish引擎未就緒');
        return;
      }

      try {
        // 生成當前局面的FEN
        const fen = this.generateFEN();
        // console.log('當前局面FEN:', fen);
        
        // 設置當前局面
        await stockfishService.setPosition(fen);
        
        // 獲取最佳走法
        const bestMove = await stockfishService.getBestMove(15); // 搜索深度15
        // console.log('Stockfish建議走法:', bestMove);

        if (bestMove && bestMove.length >= 4) {
          // 解析走法
          const fromSquare = this.parseSquare(bestMove.substring(0, 2));
          const toSquare = this.parseSquare(bestMove.substring(2, 4));
          
          // 為AI移動設置選中狀態
          this.$store.commit('setSelectedStatus', {
            piece: this.board[fromSquare.row][fromSquare.col],
            position: { row: fromSquare.row, col: fromSquare.col },
          });
          
          // 設置有效移動
          this.$store.commit('setValidMoves', [{
            row: toSquare.row,
            col: toSquare.col,
          }]);
          
          // 執行移動
          this.movePiece(toSquare.col, toSquare.row);
        }
      } catch (error) {
        console.error('AI走子時發生錯誤:', error);
      }
    },

    // 解析棋盤座標
    parseSquare(algebraic) {
      const col = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
      const row = 8 - parseInt(algebraic[1], 10);
      return { row, col };
    },
  },
};
</script>
<style scoped>
/* 座標標籤樣式 */
.coordinate-label {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: #AD8B73;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5);
}

.row-label {
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1em;
}

.col-label {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1em;
}

/* 棋盤最外層樣式 */
.chess-board {
  display: flex;
  flex-wrap: wrap;
  width: 800px;
  height: 800px;
  margin: auto;
  border: 1rem solid #AD8B73;
  padding: 15px;
  box-sizing: border-box;
  background-color: #FFFBE9;
}

/* 水平網格 */
.chess-row {
  display: flex;
  width: 100%;
  height: 12.5%;
  position: relative; /* 為了座標標籤的定位 */
}

/* 垂直網格 */
.chess-col {
  box-sizing: border-box;
  width: 12.5%;
  height: 100%;
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

/* 棋盤格子配色 */
.chess-row:nth-of-type(odd) .chess-col:nth-child(odd) {
  background-color: #E3CAA5;
}

.chess-row:nth-of-type(odd) .chess-col:nth-child(even) {
  background-color: #CEAB93;
}

.chess-row:nth-of-type(even) .chess-col:nth-child(odd) {
  background-color: #CEAB93;
}

.chess-row:nth-of-type(even) .chess-col:nth-child(even) {
  background-color: #E3CAA5;
}

/* 選中狀態 */
.selected {
  background-color: #AD8B73 !important;
  box-shadow: inset 0 0 15px rgba(173, 139, 115, 0.9),
              0 0 10px rgba(173, 139, 115, 0.7);
  position: relative;
}

.selected::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px solid #AD8B73;
  animation: selectedPulse 1.5s infinite;
}

@keyframes selectedPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.9;
  }
}

/* 可移動空格樣式 */
.canMove {
  width: 50px;
  height: 50px;
  background-color: #AD8B73;
  opacity: 0.8;
  border-radius: 50%;
  animation: movePulse 1.5s infinite;
}

/* 可吃子樣式 */
.canEat {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #AD8B73;
  animation: eatPulse 1.5s infinite;
}

@keyframes movePulse {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.8;
  }
}

@keyframes eatPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.9;
  }
}

/* 響應式設計 */
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
</style>
