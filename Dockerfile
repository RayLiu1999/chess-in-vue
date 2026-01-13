# 使用官方 Node.js 作為基礎映像
FROM node:18-alpine AS builder

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安裝專案依賴
RUN npm install

# 複製專案文件到容器中
COPY . .

# 構建應用
RUN npm run build

# 使用輕量級的 nginx 來服務靜態文件
FROM nginx:alpine

# 複製構建產物到 nginx 目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 Stockfish.js 相關文件到特定目錄
COPY --from=builder /app/node_modules/stockfish.js/stockfish.js /usr/share/nginx/html/
COPY --from=builder /app/node_modules/stockfish.js/stockfish.wasm /usr/share/nginx/html/

# 複製 Nginx 配置模板 (容器啟動時會自動執行 envsubst 替換變數)
COPY ./config/nginx.conf.template /etc/nginx/templates/default.conf.template

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
