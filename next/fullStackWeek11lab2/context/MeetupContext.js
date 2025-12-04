/**
 * MeetupContext - Centralized state management for the Meetup application
 * 
 * This context manages:
 * - Meetup data (CRUD operations)
 * - UI state (loading, errors, hamburger menu)
 * - Filter/search functionality
 * - Favorites/bookmarks
 * 
 * All database interactions go through API routes to maintain separation of concerns
 */

import { createContext, useState, useEffect } from 'react'

const MeetupContext = createContext()

export function MeetupContextProvider(props) {
    const [globals, setGlobals] = useState({
        meetings: [],
        favorites: [],
        dataLoaded: false,
        isLoading: false,
        error: null,
        hideHamMenu: true,
        searchQuery: '',
        filterAddress: '',
        notification: null // { message: string, type: 'success' | 'error' | 'info' }
    })

    // Load data on mount
    useEffect(() => {
        getAllMeetings()
        // Only load favorites on client side (localStorage not available on server)
        if (typeof window !== 'undefined') {
            loadFavoritesFromStorage()
        }
    }, []);

    // Load favorites from localStorage
    function loadFavoritesFromStorage() {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('meetup-favorites')
                if (stored) {
                    const favorites = JSON.parse(stored)
                    setGlobals((prev) => ({
                        ...prev,
                        favorites: favorites
                    }))
                }
            }
        } catch (error) {
            console.error('Error loading favorites:', error)
        }
    }

    // Save favorites to localStorage
    function saveFavoritesToStorage(favorites) {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('meetup-favorites', JSON.stringify(favorites))
            }
        } catch (error) {
            console.error('Error saving favorites:', error)
        }
    }

    /**
     * Fetch all meetups from the database
     */
    async function getAllMeetings() {
        setGlobals((prev) => ({ ...prev, isLoading: true, error: null }))
        
        try {
            const response = await fetch('/api/get-meetings', {
                method: 'POST',
                body: JSON.stringify({ meetups: 'all' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch meetups')
            }

            const data = await response.json();
            
            setGlobals((prev) => ({
                ...prev,
                meetings: data.meetings || [],
                dataLoaded: true,
                isLoading: false,
                error: null
            }))
        } catch (error) {
            setGlobals((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Failed to load meetups. Please try again.',
                dataLoaded: true
            }))
            console.error('Error fetching meetups:', error)
        }
    }

    /**
     * Add a new meetup
     */
    async function addMeeting(meetingData) {
        setGlobals((prev) => ({ ...prev, isLoading: true, error: null }))

        try {
            const response = await fetch('/api/new-meetup', {
                method: 'POST',
                body: JSON.stringify(meetingData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            // Check if the response indicates success (even if HTTP status isn't perfect)
            if (data.response === 'success' || response.ok) {
                // Refresh the meetup list to get the latest data from DB
                await getAllMeetings()
                setGlobals((prev) => ({
                    ...prev,
                    isLoading: false,
                    notification: { message: 'Meetup created successfully!', type: 'success' }
                }))
                return { success: true }
            } else {
                throw new Error(data.error || 'Server returned failure status')
            }
        } catch (error) {
            setGlobals((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Failed to create meetup. Please try again.',
                notification: { message: 'Failed to create meetup', type: 'error' }
            }))
            console.error('Error creating meetup:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Update an existing meetup
     */
    async function updateMeeting(meetingId, updatedData) {
        setGlobals((prev) => ({ ...prev, isLoading: true, error: null }))

        try {
            const response = await fetch('/api/update-meetup', {
                method: 'POST',
                body: JSON.stringify({ meetingId, ...updatedData }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update meetup')
            }

            const data = await response.json();
            
            if (data.response === 'success') {
                setGlobals((prev) => ({
                    ...prev,
                    meetings: prev.meetings.map(m => 
                        m.meetingId === meetingId ? { ...m, ...updatedData } : m
                    ),
                    isLoading: false,
                    notification: { message: 'Meetup updated successfully!', type: 'success' }
                }))
                return { success: true }
            } else {
                throw new Error('Server returned failure status')
            }
        } catch (error) {
            setGlobals((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Failed to update meetup. Please try again.',
                notification: { message: 'Failed to update meetup', type: 'error' }
            }))
            console.error('Error updating meetup:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Delete a meetup
     */
    async function deleteMeeting(meetingId) {
        setGlobals((prev) => ({ ...prev, isLoading: true, error: null }))

        try {
            const response = await fetch('/api/delete-meetup', {
                method: 'POST',
                body: JSON.stringify({ meetingId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete meetup')
            }

            const data = await response.json();
            
            if (data.response === 'success') {
                setGlobals((prev) => ({
                    ...prev,
                    meetings: prev.meetings.filter(m => m.meetingId !== meetingId),
                    favorites: prev.favorites.filter(id => id !== meetingId),
                    isLoading: false,
                    notification: { message: 'Meetup deleted successfully!', type: 'success' }
                }))
                return { success: true }
            } else {
                throw new Error('Server returned failure status')
            }
        } catch (error) {
            setGlobals((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Failed to delete meetup. Please try again.',
                notification: { message: 'Failed to delete meetup', type: 'error' }
            }))
            console.error('Error deleting meetup:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Toggle favorite status for a meetup
     */
    function toggleFavorite(meetingId) {
        setGlobals((prev) => {
            const isFavorite = prev.favorites.includes(meetingId)
            const newFavorites = isFavorite
                ? prev.favorites.filter(id => id !== meetingId)
                : [...prev.favorites, meetingId]
            
            saveFavoritesToStorage(newFavorites)
            
            return {
                ...prev,
                favorites: newFavorites,
                notification: {
                    message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
                    type: 'info'
                }
            }
        })
    }

    /**
     * Set search query for filtering meetups
     */
    function setSearchQuery(query) {
        setGlobals((prev) => ({ ...prev, searchQuery: query }))
    }

    /**
     * Set address filter
     */
    function setFilterAddress(address) {
        setGlobals((prev) => ({ ...prev, filterAddress: address }))
    }

    /**
     * Toggle hamburger menu visibility
     */
    function toggleHamMenu(isHidden) {
        setGlobals((prev) => ({ ...prev, hideHamMenu: isHidden }))
    }

    /**
     * Clear notification
     */
    function clearNotification() {
        setGlobals((prev) => ({ ...prev, notification: null }))
    }

    /**
     * Get filtered meetups based on search and filter criteria
     */
    function getFilteredMeetings() {
        let filtered = globals.meetings

        // Apply search filter
        if (globals.searchQuery) {
            const query = globals.searchQuery.toLowerCase()
            filtered = filtered.filter(m => 
                m.title?.toLowerCase().includes(query) ||
                m.description?.toLowerCase().includes(query) ||
                m.address?.toLowerCase().includes(query)
            )
        }

        // Apply address filter
        if (globals.filterAddress) {
            const filter = globals.filterAddress.toLowerCase()
            filtered = filtered.filter(m => 
                m.address?.toLowerCase().includes(filter)
            )
        }

        return filtered
    }

    /**
     * Get statistics about meetups
     */
    function getStatistics() {
        const meetings = globals.meetings
        const addresses = meetings.map(m => m.address).filter(Boolean)
        
        // Count meetups by address
        const addressCounts = addresses.reduce((acc, addr) => {
            acc[addr] = (acc[addr] || 0) + 1
            return acc
        }, {})

        // Find most popular meetup based on average rating
        let mostPopularMeetup = null
        let highestAvgRating = 0
        
        meetings.forEach(meetup => {
            if (meetup.ratings && meetup.ratings.length > 0) {
                const avgRating = meetup.ratings.reduce((sum, r) => sum + r.rating, 0) / meetup.ratings.length
                if (avgRating > highestAvgRating) {
                    highestAvgRating = avgRating
                    mostPopularMeetup = {
                        id: meetup.meetingId,
                        title: meetup.title,
                        avgRating: avgRating,
                        ratingCount: meetup.ratings.length
                    }
                }
            }
        })

        return {
            totalMeetups: meetings.length,
            totalFavorites: globals.favorites.length,
            uniqueAddresses: Object.keys(addressCounts).length,
            mostPopularMeetup: mostPopularMeetup
        }
    }

    /**
     * Add a review to a meetup
     */
    async function addReview(meetingId, review) {
        try {
            const response = await fetch('/api/add-review', {
                method: 'POST',
                body: JSON.stringify({ meetingId, review }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.response === 'success') {
                // Update the meeting in state
                setGlobals((prev) => ({
                    ...prev,
                    meetings: prev.meetings.map(m => 
                        m.meetingId === meetingId ? { ...m, reviews: data.meeting.reviews } : m
                    ),
                    notification: { message: 'Review added successfully!', type: 'success' }
                }))
                return true
            }
            return false
        } catch (error) {
            console.error('Error adding review:', error)
            setGlobals((prev) => ({
                ...prev,
                notification: { message: 'Failed to add review', type: 'error' }
            }))
            return false
        }
    }

    /**
     * Add or update a rating for a meetup
     */
    async function addRating(meetingId, rating) {
        try {
            const response = await fetch('/api/add-rating', {
                method: 'POST',
                body: JSON.stringify({ meetingId, rating }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.response === 'success') {
                // Update the meeting in state
                setGlobals((prev) => ({
                    ...prev,
                    meetings: prev.meetings.map(m => 
                        m.meetingId === meetingId ? { ...m, ratings: data.meeting.ratings } : m
                    ),
                    notification: { message: 'Rating added successfully!', type: 'success' }
                }))
                return true
            }
            return false
        } catch (error) {
            console.error('Error adding rating:', error)
            setGlobals((prev) => ({
                ...prev,
                notification: { message: 'Failed to add rating', type: 'error' }
            }))
            return false
        }
    }

    /**
     * Add an RSVP to a meetup
     */
    async function addRSVP(meetingId, rsvp) {
        try {
            const response = await fetch('/api/add-rsvp', {
                method: 'POST',
                body: JSON.stringify({ meetingId, rsvp }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.response === 'success') {
                // Update the meeting in state
                setGlobals((prev) => ({
                    ...prev,
                    meetings: prev.meetings.map(m => 
                        m.meetingId === meetingId ? { ...m, rsvps: data.meeting.rsvps } : m
                    ),
                    notification: { message: 'RSVP confirmed!', type: 'success' }
                }))
                return true
            } else if (data.response === 'already_rsvpd') {
                setGlobals((prev) => ({
                    ...prev,
                    notification: { message: 'You have already RSVP\'d to this meetup', type: 'info' }
                }))
                return false
            }
            return false
        } catch (error) {
            console.error('Error adding RSVP:', error)
            setGlobals((prev) => ({
                ...prev,
                notification: { message: 'Failed to add RSVP', type: 'error' }
            }))
            return false
        }
    }

    /**
     * Remove an RSVP from a meetup
     */
    async function removeRSVP(meetingId, userId) {
        try {
            const response = await fetch('/api/remove-rsvp', {
                method: 'POST',
                body: JSON.stringify({ meetingId, userId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.response === 'success') {
                // Update the meeting in state
                setGlobals((prev) => ({
                    ...prev,
                    meetings: prev.meetings.map(m => 
                        m.meetingId === meetingId ? { ...m, rsvps: data.meeting.rsvps } : m
                    ),
                    notification: { message: 'RSVP cancelled', type: 'info' }
                }))
                return true
            }
            return false
        } catch (error) {
            console.error('Error removing RSVP:', error)
            setGlobals((prev) => ({
                ...prev,
                notification: { message: 'Failed to cancel RSVP', type: 'error' }
            }))
            return false
        }
    }

    // Context value with all functions and state
    const context = {
        // State
        meetings: globals.meetings,
        favorites: globals.favorites,
        dataLoaded: globals.dataLoaded,
        isLoading: globals.isLoading,
        error: globals.error,
        hideHamMenu: globals.hideHamMenu,
        searchQuery: globals.searchQuery,
        filterAddress: globals.filterAddress,
        notification: globals.notification,
        
        // Functions
        getAllMeetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        toggleFavorite,
        setSearchQuery,
        setFilterAddress,
        toggleHamMenu,
        clearNotification,
        getFilteredMeetings,
        getStatistics,
        addReview,
        addRating,
        addRSVP,
        removeRSVP,
        
        // Helper
        isFavorite: (meetingId) => globals.favorites.includes(meetingId)
    }

    return (
        <MeetupContext.Provider value={context}>
            {props.children}
        </MeetupContext.Provider>
    )
}

export default MeetupContext
