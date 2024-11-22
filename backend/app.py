from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://kabilaashthayananthan:Tracker@localhost/expense_tracker'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)  # Enable Cross-Origin Resource Sharing
db = SQLAlchemy(app)

# Define the Expense model
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)

# Create the database tables
with app.app_context():
    db.create_all()

# Home route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to Expense Tracker API"})

# GET /expenses - Fetch all expenses
@app.route('/expenses', methods=['GET'])
def get_expenses():
    sort_order = request.args.get('sort_order', 'asc')  # Default to ascending
    try:
        if sort_order == 'asc':
            expenses = Expense.query.order_by(Expense.date.asc()).all()
        elif sort_order == 'desc':
            expenses = Expense.query.order_by(Expense.date.desc()).all()
        else:
            return jsonify({"error": "Invalid sort_order value"}), 400
        
        # Convert expenses to JSON
        return jsonify([{
            "id": expense.id,
            "title": expense.title,
            "amount": expense.amount,
            "category": expense.category,
            "date": expense.date.strftime('%Y-%m-%d')
        } for expense in expenses])
    except Exception as e:
        return jsonify({"error": f"Failed to fetch expenses: {e}"}), 500

# POST /expenses - Add a new expense
@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    try:
        new_expense = Expense(
            title=data['title'],
            amount=data['amount'],
            category=data['category'],
            date=data['date']
        )
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({"message": "Expense added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to add expense: {e}"}), 500

# DELETE /expenses/<id> - Delete an expense
@app.route('/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    try:
        expense = Expense.query.get(id)
        if expense:
            db.session.delete(expense)
            db.session.commit()
            return jsonify({"message": "Expense deleted successfully!"}), 200
        else:
            return jsonify({"error": "Expense not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to delete expense: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
