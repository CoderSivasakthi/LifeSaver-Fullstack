from fastapi import FastAPI, APIRouter, HTTPException, Response
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, validator
from typing import List, Optional
import uuid
from datetime import datetime
import qrcode
import io
import base64
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import tempfile

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class EmergencyDetails(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    blood_group: str
    guardian_name: str
    guardian_phone: str
    address: str
    aadhar: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    @validator('blood_group')
    def validate_blood_group(cls, v):
        valid_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        if v not in valid_groups:
            raise ValueError('Invalid blood group')
        return v

class EmergencyDetailsCreate(BaseModel):
    name: str
    phone: str
    blood_group: str
    guardian_name: str
    guardian_phone: str
    address: str
    aadhar: str

class PublicProfile(BaseModel):
    name: str
    phone: str
    blood_group: str

# Helper functions
def generate_qr_code(data: str) -> str:
    """Generate QR code and return as base64 string"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img_io = io.BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    
    return base64.b64encode(img_io.getvalue()).decode()

def create_qr_image_file(data: str, size=(200, 200)) -> str:
    """Create QR code image file and return path"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img = img.resize(size)
    
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
    img.save(temp_file.name)
    return temp_file.name

def generate_pdf(user_data: EmergencyDetails, profile_url: str) -> str:
    """Generate PDF matching the template"""
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    
    # Create QR code images
    main_qr_path = create_qr_image_file(profile_url, (180, 180))
    sticker_qr_path = create_qr_image_file(profile_url, (120, 120))
    
    # Create PDF
    c = canvas.Canvas(temp_file.name, pagesize=A4)
    width, height = A4
    
    # Title
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, height - 80, f"{user_data.name} - Life Saver")
    
    # User details section (left side)
    c.setFont("Helvetica-Bold", 14)
    y_pos = height - 140
    c.drawString(50, y_pos, f"Name: {user_data.name}")
    y_pos -= 25
    c.drawString(50, y_pos, f"Phone: {user_data.phone}")
    y_pos -= 25
    c.drawString(50, y_pos, f"Blood Group: {user_data.blood_group}")
    
    # QR Code (right side)
    c.drawImage(main_qr_path, width - 230, height - 280, 180, 180)
    
    # Security note
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 320, "Your Data is Safe with Us. We value your privacy. All your personal and")
    c.drawString(50, height - 335, "medical details are stored securely in our database and will never be")
    c.drawString(50, height - 350, "disclosed without your consent.")
    
    # Instructions section
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 400, "How to Use Your Stickers")
    
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 430, "This PDF contains two QR stickers along with your details. Once you")
    c.drawString(50, height - 445, "download and print this file:")
    
    c.drawString(50, height - 470, "• Cut the Stickers - Carefully cut out the two QR stickers.")
    c.drawString(50, height - 490, "• Sticker 1 - Place it on your vehicle whether it can be easily seen in case")
    c.drawString(50, height - 505, "  of an emergency.")
    c.drawString(50, height - 525, "• Sticker 2 - Place it on your helmet or personal items (wallet, ID, bag).")
    
    # Why Important section
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 570, "Why is this Important?")
    
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 600, "In case of an accident, first responders can scan your QR to access your")
    c.drawString(50, height - 615, "essential details (Blood group, Emergency contacts).")
    
    # Thank you section
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 660, "Thank You for Using Our Platform")
    
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 690, "By using our service, you're taking a step toward your safety and your")
    c.drawString(50, height - 705, "loved ones' safety.")
    
    # Separator line
    c.line(50, height - 750, width - 50, height - 750)
    
    # Stickers section
    sticker_y = height - 850
    
    # Sticker 1
    c.setFont("Helvetica-Bold", 14)
    c.drawString(150, sticker_y + 140, "Sticker 1")
    c.rect(100, sticker_y, 200, 140, stroke=1, fill=0)
    c.drawImage(sticker_qr_path, 140, sticker_y + 10, 120, 120)
    c.setFont("Helvetica", 12)
    c.drawString(160, sticker_y - 15, user_data.name)
    
    # Sticker 2
    c.drawString(400, sticker_y + 140, "Sticker 2")
    c.rect(350, sticker_y, 200, 140, stroke=1, fill=0)
    c.drawImage(sticker_qr_path, 390, sticker_y + 10, 120, 120)
    c.drawString(410, sticker_y - 15, user_data.name)
    
    # Footer
    c.setFont("Helvetica", 10)
    c.drawRightString(width - 50, 30, "Thanks for using our platform")
    c.drawRightString(width - 50, 15, "@ copyrights by LifeLine")
    
    c.save()
    
    # Clean up temp QR files
    os.unlink(main_qr_path)
    os.unlink(sticker_qr_path)
    
    return temp_file.name

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Life Saver QR API"}

@api_router.post("/details", response_model=EmergencyDetails)
async def create_emergency_details(details: EmergencyDetailsCreate):
    """Save emergency details to database"""
    try:
        details_dict = details.dict()
        emergency_obj = EmergencyDetails(**details_dict)
        
        # Save to MongoDB
        await db.emergency_details.insert_one(emergency_obj.dict())
        
        return emergency_obj
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

@api_router.get("/details/{user_id}", response_model=EmergencyDetails)
async def get_emergency_details(user_id: str):
    """Get complete emergency details by ID"""
    details = await db.emergency_details.find_one({"id": user_id})
    if not details:
        raise HTTPException(status_code=404, detail="User not found")
    
    return EmergencyDetails(**details)

@api_router.get("/profile/{user_id}", response_model=PublicProfile)
async def get_public_profile(user_id: str):
    """Get public profile for QR scan (limited info)"""
    details = await db.emergency_details.find_one({"id": user_id})
    if not details:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return PublicProfile(
        name=details["name"],
        phone=details["phone"],
        blood_group=details["blood_group"]
    )

@api_router.get("/qr-code/{user_id}")
async def get_user_qr_code(user_id: str):
    """Generate and return QR code image for user"""
    details = await db.emergency_details.find_one({"id": user_id})
    if not details:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate profile URL for QR code
    frontend_url = os.environ.get('FRONTEND_URL', 'https://emerqr.preview.emergentagent.com')
    profile_url = f"{frontend_url}/profile/{user_id}"
    
    # Generate QR code
    qr_image_path = create_qr_image_file(profile_url, (200, 200))
    
    return FileResponse(
        qr_image_path,
        media_type='image/png',
        filename=f"{user_id}-qr.png"
    )

@api_router.get("/generate-pdf/{user_id}")
async def generate_user_pdf(user_id: str):
    """Generate and return PDF for user"""
    details = await db.emergency_details.find_one({"id": user_id})
    if not details:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = EmergencyDetails(**details)
    
    # Generate profile URL for QR code
    frontend_url = os.environ.get('FRONTEND_URL', 'https://emerqr.preview.emergentagent.com')
    profile_url = f"{frontend_url}/profile/{user_id}"
    
    # Generate PDF
    pdf_path = generate_pdf(user_data, profile_url)
    
    return FileResponse(
        pdf_path,
        media_type='application/pdf',
        filename=f"{user_data.name}-LifeSaver.pdf",
        headers={"Content-Disposition": "attachment; filename=" + f"{user_data.name}-LifeSaver.pdf"}
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
