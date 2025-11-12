// // import React, {useState} from 'react'

// // export default function Browse(){
// //   const [q, setQ] = useState('')
// //   const [type, setType] = useState('All Types')
// //   const [category, setCategory] = useState('All Categories')

// //   const summary = (!q && type === 'All Types' && category === 'All Categories')
// //     ? 'No items found matching your criteria.'
// //     : `No items found for "${q || '—'}" • ${type} • ${category}`

// //   return (
// //     <main className="max-w-7xl mx-auto px-6 pt-10 pb-16">
// //       <div>
// //         <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Browse Lost & Found Items</h1>
// //         <p className="mt-3 text-lg text-gray-500">Search and filter through all active listings</p>
// //       </div>

// //       <section className="mt-8">
// //         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
// //             <label className="block">
// //               <span className="text-sm text-gray-700 mb-2 block">Search</span>
// //               <div className="relative">
// //                 <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
// //                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
// //                   </svg>
// //                 </span>
// //                 <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search items..."
// //                   className="w-full md:col-span-2 pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-indigo-200" />
// //               </div>
// //             </label>

// //             <label className="block">
// //               <span className="text-sm text-gray-700 mb-2 block">Type</span>
// //               <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full py-3 px-3 rounded-lg border border-gray-200 bg-white text-gray-700">
// //                 <option>All Types</option>
// //                 <option>Lost</option>
// //                 <option>Found</option>
// //               </select>
// //             </label>

// //             <label className="block md:col-span-1">
// //               <span className="text-sm text-gray-700 mb-2 block">Category</span>
// //               <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full py-3 px-3 rounded-lg border border-gray-200 bg-white text-gray-700">
// //                 <option>All Categories</option>
// //                 <option>Electronics</option>
// //                 <option>Clothing</option>
// //                 <option>Accessories</option>
// //                 <option>Documents</option>
// //               </select>
// //             </label>
// //           </div>
// //         </div>
// //       </section>

// //       <section className="mt-8">
// //         <div className="bg-white rounded-xl shadow-sm p-10 border border-gray-100">
// //           <div className="min-h-[150px] flex items-center justify-center text-gray-500">
// //             {summary}
// //           </div>
// //         </div>
// //       </section>
// //     </main>
// //   )
// // }


// import React, { useMemo, useState } from 'react'
// import { Link } from 'react-router-dom'

// function getListings(){ try { return JSON.parse(localStorage.getItem('srm_listings') || '[]') } catch { return [] } }
// function saveListings(list){ localStorage.setItem('srm_listings', JSON.stringify(list)) }

// export default function Browse(){
//   const [q, setQ] = useState('')
//   const [type, setType] = useState('All Types')
//   const [category, setCategory] = useState('All Categories')
//   const [status, setStatus] = useState('All Statuses')
//   const [refreshKey, setRefreshKey] = useState(0)

//   const auth = (()=>{ try { return JSON.parse(localStorage.getItem('srm_auth')||'null') } catch { return null } })()

//   const allListings = getListings()

//   const filtered = useMemo(()=>{
//     const term = q.trim().toLowerCase()
//     return allListings.filter(item=>{
//       if (type !== 'All Types' && item.type !== type) return false
//       if (category !== 'All Categories' && item.category !== category) return false
//       if (status !== 'All Statuses' && item.status !== status) return false
//       if (!term) return true
//       return (item.title + ' ' + item.description + ' ' + item.location).toLowerCase().includes(term)
//     })
//   }, [allListings, q, type, category, status, refreshKey])

//   function deleteListing(id){
//     if (!confirm('Delete this listing?')) return
//     const next = allListings.filter(x=>x.id !== id)
//     saveListings(next)
//     setRefreshKey(k=>k+1)
//   }

//   function updateStatus(id, newStatus){
//     const next = allListings.map(x => x.id === id ? ({...x, status: newStatus, updatedAt: new Date().toISOString()}) : x)
//     saveListings(next)
//     setRefreshKey(k=>k+1)
//   }

//   return (
//     <main className="max-w-7xl mx-auto px-6 pt-10 pb-16">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-extrabold">Browse Lost & Found Items</h1>
//           <p className="text-gray-500 mt-1">Search and filter through all active listings</p>
//         </div>
//         <div>
//           <Link to="/post" className="px-4 py-2 rounded bg-indigo-600 text-white">Post Item</Link>
//         </div>
//       </div>

