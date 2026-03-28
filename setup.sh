#!/bin/bash
echo "🎓 Starting EduPulse - College Feedback System"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v16+"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend && npm install

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

echo ""
echo "🌱 Seeding database..."
cd ../backend && npm run seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the app:"
echo "  Terminal 1:  cd backend  && npm run dev"
echo "  Terminal 2:  cd frontend && npm start"
echo ""
echo "Then open: http://localhost:3000"
