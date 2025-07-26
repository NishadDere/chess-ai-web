var board = null;
var game = new Chess();

function makeMove(source, target) {
    const move = source + target;
    $.post("/move", JSON.stringify({ move: move }), function(data) {
        game.move({ from: source, to: target });
        board.position(game.fen());
        if (data.ai_move) {
            game.move({ from: data.ai_move.slice(0,2), to: data.ai_move.slice(2,4) });
            board.position(game.fen());
        }
    }, "json").fail(function() {
        alert("Illegal move!");
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
    const move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';  // Illegal move

    game.undo(); // temporarily apply for validation, then revert

    makeMove(source, target);
}

    });
});
