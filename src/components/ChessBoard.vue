<template>
  <div ref="child" class="chess-board">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="chess-row">
      {{ Math.abs(8 - rowIndex) }}
      <div v-for="(col, colIndex) in row" :key="colIndex" class="chess-col">
        <div :class="['box', { 'selected': classSelected(rowIndex, colIndex) }]" @click="clickPiece(rowIndex, colIndex)">
          <ChessPiece v-if="col" :class="col.color" :type="col.type" :color="col.color" />
          <div :class="{
            'canMove': col == null && classMove(rowIndex, colIndex),
            'canEat': col != null && classMove(rowIndex, colIndex)
          }
          ">
          {{ word(rowIndex, colIndex) }}
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
        pawn: 'P',
        rook: 'R',
        knight: 'N',
        bishop: 'B',
        queen: 'Q',
        king: 'K'
      },
      colors: {
        white: 'white',
        black: 'black'
      },
      board: {},
      whoesTurn: 'white',
      api: {
        role: 'user',
        // moveStep: '1. d4 Nf6 2. c4 g6 3. g3 Bg7 4. Bg2 d6 5. Nc3 Nf6 6. Nf3 Ng8f6 7. O-O e-5 8. d5 O-O 9. e4 Nh5 10. Rb1',
        // moveStep: '1. e6 d5 2. e5 f6 3. Qf6 f3 4. Qxf3',
        // moveStep: '1. e3 e5 2. Na3 ',
        moveStep: "",
        // message: "你對西洋棋非常了解。讓我們開始一場西洋棋。我是白方，你是黑方，並給我你的移動記譜。以下是目前的記譜狀況:",
        message: "You have a great understanding of chess. Let's start a game of chess. I'm playing as White, and you're playing as Black. Please provide your moves in notation. Here is the current move:",
        message2: "",
      },
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
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3,
        'e': 4,
        'f': 5,
        'g': 6,
        'h': 7,
      },
    };
  },
  computed: {
    ...mapState(['selectedStatus', 'validMoves', 'round']),
  },
  created() {
    this.initialBoardState();
  },
  mounted() {
  },
  methods: {
    word(rowIndex, colIndex) {
      if (rowIndex == 7) {
        return this.colToWord[colIndex];
      }
    },
    async chatWithFunctionCalling() {
      const API_KEY = import.meta.env.VITE_OPEN_API_KEY;
      const API_URL = 'https://api.openai.com/v1/chat/completions';

      const chatMessages = [
        {
          role: "user",
          content: "What's the weather like in Boston?"
        }
      ];

      const functions = [
        {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": { 
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        }
    ]

      const response = await axios.post(
        API_URL,
        {
          // model: 'gpt-3.5-turbo-0613',
          // model: 'gpt-4-0613',
          model: 'gpt-4-1106-preview',
          messages: chatMessages,
          functions: functions,
          function_call: "auto",
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      const responseData = response.data;
      console.log(responseData.choices[0].message);
      console.log(responseData.choices[0].message.function_call);

      if (responseData.function_calls && responseData.function_calls.length > 0) {
        const functionCall = responseData.function_calls[0];
        if (functionCall.name === 'tell_joke') {
          console.log('Telling a joke...');
          // Call your tell_joke function here
        }
      }
    },
    aiTurn() {
      let msg = this.api.message + this.api.moveStep + this.api.message2;

      console.log(msg);

      axios.post('https://api.openai.com/v1/chat/completions', {
        // model: "gpt-3.5-turbo-0613",
        model: 'gpt-4-0613',
        messages: [{"role": "user", "content": msg}],
        functions: [
            {
                "name": "move_chess_piece",
                // "description": "Move a chess piece and return the notation of your move",
                // "description": "移動棋子並回傳你移動的記譜",
                description: "move black chess piece and provide your moves in notation",
                "parameters": {
                    "type": "object",
                    "properties": {
                        // "startNotation": {
                        //   "type": "string",
                        //   "description": "起始位置",
                        //   "enum": ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"]
                        // },
                        // "MovedNotation": {
                        //   "tyep": "string",
                        //   "description": "移動棋子記譜",
                        //   "enum": ["P", "R", "N", "B", "Q", "K", "O-O", "O-O-O"]
                        // }
                        "pieceType": {
                            "type": "string",
                            // "description": "你移動的棋子類型，禁止回傳enum以外類型",
                            "description" : "The type of piece you are moving, do not return types other than enum",
                            "enum": ["P", "R", "N", "B", "Q", "K"]
                        },
                        "pieceAction": {
                            "type": "string",
                            // "description": "你移動的棋子動作，禁止回傳enum以外動作",
                            "description" : "The action of the piece you are moving, do not return actions other than enum",
                            "enum": ["", "x", "=", "+", "#", "e.p."] // 空字串代表移動
                        },
                        "piecePosition": {
                            "type": "string",
                            // "description": "你移動棋子的位置，禁止回傳enum以外位置",
                            "description" : "The position of the piece you are moving, do not return positions other than enum",
                            "enum": ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"]
                        },
                        "pieceTarget": {
                            "type": "string",
                            // "description": "你移動棋子的目標位置，禁止回傳enum以外位置",
                            "description" : "The target position of the piece you are moving, do not return positions other than enum",
                            "enum": ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"]
                        },
                        "piecePromotion": {
                            "type": "string",
                            // "description": "你移動棋子的升變類型，禁止回傳enum以外類型",
                            "description" : "The promotion type of the piece you are moving, do not return types other than enum",
                            "enum": ["Q", "R", "B", "N", ""] // 空字串代表沒有升變
                        },
                        "specialMove": {
                            "type": "string",
                            "description": "特殊移動，禁止回傳列舉以外移動",
                            "enum": ["O-O", "O-O-O", ""] // 空字串代表沒有特殊移動
                        },
                    },
                    "required": ["pieceType", "pieceAction", "piecePosition", "pieceTarget"],
                    // "required": ["startNotation", "MovedNotation"],
                },
            }
        ],
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
          console.log(response);
          const messageContent = response.data.choices[0].message.content;
          const functionCall = response.data.choices[0].message.function_call;
          this.aiMove(functionCall);
        }) 
        .catch((error) => { 
          console.error(error); 
        });
    },
    aiMove(result) {
      const rsg = JSON.parse(result.arguments);
      
      let chieceType = rsg.pieceType;
      let chieceAction = rsg.pieceAction;
      let chiecePosition = rsg.piecePosition;
      let chieceTarget = rsg.pieceTarget;

      this.api.moveStep += chieceType + chieceAction + chieceTarget;

      console.log(rsg);
      return false;

      let chiecePromotion = rsg.piecePromotion;
      let specialMove = rsg.specialMove;

      let position = chiecePosition.split('');
      let targePosition = chieceTarget.split('');
      let col = this.wordToCol[position[0]];
      let row = 8 - position[1];
      let targetCol = this.wordToCol[targePosition[0]];
      let targetRow = 8 - targePosition[1];

      this.board[row][col] = null; // 清除原位置
      this.board[targetRow][targetCol] = {
        type: chieceType,
        color: 'black',
      }; // 移動棋子

      let word = chieceType + chieceAction + chieceTarget;
      word = word.replace('P', '');
      this.api.moveStep += word + ' ';
      this.whoesTurn = 'white';

      // let words = resultMsg.split('...');
      // let word = words[words.length - 1].trim();

      // console.log(word.split(''));
      
      // // 目標位置
      // let targets = {
      //   "type": "",
      //   "row": "",
      //   "col": "",
      // };

      // targets['type'] = word[1];
      // let targetRow = 8 - word[word.length - 1];
      // let targetCol = this.wordToCol[word[word.length - 2]];

      // console.log(targetRow);
      // console.log(targetCol);

      //   // 起始位置
      //   for (let row = 0; row < this.size; row++) {
      //     for (let col = 0; col < this.size; col++) {
      //       // 長度為 2 的話，必定是士兵移動
      //       if (word.length == 2) {
      //         if (this.board[row][col] != null && this.board[row][col].type == this.pieces.pawn) {
      //           let availableMoves = this.getAvailableMoves({row, col});

      //           // 判斷哪個棋子可以移動到目標位置
      //           if (availableMoves.some((move) => move.row == targetRow && move.col == targetCol)) {
      //             this.board[row][col] = null;
      //             this.board[targetRow][targetCol] = {
      //               type: this.pieces.pawn,
      //               color: 'black',
      //             };
      //           }
      //         }
      //       }
      //     }
      //   }
      // // 長度為3，必為士兵以外

    },
    setNotation(originPosition, isEat) {
      let col = this.selectedStatus.position.col;
      let row = this.selectedStatus.position.row;
      let round = this.round;
      let piece = this.selectedStatus.piece.type;
      let targetPostion = this.convertToAlgebraicNotation(row, col);
      let action = isEat ? 'x' : '';

      if (piece == 'P') piece = '';

      this.api.moveStep += round + '. ' + piece + originPosition + action + targetPostion + ' ';
    },
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
    // 移動棋子
    movePiece(targetRow, targetCol, originRow = null, originCol = null) {
      // 獲取起始位置
      originRow = originRow ?? this.selectedStatus.position.row;
      originCol = originCol ?? this.selectedStatus.position.col;
      const originPiece = this.board[originRow][originCol];

      // 獲取目標棋子
      let targetPiece = this.board[targetRow][targetCol];

      // 是否為吃子
      let isEat = targetPiece === null ? false : true;

      this.convertToAlgebraic('Ne3');

      // 檢查目標是否在可移動範圍內
      for (let vaildDir of this.validMoves) {
        if (vaildDir.row == targetRow && vaildDir.col == targetCol) {
          this.board[originRow][originCol] = null; // 清除原位置
          this.board[targetRow][targetCol] = originPiece; // 移動棋子
          this.selectedStatus.position = {
            'row': targetRow,
            'col': targetCol,
          }; // 更新選擇棋子位置
          this.$store.commit('addRound'); // 增加回合數

          // 記譜
          let originPosition = this.convertToAlgebraicNotation(originRow, originCol);
          this.setNotation(originPosition, isEat);

          // AI回合
          this.aiTurn();

          // 增加回合數(黑方下完才增加)
          if (this.whoesTurn == 'black') {
            this.$store.commit('addRound');
          }

          if (targetPiece != null && targetPiece.type == 'K') {
            alert(this.whoesTurn + 'win!');
            return true;
          }

          if (this.checkWin()) {
            alert(this.whoesTurn + 'win!');
            return true;
          }
          this.cleanSelected();
          this.whoesTurn = this.whoesTurn == 'white' ? 'black' : 'white';

          return true;

          // let step = this.api.step;
          // // if (Array.isArray(step[this.round])) {
          // //   step[this.round].push([row, col]);
          // // } else {
          // //   step[this.round] = [];
          // //   step[this.round].push([row, col]);
          // // }
          // // this.api.step = step;

          // step[this.round] = {
          //   piece: this.selectedStatus.piece,
          //   position: [ row, this.colToWord[col] ]
          // }

          // console.log(step);
        }
      }

      return false;
    },
    // 點擊棋子
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
        this.$store.commit('setValidMoves', this.getAvailableMoves({row, col}));
      }
      else if (this.isSelected() && this.canMove()) {
        // 移動棋子
        this.movePiece(row, col);
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
    getAvailableMoves(position) {
      let x = position.col;
      let y = position.row;
      let color = this.board[y][x].color;
      let type = this.board[y][x].type;

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

        // 檢查是否在棋盤範圍內
        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
          // 獲取目標棋子
          let target = this.board[ny][nx];

          // 步數為2時，檢查是否第一次移動
          if (Math.abs(dir[1]) == 2) {
            if (color == 'white' && y != 6) {
              continue;
            }
            if (color == 'black' && y != 1) {
              continue;
            }
          }

          // 檢查是否為吃子
          if (Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1) {
            if (target == null || target.color == color) {
              continue;
            }
          }
          // 檢查前方有異色棋子時，不能移動
          else if (Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 && target != null) {
            continue;
          }
          // 移動兩步時，前方兩格都要檢查
          else if (Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 2) {
            if (target != null || this.board[ny - 1][nx] != null) {
              continue;
            }
          }
          
          // 加入可以移動的座標
          moves.push({ row: ny, col: nx });
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
      let Kingmoves = this.getAvailableMoves(kingPosition);

      // 獲取移動後棋子可移動範圍
      let pieceMoves = this.getAvailableMoves(this.selectedStatus.position);

      // 是否成功將軍
      let check = false;

      // 檢查當下移動的棋子是否可以吃掉王
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
            let moves = this.getAvailableMoves({ row, col });

            if (moves.some((move) => move.row == this.selectedStatus.position.row && move.col == this.selectedStatus.position.col)) {
              return false;
            }
          }

          // 判斷對方國王移動範圍是否都在我方任何棋的吃棋範圍內
          if (piece != null && piece.color != color) {
            let moves = this.getAvailableMoves({ row, col });

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
    // 獲取王的位置
    findKing(color) {
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          let piece = this.board[row][col];

          if (piece != null && piece.type == "K" && piece.color == color) {
            return { row: row, col: col };
          }
        }
      }
    },
    // index轉換成棋盤座標
    convertToAlgebraicNotation(row, col) {
      return this.colToWord[col] + (8 - row);
    },
    // 棋盤座標轉換成index
    convertToAlgebraic(postion) {
      let col= postion[0];
      let row = postion[1];

      return {
        row: 8 - row,
        col: this.wordToCol[col],
      }
    },
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
