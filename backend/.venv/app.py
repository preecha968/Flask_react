from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///laptop_repair.db'  # Update with your DB
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)  # Allow cross-origin for React app

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(15))
    password = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
class Laptop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    issue_description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(200))  # Path to uploaded image
    customer = db.relationship('Customer', backref='laptops')

class Repair(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    laptop_id = db.Column(db.Integer, db.ForeignKey('laptop.id'), nullable=False)
    repair_status = db.Column(db.String(50), nullable=False, default="Received")
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, onupdate=db.func.current_timestamp())
    cost = db.Column(db.Float, nullable=True)
    paid = db.Column(db.Boolean, default=False)
    laptop = db.relationship('Laptop', backref='repairs')

class RepairStatusHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    repair_id = db.Column(db.Integer, db.ForeignKey('repair.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    repair = db.relationship('Repair', backref='status_history')


# Helper function to save image files
def save_image(file):
    path = os.path.join('uploads', file.filename)
    file.save(path)
    return path


# Route to submit a new repair request
@app.route('/submit-repair', methods=['POST'])
@jwt_required()
def submit_repair():
    current_user_id = get_jwt_identity()
    customer = Customer.query.get(current_user_id)

    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    data = request.form
    brand = data.get('brand')
    model = data.get('model')
    issue_description = data.get('issue_description')
    image_file = request.files.get('image')

    if image_file:
        image_path = save_image(image_file)
    else:
        image_path = None

    new_laptop = Laptop(customer_id=customer.id, brand=brand, model=model, issue_description=issue_description, image=image_path)
    db.session.add(new_laptop)
    db.session.commit()

    new_repair = Repair(laptop_id=new_laptop.id, repair_status='Sending')
    db.session.add(new_repair)
    db.session.commit()

    return jsonify({"message": "Repair request submitted successfully"}), 201

# Route to get repair status of a specific request
@app.route('/repair-status/<int:repair_id>', methods=['GET'])
@jwt_required()
def repair_status(repair_id):
    repair = Repair.query.get(repair_id)

    if not repair:
        return jsonify({"error": "Repair not found"}), 404

    return jsonify({
        "repair_id": repair.id,
        "brand": repair.laptop.brand,
        "model": repair.laptop.model,
        "issue_description": repair.laptop.issue_description,
        "repair_status": repair.repair_status,
        "cost": repair.cost,
        "paid": repair.paid,
        "created_at": repair.created_at
    }), 200

# Route to fetch all repair requests for the logged-in customer
@app.route('/my-repairs', methods=['GET'])
@jwt_required()
def my_repairs():
    current_user_id = get_jwt_identity()
    repairs = Repair.query.join(Laptop).filter(Laptop.customer_id == current_user_id).all()

    repair_list = [{
        "repair_id": repair.id,
        "brand": repair.laptop.brand,
        "model": repair.laptop.model,
        "repair_status": repair.repair_status,
        "created_at": repair.created_at,
        "issue_description": repair.laptop.issue_description,
        "cost": repair.cost,
        "paid": repair.paid
    } for repair in repairs]

    return jsonify(repair_list), 200

# Route to fetch all repairs (admin only)
@app.route('/admin/all-repairs', methods=['GET'])
@jwt_required()
def get_all_repairs():
    repairs = Repair.query.all()
    repair_list = [{
        "repair_id": repair.id,
        "customer_id": repair.laptop.customer_id,
        "brand": repair.laptop.brand,
        "model": repair.laptop.model,
        "issue_description": repair.laptop.issue_description,
        "repair_status": repair.repair_status,
        "cost": repair.cost,
        "paid": repair.paid,
        "created_at": repair.created_at
    } for repair in repairs]
    
    return jsonify(repair_list), 200

# Route to update repair status (admin only)
@app.route('/admin/update-repair-status/<int:repair_id>', methods=['PUT'])
@jwt_required()
def update_repair_status(repair_id):
    data = request.get_json()
    new_status = data.get('repair_status')

    repair = Repair.query.get(repair_id)
    if not repair:
        return jsonify({"error": "Repair not found"}), 404

    repair.repair_status = new_status
    db.session.commit()

    return jsonify({"message": "Repair status updated"}), 200

# Route to update repair cost and payment status (admin only)
@app.route('/admin/update-repair-cost/<int:repair_id>', methods=['PUT'])
@jwt_required()
def update_repair_cost(repair_id):
    data = request.get_json()
    cost = data.get('cost')
    paid = data.get('paid')

    repair = Repair.query.get(repair_id)
    if not repair:
        return jsonify({"error": "Repair not found"}), 404

    repair.cost = cost
    repair.paid = paid
    db.session.commit()

    return jsonify({"message": "Repair cost and payment status updated"}), 200

# Registration Route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    if Customer.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    new_customer = Customer(name=name, email=email, phone=phone)
    new_customer.set_password(password)
    db.session.add(new_customer)
    db.session.commit()

    return jsonify({"message": "Registration successful"}), 201


# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    customer = Customer.query.filter_by(email=email).first()

    if not customer or not customer.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token
    access_token = create_access_token(identity=customer.id)
    return jsonify({"access_token": access_token}), 200


# Protected Route (for testing JWT)
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    customer = Customer.query.get(current_user_id)

    if not customer:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "name": customer.name,
        "email": customer.email,
        "phone": customer.phone
    }), 200
with app.app_context():
     db.create_all()

if __name__ == '__main__':
    
    app.run(debug=True)
