import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// categories per your request
const CATEGORIES = ['Electronics','Books','Accessories','Documents','Clothing','Keys','Other']
const MAX_IMAGES = 5
const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB

function readFileAsDataURL(file){
  return new Promise((res, rej) => {
    const fr = new FileReader()
    fr.onload = () => res(fr.result)
    fr.onerror = rej
    fr.readAsDataURL(file)
  })
}

function getListings(){
  try { return JSON.parse(localStorage.getItem('srm_listings') || '[]') } catch { return [] }
}
function saveListings(list){ localStorage.setItem('srm_listings', JSON.stringify(list)) }

export default function PostItem(){
  const nav = useNavigate()
  const { id } = useParams() // optional for edit
  const auth = (()=> { try{ return JSON.parse(localStorage.getItem('srm_auth')||'null') }catch{return null} })()
  useEffect(()=>{ if (!auth) nav('/login') }, [auth, nav])

  const editingId = id ? Number(id) : null
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', type: 'Found', category: 'Electronics', location: '', images: [], status: 'active'
  })
  const [errors, setErrors] = useState({})

  // if editing load item
  useEffect(()=>{
    if (editingId){
      const existing = getListings().find(x=>x.id === editingId)
      if (existing) setForm({...existing})
    }
  }, [editingId])

  function onChange(e){
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function onFilesChange(e){
    const files = Array.from(e.target.files || [])
    // combine with existing images but enforce max
    const current = form.images || []
    if (current.length + files.length > MAX_IMAGES){
      setErrors({images: `Max ${MAX_IMAGES} images allowed (you already have ${current.length}).`})
      return
    }

    // validate size
    for (const f of files){
      if (f.size > MAX_IMAGE_BYTES){
        setErrors({images: `File "${f.name}" exceeds 10 MB limit.`})
        return
      }
    }

    setErrors({})
    setLoading(true)
    try {
      const dataUrls = await Promise.all(files.map(readFileAsDataURL))
      setForm(prev => ({ ...prev, images: [...(prev.images||[]), ...dataUrls] }))
    } catch (err){
      setErrors({images: 'Failed to read files.'})
    } finally {
      setLoading(false)
    }
  }

  function removeImage(idx){
    setForm(f => ({ ...f, images: f.images.filter((_,i)=>i!==idx) }))
  }

  function validate(){
    const e = {}
    if (!form.title.trim()) e.title = 'Title required'
    if (!form.description.trim()) e.description = 'Description required'
    if (!form.location.trim()) e.location = 'Location required'
    if (!['Lost','Found'].includes(form.type)) e.type = 'Invalid type'
    if (!CATEGORIES.includes(form.category)) e.category = 'Invalid category'
    return e
  }

  function getOwnerId(){ return auth?.id || null }

  function persist(listing){
    const all = getListings()
    if (editingId){
      const idx = all.findIndex(x=>x.id===editingId)
      if (idx !== -1) all[idx] = listing
    } else {
      all.unshift(listing) // add to front
    }
    saveListings(all)
  }

  async function onSubmit(e){
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    setLoading(true)

    const now = new Date().toISOString()
    const listing = {
      id: editingId || Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      category: form.category,
      location: form.location.trim(),
      images: form.images || [],
      status: form.status || 'active',
      ownerId: getOwnerId(),
      ownerName: auth?.fullName || 'Anonymous',
      createdAt: editingId ? (form.createdAt || now) : now,
      updatedAt: now
    }

    persist(listing)
    setLoading(false)
    nav('/browse')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 shadow">
          <h2 className="text-2xl font-bold">{editingId ? 'Edit Item' : 'Post Lost / Found Item'}</h2>
          <p className="text-sm text-gray-500 mt-1">Categories: {CATEGORIES.join(', ')}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input name="title" value={form.title} onChange={onChange}
                className={`mt-2 w-full px-3 py-2 rounded border ${errors.title ? 'border-red-300' : 'border-gray-200'}`} />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <select name="type" value={form.type} onChange={onChange} className="mt-2 w-48 px-3 py-2 rounded border border-gray-200">
                <option>Found</option>
                <option>Lost</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select name="category" value={form.category} onChange={onChange} className="mt-2 w-64 px-3 py-2 rounded border border-gray-200">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <input name="location" value={form.location} onChange={onChange} className="mt-2 w-full px-3 py-2 rounded border border-gray-200"/>
              {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={onChange} rows={4} className="mt-2 w-full px-3 py-2 rounded border border-gray-200"/>
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Images (max {MAX_IMAGES}, ≤ 10MB each)</label>
              <input type="file" accept="image/*" multiple onChange={onFilesChange} className="mt-2" />
              {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}

              <div className="mt-3 grid grid-cols-4 gap-2">
                { (form.images || []).map((src, i) => (
                  <div key={i} className="relative rounded overflow-hidden border">
                    <img src={src} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                    <button type="button" onClick={()=>removeImage(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 text-xs">×</button>
                  </div>
                )) }
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white">
                  {loading ? 'Saving...' : (editingId ? 'Save Changes' : 'Post Item')}
                </button>
              </div>
              <div className="text-sm text-gray-500">Status:
                <select name="status" value={form.status} onChange={onChange} className="ml-2 px-2 py-1 border rounded">
                  <option value="active">active</option>
                  <option value="claimed">claimed</option>
                  <option value="resolved">resolved</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
