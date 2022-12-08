import {Component} from 'react'
import {GoLocation} from 'react-icons/go'
import {BsBriefcase, BsStar} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarJob from '../SimilarJob'
import LoaderView from '../LoaderView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, jobItemDetails: {}}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }
      const {jobDetails, similarJobs} = updatedData
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        title: jobDetails.title,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
      }
      const {skills, lifeAtCompany} = updatedJobDetails
      const updatedSkills = skills.map(item => ({
        imageUrl: item.image_url,
        name: item.name,
      }))
      const updatedLifeAtCompany = {
        description: lifeAtCompany.description,
        imageUrl: lifeAtCompany.image_url,
      }
      updatedJobDetails.skills = updatedSkills
      updatedJobDetails.lifeAtCompany = updatedLifeAtCompany
      updatedData.jobDetails = updatedJobDetails

      const updatedSimilarJobs = similarJobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))
      updatedData.similarJobs = updatedSimilarJobs
      this.setState({
        jobItemDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetails = () => {
    const {jobItemDetails} = this.state
    const {jobDetails} = jobItemDetails
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      title,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
    } = jobDetails
    return (
      <div className="job-item">
        <div className="logo-title">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <p className="rating">
              <BsStar /> {rating}
            </p>
          </div>
        </div>
        <div className="details">
          <div className="location-emp">
            <div className="item">
              <GoLocation />
              <p>{location}</p>
            </div>
            <div className="item">
              <BsBriefcase />
              <p>{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="visit-box">
          <h1 className="heading">Description</h1>
          <a href={companyWebsiteUrl}>Visit</a>
        </div>
        <p className="description">{jobDescription}</p>

        <h1 className="heading">Skills</h1>
        <ul className="ul-style">
          {skills.map(item => (
            <li key={item.name}>
              <img src={item.imageUrl} alt={item.name} />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
        <hr />
        <h1 className="heading">Life at Company</h1>
        <div className="ul-style">
          <p className="description">{lifeAtCompany.description}</p>
          <img src={lifeAtCompany.imageUrl} alt="life at company" />
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {jobItemDetails} = this.state
    const {similarJobs} = jobItemDetails
    return (
      <div>
        <h1>Similar Jobs</h1>
        <ul className="ul-style">
          {similarJobs.map(job => (
            <SimilarJob jobDetails={job} key={job.id} />
          ))}
        </ul>
      </div>
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
      <button type="button" onClick={this.getJobDetails}>
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
        return (
          <>
            {this.renderJobDetails()}
            {this.renderSimilarJobs()}
          </>
        )
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details">
        <Header />
        <div>{this.renderView()}</div>
      </div>
    )
  }
}

export default JobItemDetails
