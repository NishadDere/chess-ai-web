from flask import Flask, render_template, request, jsonify
import chess
import chess.svg

app = Flask(__name__)
board = chess.Board()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/move", methods=["POST"])
def move():
    global board
    user_move = request.json["move"]
    try:
        board.push_uci(user_move)
    except:
        return jsonify({"error": "Illegal move"}), 400

    # AI move
    _, best = alphabeta(board, 3, float("-inf"), float("inf"), True)
    if best:
        board.push(best)
        return jsonify({"ai_move": best.uci()})
    return jsonify({"ai_move": None})

@app.route("/reset", methods=["POST"])
def reset():
    global board
    board = chess.Board()
    return jsonify({"status": "reset"})

if __name__ == "__main__":
    app.run(debug=True)
