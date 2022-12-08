import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import JobsListSection from '../JobsListSection'
import LoaderView from '../LoaderView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    employmentTypeList: [],
    minimumPackage: '',
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
  }

  changeSearchInput = searchInput => this.setState({searchInput}, this.getJobs)

  changeEmployeeType = (employmentType, isChecked) => {
    if (isChecked) {
      this.setState(
        prevState => ({
          employmentTypeList: [...prevState.employmentTypeList, employmentType],
        }),
        this.getJobs,
      )
    } else {
      this.setState(prevState => ({
        employmentTypeList: prevState.employmentTypeList.filter(
          type => type !== employmentType,
        ),
      }))
    }
  }

  changeSalaryRange = minimumPackage => {
    this.setState({minimumPackage}, this.getJobs)
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput, employmentTypeList, minimumPackage} = this.state
    const employmentType = employmentTypeList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(searchInput)
    if (response.ok) {
      const data = await response.json()
      const {jobs} = data
      const jobsList = jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({jobsList, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsView = () => {
    const {jobsList} = this.state
    return (
      <JobsListSection
        changeSearchInput={this.changeSearchInput}
        jobsList={jobsList}
      />
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return <LoaderView />
      case apiStatusConstants.success:
        return this.renderJobsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-bg">
        <Header />
        <div className="jobs">
          <FiltersGroup
            changeEmployeeType={this.changeEmployeeType}
            changeSalaryRange={this.changeSalaryRange}
            getJobs={this.getJobs}
          />
          {this.renderView()}
        </div>
      </div>
    )
  }
}

export default Jobs
