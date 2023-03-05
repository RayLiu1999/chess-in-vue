<template>
    <div class="chess-pieces">
        <component :is="type" :color="color"></component>
    </div>
</template>

<script>
import Pawn from "./pieces/Pawn.vue";
import Rook from "./pieces/Rook.vue";
import Knight from "./pieces/Knight.vue";
import Bishop from "./pieces/Bishop.vue";
import Queen from "./pieces/Queen.vue";
import King from './pieces/King.vue';

export default {
    components: {
        Pawn,
        Rook,
        Knight,
        Bishop,
        Queen,
        King
    },
    props: {
        type: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    },
    // computed: {
    //     classes() {
    //         return [`${this.piece}-piece`];
    //     }
    // },
    // data() {
    //     return {
    //         isDragging: false,
    //         mouseX: 0,
    //         mouseY: 0,
    //         offsetX: 0,
    //         offsetY: 0,
    //         // pieceUrl: `/pieces/${this.color}_${this.type}.svg`
    //     }
    // },
    // methods: {
    //     startDrag(event) {
    //         event.preventDefault();
    //         this.isDragging = true;
    //         this.mouseX = event.clientX;
    //         this.mouseY = event.clientY;
    //         this.offsetX = this.$el.offsetLeft;
    //         this.offsetY = this.$el.offsetTop;
    //         window.addEventListener('mousemove', this.drag);
    //         window.addEventListener('mouseup', this.endDrag);
    //     },
    //     drag(event) {
    //         if (this.isDragging) {
    //             const deltaX = event.clientX - this.mouseX;
    //             const deltaY = event.clientY - this.mouseY;
    //             this.$el.style.left = this.offsetX + deltaX + 'px';
    //             this.$el.style.top = this.offsetY + deltaY + 'px';
    //             console.log(deltaX);
    //         }
    //     },
    //     endDrag(event) {
    //         this.isDragging = false;
    //         window.removeEventListener('mousemove', this.drag);
    //         window.removeEventListener('mouseup', this.endDrag);
    //         this.$emit('pieceMoved', {
    //             fromRow: this.row,
    //             fromCol: this.col,
    //             toRow: this.row + Math.floor((event.clientY - this.mouseY) / this.size),
    //             toCol: this.col + Math.floor((event.clientX - this.mouseX) / this.size)
    //         });
    //     }
    // }
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

/* .pawn-piece {
    font-size: 24px;
    text-align: center;
}

.rook-piece {
    font-size: 24px;
    text-align: center;
}

.knight-piece {
    font-size: 24px;
    text-align: center;
}

.bishop-piece {
    font-size: 24px;
    text-align: center;
}

.queen-piece {
    font-size: 24px;
    text-align: center;
}

.king-piece {
    font-size: 24px;
    text-align: center;
} */
</style>