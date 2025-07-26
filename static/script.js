var board = null;
var game = new Chess();

function makeMove(source, target) {
    const move = source + target;
    $.ajax({
        url: "/move",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ move: move }),
        success: function(data) {
            // Update user's move
            game.move({ from: source, to: target, promotion: 'q' });
            board.position(game.fen());

            // Update AI move
            if (data.ai_move) {
                game.move({ 
                    from: data.ai_move.slice(0, 2), 
                    to: data.ai_move.slice(2, 4), 
                    promotion: 'q'
                });
                board.position(game.fen());
            }
        },
        error: function(xhr) {
            alert("Illegal move!");
            board.position(game.fen()); // reset to last valid position
        }
    });
}

function resetGame() {
    $.post("/reset", function() {
        game.reset();
        board.position(game.fen());
    });
}

$(function() {
    board = Chessboard('board', {
        draggable: true,
        position: 'start',
        onDrop: function(source, target) {
            // Try move locally to check legality
            const move = game.move({ from: source, to: target, promotion: 'q' });
            if (move === null) return 'snapback'; // illegal move

            game.undo(); // revert so server can validate and respond
            makeMove(source, target);
        }
    });
});
