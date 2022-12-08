import {Component} from 'react'
import Cookies from 'js-cookie'
import LoaderView from '../LoaderView'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class FiltersGroup extends Component {
  state = {
    profileDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  onClickRetry = () => {
    this.getProfileDetails()
  }

  onClickEmploymentType = event => {
    const {changeEmployeeType} = this.props
    changeEmployeeType(event.target.value, event.target.checked)
  }

  onClickSalaryChange = event => {
    const {changeSalaryRange} = this.props
    changeSalaryRange(event.target.value)
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const newProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileDetails: newProfileDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return <LoaderView />
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return (
          <button type="button" onClick={this.onClickRetry}>
            Retry
          </button>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div className="filter-group">
        {this.renderView()}
        <hr />
        <div>
          <h1 className="filter-heading">Type of Employment</h1>
          <ul className="filter-item">
            {employmentTypesList.map(item => (
              <li key={item.employmentTypeId}>
                <input
                  type="checkbox"
                  id={item.employmentTypeId}
                  value={item.employmentTypeId}
                  onClick={this.onClickEmploymentType}
                />
                <label htmlFor={item.employmentTypeId} className="filter-label">
                  {item.label}
                </label>
                <br />
              </li>
            ))}
          </ul>
        </div>
        <hr />
        <div>
          <h1 className="filter-heading">Salary Range</h1>
          <ul className="filter-item">
            {salaryRangesList.map(item => (
              <li key={item.salaryRangeId}>
                <input
                  type="radio"
                  id={item.salaryRangeId}
                  name="salaryRange"
                  value={item.salaryRangeId}
                  onClick={this.onClickSalaryChange}
                />
                <label htmlFor={item.salaryRangeId} className="filter-label">
                  {item.label}
                </label>
                <br />
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default FiltersGroup