//       <div className="mt-6 bg-white rounded-xl p-4 border">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//           <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} className="px-3 py-2 border rounded" />
//           <select value={type} onChange={e=>setType(e.target.value)} className="px-3 py-2 border rounded">
//             <option>All Types</option><option>Lost</option><option>Found</option>
//           </select>
//           <select value={category} onChange={e=>setCategory(e.target.value)} className="px-3 py-2 border rounded">
//             <option>All Categories</option>
//             <option>Electronics</option><option>Books</option><option>Accessories</option><option>Documents</option><option>Clothing</option><option>Keys</option><option>Other</option>
//           </select>
//           <select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2 border rounded">
//             <option>All Statuses</option>
//             <option value="active">active</option>
//             <option value="claimed">claimed</option>
//             <option value="resolved">resolved</option>
//           </select>
//         </div>
//       </div>

//       <section className="mt-6">
//         {filtered.length === 0 ? (
//           <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">No items found matching your criteria.</div>
//         ) : (
//           <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//             {filtered.map(item => (
//               <div key={item.id} className="bg-white rounded-xl p-4 shadow border flex gap-4">
//                 <img src={item.images?.[0] || 'https://via.placeholder.com/200x140?text=No+Image'} alt={item.title} className="w-32 h-24 object-cover rounded" />
//                 <div className="flex-1">
//                   <div className="flex items-start justify-between">
//                     <h3 className="font-semibold text-lg">{item.title}</h3>
//                     <span className={`text-xs px-2 py-1 rounded text-white ${item.status === 'active' ? 'bg-green-600' : item.status === 'claimed' ? 'bg-yellow-600' : 'bg-gray-500'}`}>{item.status}</span>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-1">{item.description}</p>
//                   <div className="mt-2 text-xs text-gray-400">{item.location} • {new Date(item.createdAt).toLocaleString()}</div>

//                   <div className="mt-3 flex items-center gap-2">
//                     <Link to={`/post/${item.id}`} className="text-sm px-3 py-1 border rounded">Edit</Link>
//                     <button onClick={()=>deleteListing(item.id)} className="text-sm px-3 py-1 border rounded">Delete</button>

//                     {/* status control */}
//                     <select value={item.status} onChange={e=>updateStatus(item.id, e.target.value)} className="ml-2 text-sm px-2 py-1 border rounded">
//                       <option value="active">active</option>
//                       <option value="claimed">claimed</option>
//                       <option value="resolved">resolved</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   )
// }

