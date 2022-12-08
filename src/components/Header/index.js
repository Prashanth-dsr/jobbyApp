import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    console.log(props)
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <ul className="header">
      <Link to="/">
        <li>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-header"
          />
        </li>
      </Link>
      <li className="links">
        <Link to="/">
          <p className="nav-link">Home</p>
        </Link>
        <Link to="/jobs">
          <p className="nav-link">Jobs</p>
        </Link>
      </li>
      <li>
        <button type="button" onClick={onLogout} className="btn">
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
