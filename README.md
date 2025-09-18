# Vue 國際象棋 | Chess in Vue

[繁體中文](#繁體中文) | [English](#english)

<a id="繁體中文"></a>
## 繁體中文

### 專案概述

Vue 國際象棋是一款使用 Vue 3 和 Vite 開發的網頁版國際象棋遊戲。此專案提供了一個美觀且直觀的使用者介面，讓玩家能夠與 AI 進行對戰，提升棋藝水平。

### 主要功能

- 完整實現國際象棋規則的遊戲系統
- 整合 Stockfish 國際象棋引擎提供 AI 對戰功能
- 直觀的棋子移動與提示系統
- 可行動位置高亮顯示
- 響應式設計，適合不同裝置使用
- 美觀的遊戲界面與動畫效果
- 支援 FEN 格式棋盤狀態生成

### 技術棧

- **前端框架**: Vue 3
- **狀態管理**: Vuex 4
- **構建工具**: Vite
- **HTTP 客戶端**: Axios
- **國際象棋引擎**: Stockfish.js
- **容器化**: Docker

### 專案架構

```mermaid
graph TD
  subgraph 用戶端 [Browser]
    A["<span style='color:#b8860b'>使用者</span>"] --> B[Vue.js 應用程式]
  end

  subgraph Vue.js 應用程式 [src/]
    B --> C[main.js 入口點]
    C --> D[App.vue 根組件]
    D -- 使用 --> F[store.js Vuex 狀態管理]
    D --> E[ChessBoard.vue]
    E --> G[ChessPiece.vue / pieces/*.vue]
    E -- 互動 --> I[stockfish.service.js]
  end

  subgraph 外部服務 [External Services]
    I -- 通訊 --> J["<span style='color:#0288d1'>Stockfish.js 象棋引擎</span>"]
  end

  subgraph 開發與部署 [Build & Deployment]
    K["<span style='color:#1976d2'>Vite 開發環境</span>"] --> B
    L["<span style='color:#1976d2'>Docker / Nginx 生產環境</span>"] --> B
  end

  style A fill:#ffe4b5,stroke:#333,stroke-width:2px
  style J fill:#b3e5fc,stroke:#333,stroke-width:2px
  style K fill:#f0f8ff,stroke:#333,stroke-width:2px
  style L fill:#f0f8ff,stroke:#333,stroke-width:2px
```

### 安裝與運行

#### 安裝依賴

```sh
npm install
```

#### 開發環境運行

```sh
npm run dev
```

#### 生產環境構建

```sh
npm run build
```

#### 使用 Docker 運行

```sh
docker-compose up -d
```

### 推薦的開發環境

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (並停用 Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

---

<a id="english"></a>
## English

### Project Overview

Chess in Vue is a web-based chess game developed with Vue 3 and Vite. This project provides a beautiful and intuitive user interface that allows players to compete against an AI opponent to improve their chess skills.

### Key Features

- Complete implementation of chess rules
- Integration with Stockfish chess engine for AI gameplay
- Intuitive piece movement and hint system
- Valid move highlighting
- Responsive design for various devices
- Beautiful game interface with animations
- Support for FEN format board state generation

### Tech Stack

- **Frontend Framework**: Vue 3
- **State Management**: Vuex 4
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Chess Engine**: Stockfish.js
- **Containerization**: Docker

### Project Structure

```mermaid
graph TD
  subgraph Client [Browser]
    A["<span style='color:#b8860b'>User</span>"] --> B[Vue.js Application]
  end
  subgraph Vue.js Application [src/]
    B --> C[main.js Entry Point]
    C --> D[App.vue Root Component]
    D -- Uses --> F[store.js Vuex State Management]
    D --> E[ChessBoard.vue]
    E --> G[ChessPiece.vue / pieces/*.vue]
    E -- Interacts --> I[stockfish.service.js]
  end
  subgraph External Services [External Services]
    I -- Communicates --> J["<span style='color:#0288d1'>Stockfish.js Chess Engine</span>"]
  end
  subgraph Build & Deployment [Build & Deployment]
    K["<span style='color:#1976d2'>Vite Development Environment</span>"] --> B
    L["<span style='color:#1976d2'>Docker / Nginx Production Environment</span>"] --> B
  end
  style A fill:#ffe4b5,stroke:#333,stroke-width:2px
  style J fill:#b3e5fc,stroke:#333,stroke-width:2px
  style K fill:#f0f8ff,stroke:#333,stroke-width:2px
  style L fill:#f0f8ff,stroke:#333,stroke-width:2px
```

### Installation and Running

#### Install Dependencies

```sh
npm install
```

#### Run Development Server

```sh
npm run dev
```

#### Build for Production

```sh
npm run build
```

#### Run with Docker

```sh
docker-compose up -d
```

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
