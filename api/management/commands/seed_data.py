# api/management/commands/seed_data.py
import random
import hashlib
from faker import Faker
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import CertificateMetadata

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with sample university and certificate data'

    def handle(self, *args, **kwargs):
        fake = Faker()
        
        # 1. Create a dummy university account if it doesn't exist
        university, created = User.objects.get_or_create(
            username='demo_university',
            defaults={
                'email': 'admin@demouniversity.edu',
                'university_name': 'Demo University',
                'registration_number': 'REG-99887766',
            }
        )
        
        if created:
            # Set a usable password for testing
            university.set_password('demo1234')
            university.save()
            self.stdout.write(self.style.SUCCESS('Created test university account: demo_university / demo1234'))
        else:
            self.stdout.write(self.style.WARNING('Account demo_university already exists. Skipping creation.'))

        degrees = [
            'BSc. Computer Science', 
            'BSc. Information Technology', 
            'BBA. Business Administration', 
            'BSc. Electrical Engineering',
            'BA. Economics', 
            'BSc. Nursing'
        ]

        self.stdout.write('Generating 20 sample certificates...')
        
        # 2. Generate 20 sample certificates
        for _ in range(20):
            student_name = fake.name()
            degree = random.choice(degrees)
            year = random.randint(2022, 2026)
            
            # Generate a realistic-looking student ID (e.g., CS-2024-492)
            prefix = ''.join([word[0] for word in degree.split()[:2]]).upper()
            student_id = f"{prefix}-{year}-{random.randint(100, 999)}"
            
            # Generate a fake deterministic SHA-256 hash
            fake_pdf_content = f"{student_name}{student_id}{random.random()}".encode('utf-8')
            document_hash = hashlib.sha256(fake_pdf_content).hexdigest()

            # Create the record
            CertificateMetadata.objects.create(
                issuer=university,
                student_name=student_name,
                student_id=student_id,
                degree_name=degree,
                graduation_year=year,
                document_hash=document_hash,
                # Make 10% of the certificates revoked for UI testing
                status=random.choices(['ACTIVE', 'REVOKED'], weights=[90, 10])[0] 
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database!'))