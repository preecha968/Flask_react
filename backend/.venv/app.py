from flask import Flask, request, jsonify,send_file
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from functools import wraps
from flask_cors import CORS
import pdfkit
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
    role = db.Column(db.String(50), default='user')  # Add role field with 'user' as default


    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
class Laptop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    serial_number = db.Column(db.String(50), nullable=False)
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
    repair_description = db.Column(db.Text, nullable=True)  # เพิ่มฟิลด์ repair_description
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

########################################################################################################################################################

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = Customer.query.get(current_user_id)

        if not user or user.role != 'admin':
            return jsonify({"error": "Admins only! Unauthorized access."}), 403
        return fn(*args, **kwargs)
    return wrapper


########################################################################################################################################################

# Route to get repair history for a customer
@app.route('/my-repair-history', methods=['GET'])
@jwt_required()
def repair_history():
    current_user_id = get_jwt_identity()
    repairs = Repair.query.join(Laptop).filter(Laptop.customer_id == current_user_id, Repair.repair_status == 'Completed').all()

    repair_list = [{
        "repair_id": repair.id,
        "brand": repair.laptop.brand,
        "model": repair.laptop.model,
        "serial_number": repair.laptop.serial_number,
        "issue_description": repair.laptop.issue_description,
        "repair_status": repair.repair_status,
        "repair_description":repair.repair_description,
        "cost": repair.cost,
        "paid": repair.paid,
        "created_at": repair.created_at,
        "updated_at": repair.updated_at
    } for repair in repairs]

    return jsonify(repair_list), 200


########################################################################################################################################################

# Route to download invoice as PDF
@app.route('/download-invoice/<int:repair_id>', methods=['GET'])
@jwt_required()
def download_invoice(repair_id):
    repair = Repair.query.get(repair_id)
    if not repair:
        return jsonify({"error": "Repair not found"}), 404

    customer = repair.laptop.customer

    # ตรวจสอบว่ามีไดเรกทอรี 'invoices' หรือไม่ ถ้าไม่มีให้สร้างขึ้น
    if not os.path.exists('invoices'):
        os.makedirs('invoices')

    # HTML template for the invoice
    html_content = f"""
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'TH SarabunPSK', sans-serif; font-size: 18px; }}
        h1 {{ text-align: center; }}
      </style>
    </head>
    <body>
      <h1>Invoice</h1>
      <p><strong>Customer:</strong> {customer.name}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Phone:</strong> {customer.phone}</p>
      <p><strong>Laptop Brand:</strong> {repair.laptop.brand}</p>
      <p><strong>Laptop Model:</strong> {repair.laptop.model}</p>
      <p><strong>Serial Number:</strong> {repair.laptop.serial_number}</p>
      <p><strong>Issue:</strong> {repair.laptop.issue_description}</p>
      <p><strong>Repair Status:</strong> {repair.repair_status}</p>
      <p><strong>Repair Description:</strong> {repair.repair_description}</p>
      <p><strong>Cost:</strong> {repair.cost} THB</p>
      <p><strong>Paid:</strong> {'Yes' if repair.paid else 'No'}</p>
    </body>
    </html>
    """

    # กำหนดที่เก็บไฟล์ PDF
    file_path = os.path.join(os.getcwd(), 'invoices', f"invoice_{repair_id}.pdf")

    # แปลง HTML เป็น PDF ด้วย pdfkit
    pdfkit.from_string(html_content, file_path)

    # ส่งไฟล์ PDF ให้ผู้ใช้
    return send_file(file_path, as_attachment=True)

########################################################################################################################################################

@app.route('/resubmit-repair/<int:repair_id>', methods=['POST'])
@jwt_required()
def resubmit_repair(repair_id):
    current_user_id = get_jwt_identity()
    
    # ดึงข้อมูล repair ที่ลูกค้าต้องการส่งคำร้องใหม่
    original_repair = Repair.query.get(repair_id)
    
    if not original_repair:
        return jsonify({"error": "Original repair not found"}), 404
    
    # ตรวจสอบว่าลูกค้าที่ทำคำร้องซ้ำเป็นเจ้าของการซ่อมนี้จริง ๆ
    if original_repair.laptop.customer_id != current_user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    # สร้างคำร้องขอซ่อมใหม่โดยใช้ข้อมูลจาก repair เดิม
    new_repair = Repair(
        laptop_id=original_repair.laptop_id,
        repair_status='Resubmitted',
        repair_description=original_repair.repair_description  # นำคำอธิบายการซ่อมเดิมมาใช้
    )

    db.session.add(new_repair)
    db.session.commit()

    return jsonify({"message": "Resubmitted repair request successfully"}), 201


