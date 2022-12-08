import {AiOutlineSearch} from 'react-icons/ai'
import JobItem from '../JobItem'
import './index.css'

const JobsListSection = props => {
  const {jobsList, changeSearchInput} = props
  let searchInput = ''
  const updateSearchInput = event => {
    searchInput = event.target.value
  }
  const onSearch = () => {
    changeSearchInput(searchInput)
  }

  const jobsView = () => (
    <div>
      <div>
        <input type="search" onChange={updateSearchInput} className="search" />
        <button type="button" onClick={onSearch}>
          <AiOutlineSearch />
        </button>
      </div>
      <ul className="jobs-list">
        {jobsList.map(job => (
          <JobItem jobDetails={job} key={job.id} />
        ))}
      </ul>
    </div>
  )

  const noProductsView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )
  return jobsList.length > 0 ? jobsView() : noProductsView()
}

export default JobsListSection