import React, { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import React, { useMemo, useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
import ImageLightbox from '../components/ImageLightbox'   // ← add this


// Helper: read/write listings from localStorage
function getListings(){ try { return JSON.parse(localStorage.getItem('srm_listings') || '[]') } catch { return [] } }
function saveListings(list){ localStorage.setItem('srm_listings', JSON.stringify(list)) }

const CATEGORIES = ['Electronics','Books','Accessories','Documents','Clothing','Keys','Other']

export default function Browse(){
  // filters / UI state
  const [searchRaw, setSearchRaw] = useState('')
  const [type, setType] = useState('All Types')
  const [category, setCategory] = useState('All Categories')
  const [status, setStatus] = useState('active') // default to active listings
  const [refreshKey, setRefreshKey] = useState(0)
  // near other useState hooks in Browse()
const [lightbox, setLightbox] = useState(null)
// shape: null or { images: [url1, url2, ...], startIndex: 0 }


  const auth = (()=>{ try { return JSON.parse(localStorage.getItem('srm_auth')||'null') } catch { return null } })()


  // small debounce for search (300ms)
  const [search, setSearch] = useState(searchRaw)
  useEffect(()=>{
    const t = setTimeout(()=> setSearch(searchRaw.trim().toLowerCase()), 300)
    return ()=> clearTimeout(t)
  }, [searchRaw])

  // load all listings each render from localStorage (keeps in sync with other pages)
  const allListings = getListings()

  // filtering logic (memoized for performance)
  const filtered = useMemo(()=>{
    const term = search || ''
    return allListings.filter(item=>{
      // default: only show active if status === 'active' or if status === 'All Statuses' show all
      if (status !== 'All Statuses' && item.status !== status) return false

      if (type !== 'All Types' && item.type !== type) return false
      if (category !== 'All Categories' && item.category !== category) return false

      if (!term) return true

      const hay = (item.title + ' ' + item.description + ' ' + item.location).toLowerCase()
      return hay.includes(term)
    })
  }, [allListings, search, type, category, status, refreshKey])

  // CRUD helpers
  function deleteListing(id){
    if (!confirm('Delete this listing?')) return
    const next = allListings.filter(x=>x.id !== id)
    saveListings(next)
    setRefreshKey(k=>k+1)
  }

  function updateStatus(id, newStatus){
    const next = allListings.map(x => x.id === id ? ({...x, status: newStatus, updatedAt: new Date().toISOString()}) : x)
    saveListings(next)
    setRefreshKey(k=>k+1)
  }

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Browse Lost & Found</h1>
          <p className="text-gray-500 mt-1">Browse active listings. Use filters or search to narrow results.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/post" className="px-4 py-2 rounded bg-indigo-600 text-white">Post Item</Link>
          <Link to="/browse" className="px-4 py-2 rounded border">Refresh</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white rounded-xl p-4 border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            placeholder="Search by title, description, location..."
            value={searchRaw}
            onChange={e=>setSearchRaw(e.target.value)}
            className="px-3 py-2 border rounded w-full md:col-span-2"
          />

          <select value={type} onChange={e=>setType(e.target.value)} className="px-3 py-2 border rounded">
            <option>All Types</option>
            <option>Lost</option>
            <option>Found</option>
          </select>

          <select value={category} onChange={e=>setCategory(e.target.value)} className="px-3 py-2 border rounded">
            <option>All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Status selector (default 'active'). User can view other statuses if needed */}
          <select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2 border rounded">
            <option value="active">active</option>
            <option value="claimed">claimed</option>
            <option value="resolved">resolved</option>
            <option value="All Statuses">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <section className="mt-6">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
            No items found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow border flex gap-4">
              {/* Clickable thumbnail opens lightbox */}
<button
  type="button"
  onClick={() => {
    // if item.images is empty, do nothing or still show placeholder in lightbox
    const imgs = (item.images && item.images.length) ? item.images : ['https://via.placeholder.com/1200x800?text=No+Image']
    setLightbox({ images: imgs, startIndex: 0 })
  }}
  className="w-32 h-24 rounded overflow-hidden focus:outline-none"
  aria-label={`Open images for ${item.title}`}
>
  <img
    src={item.images?.[0] || 'https://via.placeholder.com/200x140?text=No+Image'}
    alt={item.title}
    className="w-full h-full object-cover"
    draggable={false}
  />
</button>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <div className="text-sm flex flex-col items-end">
                      <span className={`px-2 py-1 rounded text-white ${item.type === 'Found' ? 'bg-green-600' : 'bg-indigo-600'}`}>{item.type}</span>
                      <span className="text-xs text-gray-400 mt-1">{item.category}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <div className="mt-2 text-xs text-gray-400">{item.location} • {new Date(item.createdAt).toLocaleString()}</div>

                  {/* <div className="mt-3 flex items-center gap-2">
                    <Link to={`/post/${item.id}`} className="text-sm px-3 py-1 border rounded">Edit</Link>
                    <button onClick={()=>deleteListing(item.id)} className="text-sm px-3 py-1 border rounded">Delete</button>

                    <select value={item.status} onChange={e=>updateStatus(item.id, e.target.value)} className="ml-2 text-sm px-2 py-1 border rounded">
                      <option value="active">active</option>
                      <option value="claimed">claimed</option>
                      <option value="resolved">resolved</option>
                    </select>
                  </div> */}
                  <div className="mt-3 flex items-center gap-2">
  {/* If the current user is the owner -> show Edit / Delete / Status */}
  {auth && auth.id === item.ownerId ? (
    <>
      <Link to={`/post/${item.id}`} className="text-sm px-3 py-1 border rounded">Edit</Link>
      <button onClick={()=>deleteListing(item.id)} className="text-sm px-3 py-1 border rounded">Delete</button>

      <select
        value={item.status}
        onChange={e=>updateStatus(item.id, e.target.value)}
        className="ml-2 text-sm px-2 py-1 border rounded"
      >
        <option value="active">active</option>
        <option value="claimed">claimed</option>
        <option value="resolved">resolved</option>
      </select>
    </>
  ) : (
    /* Not owner: show Message button (only if logged in), otherwise show a login link */
    <>
      {auth ? (
        <Link
          to={`/messages/${item.id}/${item.ownerId}`}
          className="text-sm px-3 py-1 border rounded text-indigo-600 hover:bg-indigo-50"
        >
          Message
        </Link>
      ) : (
        <Link to="/login" className="text-sm px-3 py-1 border rounded text-gray-600">Log in to message</Link>
      )}
    </>
  )}
</div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

         {lightbox && (
      <ImageLightbox
        images={lightbox.images}
        startIndex={lightbox.startIndex}
        onClose={() => setLightbox(null)}
      />
    )}

    </main>
  )
}

