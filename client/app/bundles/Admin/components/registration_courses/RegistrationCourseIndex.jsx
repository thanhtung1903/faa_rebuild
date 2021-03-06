import React from 'react';
import RegistrationCourse from './RegistrationCourse';
import {Link} from 'react-router-dom';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {defaultMessages} from '../../../../libs/i18n/default';
import axios from 'axios';
import Pagination from '../../utils/Pagination';
import SearchForm from '../../utils/SearchForm';
import SelectedCourse from './SelectedCourse';
import SelectedCourseSchedule from './SelectedCourseSchedule';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
const csrfToken = ReactOnRails.authenticityToken();

class RegistrationCourseIndex extends React.Component {

  constructor(props, _railsContext) {
    super(props);
    this.state = {
      courses: [],
      course_id: 0,
      course_schedules: [],
      course_schedule_id: 0,
      registration_courses: [],
      email_content: "",
      page: 1,
      pages: 0,
      search_word: ""
    };
    // this.handleDeleted = this.handleDeleted.bind(this);
    this.onDeleteHandle = this.onDeleteHandle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getDataFromApi = this.getDataFromApi.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.courseInputChange = this.courseInputChange.bind(this);
    this.scheduleInputChange = this.scheduleInputChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  // handleDeleted(id, message) {
  //   this.setState({
  //     registration_courses: this.state.registration_courses.filter(registration_course => {
  //       return registration_course.id !== id
  //     })
  //   });
  //   $.growl.notice({message: message});
  // }


  onDeleteHandle(cell) {
    let {id} = this.props;
    if (confirm("Delete the item?") == true) {
      axios.delete(`/v1/registration_courses/${cell}.json`, null,
        {
          headers: {'X-CSRF-Token': csrfToken},
          responseType: 'JSON'
        }
      )
      .then((response) => {
        const {status, message, content} = response.data;
        if(status === 200) {
          this.setState({
            registration_courses: this.state.registration_courses.filter(registration_course => {
              return registration_course.id !== content.id
            })
          });
          $.growl.notice({message: message});
        } else {
          $.growl.error({message: message});
        }
      });
    }
  }

  cellButton(cell, row, enumObject, rowIndex) {
      return (
         <button
            type="button"
            className="btn btn-danger"
            onClick={() =>
                this.onDeleteHandle(cell)} >
          <i className="fa fa-times" aria-hidden="true"></i>
         </button>
      )
   }

  handleInputChange(e) {
    this.setState({email_content: e.target.value});
  }

  componentDidMount() {
    this.getDataFromApi(this.state.page);
  }

  getDataFromApi(page) {
    axios.get('/v1/registration_courses.json', {
      params: {
        page: page,
        query: this.state.search_word,
        course_id: this.state.course_id,
        course_schedule_id: this.state.course_schedule_id
      }
    })
    .then(response => {
      const {registration_courses, page, pages, courses, course_schedules, created_at} = response.data.content;
      this.setState({registration_courses, page, pages, courses, course_schedules, created_at});
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleChangePage(page) {
    this.getDataFromApi(page);
  }

  handleSearch(event) {
    this.setState({search_word: event.target.value, page: 1}, () => this.getDataFromApi(1));
  }

  courseInputChange(newValue) {
    this.setState({course_id: newValue, page: 1, course_schedule_id: 0, search_word: ""},
      () => this.getDataFromApi(1));
  }

  scheduleInputChange(newValue) {
    this.setState({course_schedule_id: newValue, page: 1, search_word: ""},
      () => this.getDataFromApi(1));
  }

// It's a data format example.
  timeFormatter(cell, row){
    var localDate = new Date(cell);
    var localDateString = localDate.toLocaleString(undefined, {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
    return localDateString
  }


  render() {
    const {formatMessage} = this.props.intl;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="certifications-table-header">
            <h2>{formatMessage(defaultMessages.adminRegistrationCoursesRegistration)}</h2>
          </div>
          <div className="clearfix">
            <div className="col-md-4">
              <input onChange={this.handleSearch}
                type="text"
                value={this.state.search_word}
                className="form-control"
                placeholder={formatMessage(defaultMessages.adminSearchHolder)}
                ref="query" />
            </div>
            <div className="col-md-4">
              <SelectedCourse courses={this.state.courses}
                handleChange={this.courseInputChange} selected={this.state.course_id} />
            </div>
            <div className="col-md-4">
              <SelectedCourseSchedule course_schedules={this.state.course_schedules}
                handleChange={this.scheduleInputChange} selected={this.state.course_schedule_id} />
            </div>
          </div>
          <div className="empty-space marg-lg-b20"></div>
          <div className="table-responsive col-md-12">
            {/*<table className="table table-bordered table-hover table-striped">
              <thead>
                <tr>
                  <th>{formatMessage(defaultMessages.adminScheduleCode)}</th>
                  <th>{formatMessage(defaultMessages.adminRegistrationCoursesName)}</th>
                  <th>{formatMessage(defaultMessages.adminRegistrationCoursesEmail)}</th>
                  <th>{formatMessage(defaultMessages.adminRegistrationCoursesPhone)}</th>
                  <th>{formatMessage(defaultMessages.adminRegistrationCoursesAddress)}</th>
                  <th>{formatMessage(defaultMessages.adminRegistrationCoursesCourse)}</th>
                  <th>{formatMessage(defaultMessages.adminRegistrationCoursesCreated)}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.registration_courses.map(registration_course => (
                    <RegistrationCourse {...registration_course}
                      key={registration_course.id}
                      handleDeleted={this.handleDeleted}/>
                  ))
                }
              </tbody>
            </table>*/}
            <BootstrapTable data={this.state.registration_courses} striped hover condensed exportCSV>
              <TableHeaderColumn width='14%' dataField="name" isKey={true} dataSort={true} filter={ { type: 'TextFilter'} } >{formatMessage(defaultMessages.adminRegistrationCoursesName)}</TableHeaderColumn>
              <TableHeaderColumn width='14%' dataField="email" dataSort={true} filter={ { type: 'TextFilter'} }>{formatMessage(defaultMessages.adminRegistrationCoursesEmail)}</TableHeaderColumn>
              <TableHeaderColumn width='14%' dataField="phone" dataSort={true} filter={ { type: 'TextFilter'} }>{formatMessage(defaultMessages.adminRegistrationCoursesPhone)}</TableHeaderColumn>
              <TableHeaderColumn width='14%' dataField="address" dataSort={true} filter={ { type: 'TextFilter'} }>{formatMessage(defaultMessages.adminRegistrationCoursesAddress)}</TableHeaderColumn>
              <TableHeaderColumn width='14%' dataField="course_name" dataSort={true} filter={ { type: 'TextFilter'} }>{formatMessage(defaultMessages.adminRegistrationCoursesCourse)}</TableHeaderColumn>
              <TableHeaderColumn width='10%' dataField="course_schedule_code" dataSort={true} filter={ { type: 'TextFilter'} }>Mã lớp</TableHeaderColumn>
              <TableHeaderColumn width='15%' dataField="created_at" dataFormat={this.timeFormatter.bind(this)} dataSort={true} filter={ { type: 'DateFilter' } }>{formatMessage(defaultMessages.adminRegistrationCoursesCreated)}</TableHeaderColumn>
              <TableHeaderColumn width='7%' dataField='id' dataFormat={this.cellButton.bind(this)}></TableHeaderColumn>
            </BootstrapTable>
          </div>
          <Pagination page={this.state.page}
            pages={this.state.pages}
            handleChangePage={this.handleChangePage} />
        </div>
      </div>
    );
  }
}

export default injectIntl(RegistrationCourseIndex);
