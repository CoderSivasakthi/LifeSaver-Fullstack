#!/usr/bin/env python
"""
LifeSaver Backend Startup Script
Starts the FastAPI server with uvicorn
"""
import uvicorn
import sys
import os

def main():
    """Start the FastAPI server"""
    print("🚀 Starting LifeSaver Backend Server...")
    print("📍 API will be available at: http://localhost:8000")
    print("📚 API Docs will be available at: http://localhost:8000/docs")
    print("⚠️  Make sure MongoDB is running at mongodb://localhost:27017")
    print()
    
    try:
        uvicorn.run(
            "server:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
