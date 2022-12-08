import {GoLocation} from 'react-icons/go'
import {BsBriefcase, BsStar} from 'react-icons/bs'

const SimilarJob = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails
  return (
    <li className="similar-jobs">
      <div className="logo-title">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div>
          <h1 className="job-title">{title}</h1>
          <p className="rating">
            <BsStar /> {rating}
          </p>
        </div>
      </div>
      <h1 className="heading">Description</h1>
      <p className="description">{jobDescription}</p>
      <div>
        <div className="item">
          <GoLocation />
          <p>{location}</p>
        </div>
        <div className="item">
          <BsBriefcase />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJob
