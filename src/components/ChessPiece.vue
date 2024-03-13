<template>
  <div class="chess-pieces">
    <component :is="type" :color="color"></component>
  </div>
</template>

<script>
import Pawn from './pieces/Pawn.vue';
import Rook from './pieces/Rook.vue';
import Knight from './pieces/Knight.vue';
import Bishop from './pieces/Bishop.vue';
import Queen from './pieces/Queen.vue';
import King from './pieces/King.vue';

export default {
  components: {
    Pawn,
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.chess-pieces {
  font-size: 24px;
  text-align: center;
}

.black {
  fill: #000000;
}

.white {
  fill: #FFFFFF;
}
</style>
