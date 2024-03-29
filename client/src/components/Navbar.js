import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import Dropdown from './Dropdown'
import Searchbar from './Searchbar'

function Navbar({username}) {
    const [click, setClick] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const onMouseEnter = () => {
        if (window.innerWidth < 960) {
            setDropdown(false);
        }
        else {
            setDropdown(true);
        }
    };

    const onMouseLeave = () => {
        if (window.innerWidth < 960) {
            setDropdown(false);
        }
        else {
            setDropdown(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };
    
    return (
        <>
            <nav className='navbar'>
                <li className='navbar-icon'>
                    <i class="fa-regular fa-book-open-cover"></i>
                </li>
                <Link to='/' className='navbar-logo'>
                    Memento
                </Link>
                <div className="Search"><Searchbar placeholder="Search scraps..."/></div>
                <p className='search-icon'>
                    <i class="fa-solid fa-magnifying-glass"></i>
                </p>
                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                            <i class="fa-solid fa-house"></i>
                        </Link>
                    </li>
                    <li className='nav-item'
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        <p 
                            className='nav-links' 
                            onClick={closeMobileMenu}>
                            <i class="fa-solid fa-plus"></i>
                        </p>
                        {dropdown && <Dropdown />}
                    </li>
                    <li className='nav-item'>
                        <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                            <i class="fa-regular fa-heart"></i>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to={`/user/${username}`} className='nav-links' onClick={closeMobileMenu}>
                        <i class="fa-solid fa-user"></i>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='' className='nav-links' onClick={logout}>
                        <i class="fa-solid fa-sign-out"></i>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
    
}

export default Navbar;
