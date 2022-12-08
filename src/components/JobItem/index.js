import {Link} from 'react-router-dom'
import {GoLocation} from 'react-icons/go'
import {BsBriefcase, BsStar} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails
  const jobItemUrl = `/jobs/${id}`
  return (
    <Link to={jobItemUrl}>
      <li className="job-item">
        <div className="logo-title">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <h1 className="heading">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
