function getValidMoves(board, x, y) {
    // 初始化一個空的數組來存儲可移動方格
    let moves = [];
    // 獲取棋子的類型和顏色
    let piece = board[x][y];
    let type = piece.type;
    let color = piece.color;
    // 根據棋子的類型，選擇不同的移動規則
    switch (type) {
      // 國王的移動規則
      case "K":
        // 國王可以移動到任何相鄰的方格，但不能移動到被對方控制的方格
        // 定義一個數組，表示國王可以移動的方向
        let kingDirs = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ];
        // 遍歷每個方向
        for (let dir of kingDirs) {
          // 計算目標方格的坐標
          let nx = x + dir[0];
          let ny = y + dir[1];
          // 檢查目標方格是否在棋盤範圍內
          if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            // 獲取目標方格的棋子
            let target = board[nx][ny];
            // 檢查目標方格是否為空或異色
            if (target.color == 0 || target.color == -color) {
              // 將目標方格加入可移動方格的數組
              moves.push([nx, ny]);
            }
          }
        }
        // 返回可移動方格的數組
        return moves;
      // 騎士的移動規則
      case "N":
        // 騎士可以跳過其他棋子，沿著L形的路徑移動，但不能移動到同色的方格
        // 定義一個數組，表示騎士可以移動的方向
        let knightDirs = [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1],
        ];
        // 遍歷每個方向
        for (let dir of knightDirs) {
          // 計算目標方格的坐標
          let nx = x + dir[0];
          let ny = y + dir[1];
          // 檢查目標方格是否在棋盤範圍內
          if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            // 獲取目標方格的棋子
            let target = board[nx][ny];
            // 檢查目標方格是否為空或異色
            if (target.color == 0 || target.color == -color) {
              // 將目標方格加入可移動方格的數組
              moves.push([nx, ny]);
            }
          }
        }
        // 返回可移動方格的數組
        return moves;
      // 車的移動規則
      case "R":
        // 車可以沿著水平或垂直的方向移動，直到遇到邊界或其他棋子，但不能移動到同色的方格
        // 定義一個數組，表示車可以移動的方向
        let rookDirs = [
          [-1, 0],
          [0, -1],
          [0, 1],
          [1, 0],
        ];
        // 遍歷每個方向
        for (let dir of rookDirs) {
          // 設置一個變量，表示是否可以繼續沿著這個方向移動
          let canMove = true;
          // 設置一個變量，表示目標方格的坐標
          let nx = x;
          let ny = y;
          // 當可以繼續移動時，重複以下步驟
          while (canMove) {
            // 更新目標方格的坐標
            nx += dir[0];
            ny += dir[1];
            // 檢查目標方格是否在棋盤範圍內
            if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
              // 獲取目標方格的棋子
              let target = board[nx][ny];
              // 檢查目標方格是否為空
              if (target.color == 0) {
                // 將目標方格加入可移動方格的數組
                moves.push([nx, ny]);
              } else {
                // 檢查目標方格是否為異色
                if (target.color == -color) {
                  // 將目標方格加入可移動方格的數組
                  moves.push([nx, ny]);
                }
                // 無論如何，都不能繼續沿著這個方向移動
                canMove = false;
              }
            } else {
              // 如果超出棋盤範圍，也不能繼續沿著這個方向移動
              canMove = false;
            }
          }
        }
        // 返回可移動方格的數組
        return moves;
      // 象的移動規則
      case "B":
        // 象可以沿著對角線的方向移動，直到遇到邊界或其他棋子，但不能移動到同色的方格
        // 定義一個數組，表示象可以移動的方向
        let bishopDirs = [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ];
        // 遍歷每個方向
        for (let dir of bishopDirs) {
          // 設置一個變量，表示是否可以繼續沿著這個方向移動
          let canMove = true;
          // 設置一個變量，表示目標方格的坐標
          let nx = x;
          let ny = y;
          // 當可以繼續移動時，重複以下步驟
          while (canMove) {
            // 更新目標方格的坐標
            nx += dir[0];
            ny += dir[1];
            // 檢查目標方格是否在棋盤範圍內
            if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
              // 獲取目標方格的棋子
              let target = board[nx][ny];
              // 檢查目標方格是否為空
              if (target.color == 0) {
                // 將目標方格加入可移動方格的數組
                moves.push([nx, ny]);
              } else {
                // 檢查目標方格是否為異色
                if (target.color == -color) {
                  // 將目標方格加入可移動方格的數組
                  moves.push([nx, ny]);
                }
                // 無論如何，都不能繼續沿著這個方向移動
                canMove = false;
              }
            } else {
              // 如果超出棋盤範圍，也不能繼續沿著這個方向移動
              canMove = false;
            }
          }
        }
        // 返回可移動方格的數組
        return moves;
      // 后的移動規則
      case "Q":
        // 后可以沿著水平、垂直或對角線的方向移動，直到遇到邊界或其他棋子，但不能移動到同色的方格
        // 定義一個數組，表示后可以移動的方向
        let queenDirs = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ];
        // 遍歷每個方向
        for (let dir of queenDirs) {
          // 設置一個變量，表示是否可以繼續沿著這個方向移動
          let canMove = true;
          // 設置一個變量，表示目標方格的坐標
          let nx = x;
          let ny = y;
          // 當可以繼續移動時，重複以下步驟
          while (canMove) {
            // 更新目標方格的坐標
            nx += dir[0];
            ny += dir[1];
            // 檢查目標方格是否在棋盤範圍內
            if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
              // 獲取目標方格的棋子
              let target = board[nx][ny];
              // 檢查目標方格是否為空
              if (target.color == 0) {
                // 將目標方格加入可移動方格的數組
                moves.push([nx, ny]);
              } else {
                // 檢查目標方格是否為異色
                if (target.color == -color) {
                  // 將目標方格加入可移動方格的數組
                  moves.push([nx, ny]);
                }
                // 無論如何，都不能繼續沿著這個方向移動
                canMove = false;
              }
            } else {
              // 如果超出棋盤範圍，也不能繼續沿著這個方向移動
              canMove = false;
            }
          }
        }
        // 返回可移動方格的數組
        return moves;
    }
  }
  