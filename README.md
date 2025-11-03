# 🌍 Happenix – Frontend
**Live Site:** [https://event-sphere.vercel.app](https://happenix-frontend.vercel.app)  
**Backend Repo:** [https://github.com/bhavyanatani/Happenix-Backend](https://github.com/bhavyanatani/Happenix-Backend)

## 🧩 Overview
Happenix is a real-time event discovery web app that helps users find events happening around their location. Built with **Next.js**, it integrates the **Nominatim API** for geocoding and uses browser **Geolocation API** for personalized results.

## 🚀 Features
- 🌐 Location-based event search using Nominatim API  
- 📍 Automatic geolocation detection  
- 🔍 Dynamic filtering by distance, category, and date  
- ⚡ Optimized API handling for smooth performance  
- 📱 Fully responsive and minimal UI  

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, Axios, Tailwind CSS  
- **API Integration:** Nominatim (OpenStreetMap)  
- **Backend:** Express.js + Node.js (Render hosted)  

## ⚙️ Setup Instructions
1️⃣ Clone the repository  
git clone https://github.com/bhavyanatani/event-sphere-frontend.git  
cd event-sphere-frontend  

2️⃣ Install dependencies  
npm install  

3️⃣ Add environment variables  
Create a file named `.env.local` and add:  
NEXT_PUBLIC_BACKEND_URL=<your_backend_url_here> 

4️⃣ Run the development server  
npm run dev  

The app will be live at **http://localhost:3000**

## ⚠️ Note
Backend is hosted on Render’s free tier, so the first request may take a few seconds to respond.

## 🧑‍💻 Author
**Bhavya Natani**  

