import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <main className="max-w-7xl mx-auto px-6 py-14">
      <div className="rounded-lg p-8" style={{background: 'linear-gradient(180deg, rgba(243,247,255,1) 0%, rgba(238,243,255,1) 100%)'}}>
        <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 text-center">
          <span className="block">Find What You Lost,</span>
          <span className="block text-[#5b4bff]">Return What You Found</span>
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-center text-gray-500 text-lg">
          A secure platform exclusively for SRMIST students to report and reclaim lost items on campus.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          
          <Link to="/browse" className="inline-block px-8 py-4 rounded-xl text-white font-semibold" style={{background: 'linear-gradient(180deg,#5b4bff,#4a39d9)', boxShadow: '0 8px 24px rgba(75,58,255,0.12)'}}>Browse Items</Link>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {title: 'Verified Access', desc: 'Only SRMIST accounts can post or claim items.', icon: 'shield'},
          {title: 'Easy Posting', desc: 'Create a listing in seconds with images and descriptions.', icon: 'box'},
          {title: 'Smart Search', desc: 'Filter listings by type, category, and keywords.', icon: 'search'},
          {title: 'Private Messaging', desc: 'Contact owners securely to arrange returns.', icon: 'message'},
        ].map((c) => (
          <div key={c.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center border border-indigo-100">
              {/* simple placeholders for icons */}
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d={c.icon === 'shield' ? 'M12 2l7 4v6c0 5-3.58 9.74-7 11-3.42-1.26-7-6-7-11V6l7-4z' : c.icon === 'box' ? 'M3 7l9-4 9 4v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z' : c.icon === 'search' ? 'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z' : 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'} />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{c.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}