import classes from './MainNavigation.module.css'
import Link from 'next/link'
import HamMenu from "../generic/HamMenu"
import HamMenuFAB from "../generic/HamMenuFAB"
import { useContext, useState } from 'react'
import MeetupContext from "../../context/MeetupContext"
import HamMenuContent from "./HamMenuContent"
import { useRouter } from 'next/router'

function MainNavigation() {
  const meetupCtx = useContext(MeetupContext)
  const router = useRouter()
  const [searchInput, setSearchInput] = useState('')

  function toggleMenuHide() {
    meetupCtx.toggleHamMenu(false)
  }

  function handleSearch(e) {
    e.preventDefault()
    meetupCtx.setSearchQuery(searchInput)
    if (router.pathname !== '/') {
      router.push('/')
    }
  }

  function clearSearch() {
    setSearchInput('')
    meetupCtx.setSearchQuery('')
  }

  // Build hamburger menu contents from meetups
  const contents = meetupCtx.meetings.map(element => ({
    title: element.title,
    webAddress: '/' + element.meetingId
  }))

  return (
    <header className={classes.header}>
      <HamMenuContent contents={contents} />
      <HamMenu toggleMenuHide={toggleMenuHide} />
      <HamMenuFAB toggleMenuHide={toggleMenuHide} />
      
      <div className={classes.logo}>
        <Link href='/'>Meetup Hub</Link>
      </div>

      {/* Search Bar */}
      <form className={classes.searchForm} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search meetups..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={classes.searchInput}
        />
        {searchInput && (
          <button 
            type="button" 
            onClick={clearSearch}
            className={classes.clearButton}
          >
            ✕
          </button>
        )}
        <button type="submit" className={classes.searchButton}>
          🔍
        </button>
      </form>

      <nav>
        <ul>
          <li>
            <Link href='/'>All Meetups</Link>
            <span className={classes.badge}>{meetupCtx.meetings.length}</span>
          </li>
          <li>
            <Link href='/favorites'>Favorites</Link>
            {meetupCtx.favorites.length > 0 && (
              <span className={classes.badge}>{meetupCtx.favorites.length}</span>
            )}
          </li>
          <li>
            <Link href='/new-meetup'>Add New</Link>
          </li>
          <li>
            <Link href='/test'>🔧 Test</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation
