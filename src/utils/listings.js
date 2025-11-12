// // src/utils/listings.js
// // Small utility used by MessageThread and Browse pages
// export function getListings() {
//   try {
//     return JSON.parse(localStorage.getItem('srm_listings') || '[]')
//   } catch {
//     return []
//   }
// }

// export function saveListings(list) {
//   localStorage.setItem('srm_listings', JSON.stringify(list))
// }

// src/utils/listings.js
// -----------------------------------------------------------------------------
// Utility functions for managing listings stored in localStorage.
// These helpers are used by: Browse.jsx, PostItem.jsx, Dashboard.jsx,
// MessageThread.jsx, and Messages.jsx.
// -----------------------------------------------------------------------------

const KEY = 'srm_listings'

/**
 * Get all listings from localStorage.
 * @returns {Array<Object>} Array of listing objects
 */
export function getListings() {
  try {
    const data = localStorage.getItem(KEY)
    return data ? JSON.parse(data) : []
  } catch (err) {
    console.error('❌ Failed to parse listings:', err)
    return []
  }
}

/**
 * Save an array of listings back into localStorage.
 * @param {Array<Object>} list - The updated array of listings
 */
export function saveListings(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list || []))
  } catch (err) {
    console.error('❌ Failed to save listings:', err)
  }
}

/**
 * Get a single listing by its numeric ID.
 * @param {number|string} id - Listing ID
 * @returns {Object|null} Listing object or null if not found
 */
export function getListingById(id) {
  const all = getListings()
  const numId = Number(id)
  return all.find(item => Number(item.id) === numId) || null
}

/**
 * Add a new listing to storage.
 * Automatically assigns `id` and `createdAt`.
 * @param {Object} item - New listing object (without id)
 * @returns {Object} The newly added listing with id
 */
export function addListing(item) {
  const all = getListings()
  const newItem = {
    ...item,
    id: item.id || Date.now(),
    createdAt: new Date().toISOString(),
  }
  all.unshift(newItem)
  saveListings(all)
  return newItem
}

/**
 * Update an existing listing by ID.
 * @param {number|string} id - Listing ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated listing or null if not found
 */
export function updateListing(id, updates) {
  const all = getListings()
  const idx = all.findIndex(l => Number(l.id) === Number(id))
  if (idx === -1) return null
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() }
  saveListings(all)
  return all[idx]
}

/**
 * Delete a listing by ID.
 * @param {number|string} id - Listing ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteListing(id) {
  const all = getListings()
  const filtered = all.filter(l => Number(l.id) !== Number(id))
  if (filtered.length === all.length) return false
  saveListings(filtered)
  return true
}

/**
 * Get all listings owned by a specific user.
 * @param {number|string} ownerId - User ID
 * @returns {Array<Object>} Listings belonging to that user
 */
export function getListingsByOwner(ownerId) {
  const all = getListings()
  return all.filter(l => Number(l.ownerId) === Number(ownerId))
}
