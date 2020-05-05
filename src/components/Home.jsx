import React from "react";

import "./Common.css";
import "semantic-ui-css/semantic.min.css";

import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';

import axios from 'axios';

import Result from "./Result";
import Loading from "./Loading";

const Today = new Date();
registerLocale("ja", ja);

export default class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      date: addDays(new Date(), 14),
      budget: '12000',
      departure: '1',
      duration: '90',
      plans: [],
      planCount: 0,
      error: null,
      loading: false,
    }
  }

  handleDateChange = e => {
    this.setState({ date: e })
  }

  handleBudgetChange = e => {
    this.setState({ budget: e.target.value })
  }

  handleDepartureChange = e => {
    this.setState({ departure: e.target.value })
  }

  handleDurationChange = e => {
    this.setState({ duration: e.target.value })
  }

  handleSubmit = async (e) => {
    try {
      e.preventDefault();
      this.setState({ loading: true });

      let params = {
        date: format(this.state.date, "yyyymmdd"),
        budget: this.state.budget,
        departure: this.state.departure,
        duration: this.state.duration,
      };
  
      const response = await axios.get("https://l1kwik11ne.execute-api.ap-northeast-1.amazonaws.com/production/golf-courses", { params: params });
      this.setState({ planCount: response.data.count, plans: response.data.plans});
      console.log(response.data.count);
      console.log(response.data.plans);
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ error: error })
    }
  }

  render() {
    {console.log(this.state.date)}
    {console.log(this.state.budget)}
    {console.log(this.state.departure)}
    {console.log(this.state.duration)}

    return (
      <div className="ui container" id="container">
        <div className="Search__Form">
          <form
            className="ui form segment"
            onSubmit={this.handleSubmit}
          >
            <div className="field">
              <label><i className="calendar alternate outline icon"></i>プレー日</label>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={this.state.date}
                minDate={Today}
                locale='ja'
                onChange={this.handleDateChange}
              />
            </div>
            <div className="field">
              <label><i className="yen sign icon"></i>上限金額</label>
              <select
                className="ui dropdown"
                name="dropdown"
                value={this.state.budget}
                onChange={this.handleBudgetChange}
              >
                <option value="8000">8,000円</option>
                <option value="12000">12,000円</option>
                <option value="16000">16,000円</option>
              </select>
            </div>
            <div className="field">
              <label><i className="map pin icon"></i>移動時間計算の出発地点（自宅から近い地点をお選びください）</label>
              <select
                className="ui dropdown"
                name="dropdown"
                value={this.state.departure}
                onChange={this.handleDepartureChange}
              >
                <option value="1">東京駅</option>
                <option value="2">横浜駅</option>
              </select>
            </div>
            <div className="field">
              <label><i className="car icon"></i>車での移動時間の上限</label>
              <select
                className="ui dropdown"
                name="dropdown"
                value={this.state.duration}
                onChange={this.handleDurationChange}
              >
                <option value="60">60分</option>
                <option value="90">90分</option>
                <option value="120">120分</option>
              </select>
            </div>
            <div className="Search__Button">
              <button type="submit" className="Search__Button__Design">
                <i className="search icon"></i>ゴルフ場を検索する
              </button>
            </div>
          </form>

          <Loading
            loading={this.state.loading}
          />

          <Result
            plans={this.state.plans}
            planCount={this.state.planCount}
            error={this.setState.error}
          />
        </div>
      </div>
    );
  }
}