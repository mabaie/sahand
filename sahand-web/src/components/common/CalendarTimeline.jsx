import React, { Component } from "react";
import $ from "jquery";
import "../../assets/css/schedule.css";
import "../../assets/js/schedule";
import persian from "persian";
import PropTypes from "prop-types";

class CalendarTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastTitle: "",
      createdPeriods: [],
      loading: false,
      reset: false,
      empty: true,
    };
    this.handleAddPeriod = this.handleAddPeriod.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.handleRemovePeriod = this.handleRemovePeriod.bind(this);
  }
  handleAddPeriod(period) {
    const time = $(period)
      .children(".jqs-period-container")
      .children(".jqs-period-time")
      .text();
    const parsed = time.split("-");
    $(period)
      .children(".jqs-period-container")
      .children(".jqs-period-time")
      .text(persian.toPersian(parsed[1] + "-" + parsed[0]));
    $(period)
      .children(".jqs-period-container")
      .children(".jqs-period-title")
      .text(this.state.lastTitle);
    this.setState(prevState => {
      const nextState = prevState.createdPeriods.concat([
        $(period).children(".jqs-period-container")
      ]);
      return { createdPeriods: nextState , empty: false};
    });
  }
  handleRemovePeriod(deletedPeriod) {
    if (this.state.reset) {
      this.setState({ reset: false, empty: false });
    } else {
      this.setState(prevState => {
        let nextState = prevState.createdPeriods;
        let deletedIndex = -1;
        nextState.map((period, index) => {
          if (deletedPeriod.children(".jqs-period-container").is(period)) {
            deletedIndex = index;
          }
        });
        nextState.splice(deletedIndex, 1);
        return { createdPeriods: nextState, empty: nextState.length === 0};
      });
    }
  }
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.jqs({
      mode: "edit",
      hour: 24,
      days: 7,
      periodDuration: 30,
      data: [],
      periodOptions: true,
      periodColors: [],
      periodTitle: this.props.periodTitle,
      periodBackgroundColor: "rgba(82,155,255,0.5)",
      periodBorderColor: "#2a3cff",
      periodTextColor: "#000",
      periodRemoveButton: "حذف",
      periodDuplicateButton: "تکرار",
      periodTitlePlaceholder: "نام درس",
      daysList: [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه"
      ],
      onInit: function() {},
      onAddPeriod: this.handleAddPeriod,
      onRemovePeriod: this.handleRemovePeriod,
      onDuplicatePeriod: function() {},
      onClickPeriod: function(e) {}
    });
    
    $(".jqs-grid-hour").each(function(e) {
      $(this).text(persian.toPersian($(this).text()));
    });
  }
  componentWillUnmount() {
    this.$el.jqs("destroy");
  }
  loadNewData(data){
    
  }
  componentDidUpdate() {
    if(this.props.exportData){
      
      this.props.onExportData(this.state.empty ? false: this.$el.jqs('export'))
    } else
    if (this.props.reload) {
      this.setState({ reset: true }, () => {
        this.$el.jqs("reset");
        this.loadNewData(this.props.data);
        this.props.onReload();
      });
    } else if (this.props.periodTitle !== this.state.lastTitle) {
      this.setState({ lastTitle: this.props.periodTitle }, this.updateTitle);
    }
  }
  updateTitle() {
    const { createdPeriods, lastTitle } = this.state;
    createdPeriods.map(period => {
      period.children(".jqs-period-title").text(lastTitle);
    });
  }
  render() {
    return <div ref={el => (this.el = el)} />;
  }
}
CalendarTimeline.propTypes = {
  periodTitle: PropTypes.string.required,
  reload: PropTypes.bool.required,
  data: PropTypes.array,
  onReload: PropTypes.func.isRequired,
  exportData: PropTypes.bool.isRequired,
  onExportData: PropTypes.func.isRequired
};
export default CalendarTimeline;
