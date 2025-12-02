import classes from './HamMenuContent.module.css'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import MeetupContext from "../../context/MeetupContext"

export default function HamMenuContent(props) {
    const meetupCtx = useContext(MeetupContext)
    const router = useRouter()
    let [popupToggle, setPopupToggle] = useState(false)

    if (meetupCtx.hideHamMenu) {
        return null
    }

    function clicked(webAddress) {
        meetupCtx.toggleHamMenu(true)
        router.push(webAddress)
    }

    function closeMe() {
        meetupCtx.toggleHamMenu(true)
        if (popupToggle == true) {
            setPopupToggle(false)
        } else {
            setPopupToggle(true)
        }
    }

    let contentJsx = props.contents.map((item, index) => (
        <div className={classes.menuItem} key={index} onClick={() => clicked(item.webAddress)} >{item.title} </div>
    ))

    return (
        <div className={classes.background} onClick={() => closeMe()} >
            <div className={classes.mainContent} >
                {contentJsx}
            </div>
        </div>
    );
}