########################################################################################################################################################


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
    serial_number = request.form.get('serial_number')
    issue_description = data.get('issue_description')
    image_file = request.files.get('image')

    if image_file:
        image_path = save_image(image_file)
    else:
        image_path = None

    new_laptop = Laptop(customer_id=customer.id, brand=brand, model=model,serial_number=serial_number, issue_description=issue_description, image=image_path)
    db.session.add(new_laptop)
    db.session.commit()

    new_repair = Repair(laptop_id=new_laptop.id, repair_status='Sending', repair_description='waiting for update')
    db.session.add(new_repair)
    db.session.commit()

    return jsonify({"message": "Repair request submitted successfully"}), 201

########################################################################################################################################################

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
        "updated_at": repair.updated_at,
        "cost": repair.cost,
        "paid": repair.paid,
        "repair_description": repair.repair_description,
        "created_at": repair.created_at
    }), 200


########################################################################################################################################################

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

########################################################################################################################################################

# Route to fetch all repairs (admin only)
@app.route('/admin/all-repairs', methods=['GET'])
@jwt_required()
@admin_required
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

########################################################################################################################################################

# Route to update repair status (admin only)
@app.route('/admin/update-repair-status/<int:repair_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_repair_status(repair_id):
    data = request.get_json()
    new_status = data.get('repair_status')

    repair = Repair.query.get(repair_id)
    if not repair:
        return jsonify({"error": "Repair not found"}), 404

    repair.repair_status = new_status
    db.session.commit()

    return jsonify({"message": "Repair status updated"}), 200

########################################################################################################################################################

# Route to update repair cost and payment status (admin only)
@app.route('/admin/update-repair-cost/<int:repair_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_repair_cost(repair_id):
    data = request.get_json()
    cost = data.get('cost')
    paid = data.get('paid')
    repair_description = data.get('repair_description')  # รับค่า repair_description

    repair = Repair.query.get(repair_id)
    if not repair:
        return jsonify({"error": "Repair not found"}), 404

    repair.cost = cost
    repair.paid = paid
    repair.repair_description = repair_description  # อัปเดต repair_description
    db.session.commit()

    return jsonify({"message": "Repair cost and payment status updated"}), 200

########################################################################################################################################################

@app.route('/admin/customers', methods=['GET'])
@jwt_required()
@admin_required  # ใช้ฟังก์ชันนี้เพื่อป้องกันการเข้าถึงจากผู้ที่ไม่ใช่ admin
def get_all_customers():
    customers = Customer.query.all()

    customer_list = [{
        "id": customer.id,
        "name": customer.name,
        "email": customer.email,
        "phone": customer.phone,
        "role": customer.role
    } for customer in customers]

    return jsonify(customer_list), 200



########################################################################################################################################################

@app.route('/admin/customer-repairs/<int:customer_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_customer_repairs(customer_id):
    repairs = Repair.query.join(Laptop).filter(Laptop.customer_id == customer_id).all()

    if not repairs:
        return jsonify({"error": "No repair history found for this customer"}), 404

    repair_list = [{
        "repair_id": repair.id,
        "brand": repair.laptop.brand,
        "model": repair.laptop.model,
        "serial_number": repair.laptop.serial_number,
        "issue_description": repair.laptop.issue_description,
        "repair_status": repair.repair_status,
        "cost": repair.cost,
        "paid": repair.paid,
        "created_at": repair.created_at,
        "updated_at": repair.updated_at
    } for repair in repairs]

    return jsonify(repair_list), 200


########################################################################################################################################################


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


########################################################################################################################################################


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = Customer.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # สร้าง JWT token
    access_token = create_access_token(identity=user.id)

    # ส่ง user_id กลับมาใน response ด้วย
    return jsonify({
        "access_token": access_token,
        "role": user.role,
        "user_id": user.id  # ตรวจสอบว่าคุณส่ง user_id กลับมาด้วย
    }), 200


########################################################################################################################################################

# Route สำหรับดึง profile ตาม user_id
@app.route('/profile/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    current_user_id = get_jwt_identity()  # ดึงค่า ID ของผู้ใช้ที่ทำการ login อยู่
    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    user = Customer.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role
    }), 200


########################################################################################################################################################

# Admin profile route
@app.route('/admin/profile', methods=['GET'])
@jwt_required()  # Requires the user to be logged in with a valid JWT token
@admin_required  # Requires the user to have admin role
def admin_profile():
    current_user_id = get_jwt_identity()
    admin = Customer.query.get(current_user_id)

    if not admin:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": admin.id,
        "name": admin.name,
        "email": admin.email,
        "phone": admin.phone,
        "role": admin.role
    }), 200

########################################################################################################################################################


with app.app_context():
     db.create_all()

if __name__ == '__main__':
    
    app.run(debug=True)
