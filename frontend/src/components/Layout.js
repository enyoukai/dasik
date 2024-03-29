import { Outlet, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IconContext } from 'react-icons';
import './Layout.scss'
import axios from "axios";


function Layout() {
  const { user, isAdmin, authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const path = useLocation().pathname;
  const location = useLocation();

  const selected = "nav__tab--selected";
  const unselected = "nav__tab--unselected";

  useEffect(() => {
    if (user) {
      axios.get(`/account/${user.uid}/unreadPosts `).then(res => setNotifications(res.data));
    }
  }, [user, location]);

  return (
    <React.Fragment>
      <nav className="flex items-center gap-x-12 px-10 py-2 bg-neutral-800 sticky top-0">
        <Link to='/' className="nav__logo text-purple-400 text-3xl font-semibold">dasik</Link>
        <div className="nav__tabs">
          <Link to='/' className={`nav__tab text-xl font-medium ${path === '/' || path.startsWith('/club') ? selected : unselected}`}>Home</Link>
          <Link to='newclub' className={`nav__tab text-xl font-medium ${path.startsWith('/newclub') ? selected : unselected}`}>Add Club</Link>
          <Link to='feed' className={`nav__tab text-xl font-medium ${path.startsWith('/feed') ? selected : unselected}`}>Feed</Link>
          <Link to='calendar' className={`nav__tab text-xl font-medium ${path.startsWith('/calendar') ? selected : unselected}`}>Calendar</Link>
          {isAdmin && <Link to='admin' className={`nav__tab text-xl font-medium ${path.startsWith('/admin') ? selected : unselected}`}>Admin</Link>}
        </div>
        {!authLoading &&
          (user === null ? <RegisterBar /> :
            <div className="flex flex-row gap-10">
              <Notifications notifications={notifications} />
              <Avatar uid={user.uid} />
            </div>)}
      </nav>
      <Outlet />
    </React.Fragment>
  )
}

function RegisterBar() {
  return (
    <div className="flex gap-10 items-center">
      <Link to={'signin'} className="text-xl text-neutral-300 hover:text-neutral-100 font-medium">Sign In</Link>
      <Link to={'register'} className="text-xl text-neutral-300 hover:text-neutral-100 font-medium">Register</Link>
    </div>
  )
}

function Notifications(props) {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className='flex items-center' onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
      <Link to={'/notifications'} className='text-neutral-200 inline-block h-100 align-bottom'><IoIosNotificationsOutline size={40} /></Link>
      {dropdown && <NotificationsDropdown notifications={props.notifications} />}
    </div>
  )
}

// dropdown component?
function NotificationsDropdown(props) {
  const {user} = useAuth();

  function deleteNotif(notifId)
  {
    axios.delete(`/account/${user.uid}/unreadPosts/${notifId}`);
  }

  return (
    <div className="absolute bg-neutral-800 flex flex-col text-neutral-200 text-md p-5 top-14 w-1/8 right-14">
      {props.notifications.length > 0 ?
        <ul className="flex flex-col gap-5">
          {props.notifications.map((notif, idx) =>
            <li key={idx}>
              <Link onClick={() => deleteNotif(notif.id)} to={`/feed/${notif.id}`} className="flex flex-row gap-5 align-middle">
                <span className="text-purple-300 text-lg">{notif.club.name}</span>
                <span>Made a new post</span>
              </Link>
            </li>)}
        </ul> : <div className="text-xl">Nothing to show</div>}
    </div>
  )
}

function Avatar(props) {
  const [dropdown, setDropdown] = useState(false);

  function handleMouseEnter() {
    setDropdown(true);
  }

  function handleMouseLeave() {
    setDropdown(false);
  }

  return (
    <div className="nav__account" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link to={'account/' + props.uid}><img className="account__avatar w-15 h-15" src="/defaultprofile.jpg" alt="profile" /></Link>
      {dropdown && <AccountDropdown uid={props.uid} />}
    </div>
  )
}

function AccountDropdown(props) {
  return (
    <div className="account__dropdown">
      <Link className="account__text" to={'account/' + props.uid}>Profile</Link>
      <Link className="account__text" to='settings'>Settings</Link>
      <Link className="account__text" to='signout'>Sign Out</Link>
    </div>
  )
}

export default Layout;