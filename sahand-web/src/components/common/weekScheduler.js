/*
props list:
   submit:(schoolObject)=>{},
    DefaultColor:'#9357DF',
    submitTextColor:'#ffffff',
    fontFamily:'tahoma'
*/
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

import { transform, isEqual, isObject } from "lodash/fp";
import _ from "lodash";

import TimeModule from './timeModule'
import TimeScheduleList from './timeScheduleList'

const _transform = transform.convert({
  cap: false
});


var styles = theme => ({
  rowStyle: {
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'#f3f3f3',
    width:"100%",
    minWidth:700,
  },
  columnStyle: {
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center',
  },
  cellStyle:{
    backgroundColor:'white',
    width:"12.4%",
    margin:"0.1%",

  },
  textStyle:{
    display: "flex",
    alignItems: 'center',
    justifyContent:'center',
    height:"100%"
  },
  button: {
    margin: theme.spacing.unit,
    color:'orange',
    borderColor:'orange'
  },
});

class WeekScheduler extends React.Component {

  constructor(props) {
    super(props);
    this.schedule={};
    this.state={
      scheduleList:{
        day0:[],
        day1:[],
        day2:[],
        day3:[],
        day4:[],
        day5:[],
        day6:[]
      },
      addTitle:this.props.title,
      addBackgroundColor:this.props.backgroundColor,
      start:this.props.start,
      end:this.props.end,
      height:this.props.height,
      change:false
    }
    this.changeSchedule=false;
    this.element={offsetWidth:130}

    this.onChangeSchedule = this.onChangeSchedule.bind(this)
  }
  convertToPersianNumber(input){
    var persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    var persianMap = persianDigits.split("");
      return input.replace(/\d/g,function(m){
          return persianMap[parseInt(m)];
      });
  }

  merge(){
    for(var i=0;i<=6;i++){
      //
      for(var j=0;j<this.state.scheduleList['day'+i].length;j++){
        if(this.state.scheduleList['day'+i][j].backgroundColor==this.state.addBackgroundColor){
          const {scheduleList}=this.state;
          scheduleList['day'+i][j].title=this.state.addTitle
        }
        for(var k=0;k<this.state.scheduleList['day'+i][j].periods.length;k++){
          for(var l=k+1;l<this.state.scheduleList['day'+i][j].periods.length;l++){
            if(this.state.scheduleList['day'+i][j].periods[k].end==this.state.scheduleList['day'+i][j].periods[l].start){
              const {scheduleList}=this.state;
              scheduleList['day'+i][j].periods[k].end=this.state.scheduleList['day'+i][j].periods[l].end
              scheduleList['day'+i][j].periods.splice(l, 1);
              this.change=true
              break;
            }else if(this.state.scheduleList['day'+i][j].periods[k].start==this.state.scheduleList['day'+i][j].periods[l].end){
              const {scheduleList}=this.state;
              scheduleList['day'+i][j].periods[k].start=this.state.scheduleList['day'+i][j].periods[l].start
              scheduleList['day'+i][j].periods.splice(l, 1);
              this.change=true
              break;
            }
          }
        }
      }
    }
  }

  AddNewFromObject(object,day1){
    var day='day'+day1

    var find=false
    for(var i=0;i<this.state.scheduleList[day].length;i++){
      if(this.state.scheduleList[day][i].backgroundColor==object.backgroundColor){
        this.state.scheduleList[day][i].periods.push.apply(this.state.scheduleList[day][i].periods, object.periods)//arr.push.apply(arr, ['c', 'd']);
        find=true
      }
    }
    if(!find){
      this.state.scheduleList[day].push(object)
    }
  }

  checkOverlap(period,localday,prevPriod){
    for(var i=0;i<this.state.scheduleList['day'+localday].length;i++){
      for(var j=0;j<this.state.scheduleList['day'+localday][i].periods.length;j++){
        var time=this.state.scheduleList['day'+localday][i].periods[j];
        if((prevPriod) && prevPriod.start===time.start && prevPriod.end===time.end)
          continue;
        if((time.start<=period.start&&time.end>period.start)||(time.start>=period.start&&time.end<=period.end)
          ||(time.start<period.end&&time.end>=period.end))
          return true
      }
    }
    return false
  }

  showTime(row,day){
    const time = row.map(list =>(
      <div key={list.title+day+list.period.start+list.period.end} style={{height:0}}>
        <TimeModule
          disabled={list.disabled}
          backgroundColor={list.backgroundColor}
          height={this.state.height}
          period={list.period}
          title={list.title}
          day={day}
          fixWidth={this.element.offsetWidth}
          delete={()=>{
            for(var i=0;i<this.state.scheduleList['day'+day].length;i++){
              if(this.state.scheduleList['day'+day][i].backgroundColor==list.backgroundColor&&this.state.scheduleList['day'+day][i].periods.length==1){
                this.state.scheduleList['day'+day].splice(i, 1);
                this.change=true
                this.forceUpdate()
                return 0;
              }else if(this.state.scheduleList['day'+day][i].backgroundColor==list.backgroundColor&&this.state.scheduleList['day'+day][i].periods.length>1){
                for(var j=0;j<this.state.scheduleList['day'+day][i].periods.length;j++){
                  if(this.state.scheduleList['day'+day][i].periods[j]==list.period){
                    this.state.scheduleList['day'+day][i].periods.splice(j, 1);
                    this.change=true
                    this.forceUpdate()
                    return 0;
                  }
                }
              }
            }
          }
        }
          onChange={(period,localday)=>{
            
            if(parseInt(period.start.substr(0,2))<this.state.start || parseInt(period.end.substr(0,2))>=this.state.end
              || localday>6 || localday<0 ){
                //
                var t1=list.period.start;
                list.period.start="00:00";
                this.forceUpdate()

                list.period.start=t1;
                this.forceUpdate()
                return
            }
            if(this.checkOverlap(period,localday,list.period)){
                //
                t1=list.period.start;
                list.period.start="00:00";
                this.forceUpdate()

                list.period.start=t1;
                this.forceUpdate()
                return
            }
            list.period.start=period.start;
            list.period.end=period.end;
            //if(day!==localday){
              for(var i=0;i<this.state.scheduleList['day'+day].length;i++){
                if(this.state.scheduleList['day'+day][i].backgroundColor==list.backgroundColor&&this.state.scheduleList['day'+day][i].periods.length==1){
                  var temp = this.state.scheduleList['day'+day][i]                  
                  this.state.scheduleList['day'+day].splice(i, 1);
                  this.AddNewFromObject(temp,localday)
                  break;
                }else if(this.state.scheduleList['day'+day][i].backgroundColor==list.backgroundColor&&this.state.scheduleList['day'+day][i].periods.length>1){
                  for(var j=0;j<this.state.scheduleList['day'+day][i].periods.length;j++){
                    if(this.state.scheduleList['day'+day][i].periods[j]==list.period){
                      temp = this.state.scheduleList['day'+day][i].periods[j]
                      this.state.scheduleList['day'+day][i].periods.splice(j, 1);
                      this.AddNewFromObject(
                        {
                          backgroundColor:this.state.scheduleList['day'+day][i].backgroundColor,
                          disabled:this.state.scheduleList['day'+day][i].disabled,
                          id:this.state.scheduleList['day'+day][i].id,
                          periods:[temp],
                          title:this.state.scheduleList['day'+day][i].title
                        }
                        ,localday)
                      break;
                    }
                  }
                }
              }
            //}
            //
            this.change=true

            this.forceUpdate();
          }
        }
        />
      </div>
  ));
    return(
      time
    )
  }

    renderTime(){
      const { classes } = this.props;
      //
      this.merge()
      if(this.change)
        this.onChangeSchedule()
      this.change=false
      var temp=[]
      var i=0
      for(i=this.state.start;i<this.state.end;i++){
        var t1={}
        t1['key']=i
        var j=0
        var k=0
        var day0=[]
        var day1=[]
        var day2=[]
        var day3=[]
        var day4=[]
        var day5=[]
        var day6=[]
        for(j=0;j<this.state.scheduleList.day0.length;j++){
          for(k=0;k<this.state.scheduleList.day0[j].periods.length;k++){
            if(parseInt(this.state.scheduleList.day0[j].periods[k].start.substr(0,2))===i){
              day0.push({
                title:this.state.scheduleList.day0[j].title,
                period:this.state.scheduleList.day0[j].periods[k],
                backgroundColor:this.state.scheduleList.day0[j].backgroundColor,
                disabled:this.state.scheduleList.day0[j].disabled
              })
            }
          }
        }
        t1['day0']=day0
        for(j=0;j<this.state.scheduleList.day1.length;j++){
          for(k=0;k<this.state.scheduleList.day1[j].periods.length;k++){
            if(parseInt(this.state.scheduleList.day1[j].periods[k].start.substr(0,2))===i){
              day1.push({
                title:this.state.scheduleList.day1[j].title,
                period:this.state.scheduleList.day1[j].periods[k],
                backgroundColor:this.state.scheduleList.day1[j].backgroundColor,
                disabled:this.state.scheduleList.day1[j].disabled
              })
            }
          }
        }
        t1['day1']=day1
        for(j=0;j<this.state.scheduleList.day2.length;j++){
          for(k=0;k<this.state.scheduleList.day2[j].periods.length;k++){
            if(parseInt(this.state.scheduleList.day2[j].periods[k].start.substr(0,2))===i){
              day2.push({
                title:this.state.scheduleList.day2[j].title,
                period:this.state.scheduleList.day2[j].periods[k],
                backgroundColor:this.state.scheduleList.day2[j].backgroundColor,
                disabled:this.state.scheduleList.day2[j].disabled
              })
            }
          }
        }
        t1['day2']=day2
        for(j=0;j<this.state.scheduleList.day3.length;j++){
          for(k=0;k<this.state.scheduleList.day3[j].periods.length;k++){
            if(parseInt(this.state.scheduleList.day3[j].periods[k].start.substr(0,2))===i){
              day3.push({
                title:this.state.scheduleList.day3[j].title,
                period:this.state.scheduleList.day3[j].periods[k],
                backgroundColor:this.state.scheduleList.day3[j].backgroundColor,
                disabled:this.state.scheduleList.day3[j].disabled
              })
            }
          }
        }
        t1['day3']=day3
        for(j=0;j<this.state.scheduleList.day4.length;j++){
          for(k=0;k<this.state.scheduleList.day4[j].periods.length;k++){
            if(parseInt(this.state.scheduleList.day4[j].periods[k].start.substr(0,2))===i){
              day4.push({
                title:this.state.scheduleList.day4[j].title,
                period:this.state.scheduleList.day4[j].periods[k],
                backgroundColor:this.state.scheduleList.day4[j].backgroundColor,
                disabled:this.state.scheduleList.day4[j].disabled
              })
            }
          }
        }
        t1['day4']=day4
        for(j=0;j<this.state.scheduleList.day5.length;j++){
          for(k=0;k<this.state.scheduleList.day5[j].periods.length;k++){
            if(parseInt(this.state.scheduleList.day5[j].periods[k].start.substr(0,2))===i){
              day5.push({
                title:this.state.scheduleList.day5[j].title,
                period:this.state.scheduleList.day5[j].periods[k],
                backgroundColor:this.state.scheduleList.day5[j].backgroundColor,
                disabled:this.state.scheduleList.day5[j].disabled
              })
            }
          }
        }
        t1['day5']=day5
        for(j=0;j<this.state.scheduleList.day6.length;j++){
          for(k=0;k<this.state.scheduleList.day6[j].periods.length;k++){
            if(parseInt(this.state.scheduleList.day6[j].periods[k].start.substr(0,2))===i){
              day6.push({
                title:this.state.scheduleList.day6[j].title,
                period:this.state.scheduleList.day6[j].periods[k],
                backgroundColor:this.state.scheduleList.day6[j].backgroundColor,
                disabled:this.state.scheduleList.day6[j].disabled
              })
            }
          }
        }
        t1['day6']=day6
        temp.push(t1)
      }

      const rows= temp.map(row=> (
        <div key={row.key} className={classes.rowStyle}>
          <div className={classes.cellStyle} style={{height:this.state.height}}><Typography className={classes.textStyle} align='center'>{'ساعت '+this.convertToPersianNumber(row.key+"")}</Typography></div>
          <div className={classes.cellStyle} style={{height:this.state.height}}>
            {this.showTime(row.day0,0)}
          </div>
          <div className={classes.cellStyle} style={{height:this.state.height}}>
              {this.showTime(row.day1,1)}
          </div>
          <div className={classes.cellStyle} style={{height:this.state.height}}>
              {this.showTime(row.day2,2)}
            </div>
          <div className={classes.cellStyle} style={{height:this.state.height}}>
            {this.showTime(row.day3,3)}
          </div>
          <div className={classes.cellStyle} style={{height:this.state.height}}>
                {this.showTime(row.day4,4)}
          </div>
          <div className={classes.cellStyle} style={{height:this.state.height}}>
              {this.showTime(row.day5,5)}
            </div>
          <div className={classes.cellStyle} style={{height:this.state.height}}>
              {this.showTime(row.day6,6)}
            </div>
        </div>
      ));
      return(
        rows
      )
    }
    
    iteratee(baseObj){
      return (result, value, key) => {
        if (!isEqual(value, baseObj[key])) {
          const valIsObj = isObject(value) && isObject(baseObj[key]);
          result[key] = valIsObj === true ? this.differenceObject(value, baseObj[key]) : value;
        }
      }
    }
    
    differenceObject(targetObj, baseObj) {
      return _transform(this.iteratee(baseObj), null, targetObj);
    }

    onChangeSchedule(){
      this.changeSchedule=true;
      var courseColor=[]
      for(var i=0;i<=6;i++){
        for(var k=0;k<this.schedule['day'+i].length;k++){
          var find=false
          for(var j=0;j<this.state.scheduleList['day'+i].length;j++){
            if(this.state.scheduleList['day'+i][j].backgroundColor === this.schedule['day'+i][k].backgroundColor){
              find=true
            }
          }
          if(!find && !this.schedule['day'+i][k].disabled && courseColor.indexOf(this.schedule['day'+i][k].backgroundColor)<0){
            courseColor.push(this.schedule['day'+i][k].backgroundColor)
          }
        }
      }
      for(i=0;i<=6;i++){
        for(j=0;j<this.state.scheduleList['day'+i].length;j++){
          find=false
          for(k=0;k<this.schedule['day'+i].length;k++){
            if(this.state.scheduleList['day'+i][j].backgroundColor === this.schedule['day'+i][k].backgroundColor &&
               courseColor.indexOf(this.schedule['day'+i][k].backgroundColor)<0 && !this.schedule['day'+i][k].disabled){
                var different=false
                for(var p=0;p<this.state.scheduleList['day'+i][j].periods.length;p++){
                  var findEq=false
                  for(var q=0;q<this.schedule['day'+i][k].periods.length;q++){
                    if(
                      this.state.scheduleList['day'+i][j].periods[p].start==this.schedule['day'+i][k].periods[q].start &&
                      this.state.scheduleList['day'+i][j].periods[p].end  ==this.schedule['day'+i][k].periods[q].end
                    ){
                      findEq=true;
                      break;
                    }
                  }
                  if(!findEq){
                    different=true
                    break;
                  }
                }
                if(different){
                  courseColor.push(this.schedule['day'+i][j].backgroundColor)
                }
                find=true
            }else if(this.state.scheduleList['day'+i][j].backgroundColor === this.schedule['day'+i][k].backgroundColor){
              find=true
            }
          }
          if(!find && courseColor.indexOf(this.state.scheduleList['day'+i][j].backgroundColor)<0 
		&& !this.state.scheduleList['day'+i][j].disabled){
            courseColor.push(this.state.scheduleList['day'+i][j].backgroundColor)
          }  
        }
      }
      var courseList=[]
      for(k=0;k<courseColor.length;k++){
        for(i=0;i<=6;i++){
          for(j=0;j<this.state.scheduleList['day'+i].length;j++){
            if(courseColor[k]===this.state.scheduleList['day'+i][j].backgroundColor){
              var t1={}
              t1['day'+i]=this.state.scheduleList['day'+i][j].periods
              var find1=false
              for(var m=0;m<courseList.length;m++){
                if(courseList[m].backgroundColor===this.state.scheduleList['day'+i][j].backgroundColor){
                  courseList[m].periods['day'+i]=this.state.scheduleList['day'+i][j].periods
                  find1=true
                }
              }
              if(!find1){
                courseList.push({
                  id:this.state.scheduleList['day'+i][j].id,
                  title:this.state.scheduleList['day'+i][j].title,
                  backgroundColor:this.state.scheduleList['day'+i][j].backgroundColor,
                  periods:t1,
                  disabled:this.state.scheduleList['day'+i][j].disabled ,
                })
                break;
              }
            }
          }
        }
      }
      //
      this.props.onChangeSchedule(courseList)
    }

    initSchedule(){
      this.schedule={}
      for(var i=0;i<=6;i++){
        this.schedule['day'+i]=[]
        for(var j=0;j<this.state.scheduleList['day'+i].length;j++){
          var periods=[];
          for(var k=0;k<this.state.scheduleList['day'+i][j].periods.length;k++){
            periods.push({
              start:this.state.scheduleList['day'+i][j].periods[k].start,
              end:this.state.scheduleList['day'+i][j].periods[k].end
            })
          }
          this.schedule['day'+i].push({
            id:this.state.scheduleList['day'+i][j].id,
            title:this.state.scheduleList['day'+i][j].title,
            backgroundColor:this.state.scheduleList['day'+i][j].backgroundColor,
            periods:periods,
            disabled:this.state.scheduleList['day'+i][j].disabled ,
          })
        }
      }
    }

  componentDidMount(){
    this.initSchedule()
  }

  componentDidUpdate(){
    if(!this.changeSchedule){
      this.initSchedule();
    }
    console.log('schedule update')
   }

    render() {
      const { classes } = this.props;
      var localState = this.state;
      if(!_.isEqual(this.props.scheduleList,{})){
        localState.scheduleList=this.props.scheduleList
        localState.addTitle=this.props.title;
        localState.addBackgroundColor=this.props.backgroundColor;
        if(_.isEqual(this.schedule.day0,[]) &&_.isEqual(this.schedule.day1,[]) &&_.isEqual(this.schedule.day2,[]) &&_.isEqual(this.schedule.day3,[]) &&_.isEqual(this.schedule.day4,[]) &&_.isEqual(this.schedule.day5,[]) && _.isEqual(this.schedule.day6,[])){
          this.initSchedule()
        }
      }
      this.changeSchedule=false;
        return (
          <div className={classes.columnStyle}>
            {(this.state.addTitle)?
              <TimeScheduleList key={this.state.addTitle} title={this.state.addTitle} height={this.state.height/2} 
              onChenge={(left,top)=>{
                left=left+4*this.element.offsetWidth
                var day='day'+(6-(Math.floor(left/this.element.offsetWidth)<0? 0 : (Math.floor(left/this.element.offsetWidth)>6?6:Math.floor(left/this.element.offsetWidth))))
                var min=15*(Math.floor(4*top/this.state.height)-6);
                //
                if(min<0){
                  min=0;
                }else if(min>(this.state.end-this.state.start)*60){
                  min=(this.state.end-this.state.start)*60-15
                }
                const period={
                  start:String("00" + (Math.floor(min/60)+this.state.start)).slice(-2)+':'+String("00" + (min%60)).slice(-2),
                  end:String("00" + (Math.floor((min+15)/60)+this.state.start)).slice(-2)+':'+String("00" + ((min+15)%60)).slice(-2)
                }
                //
                if(this.checkOverlap(period,day.substr(3,1),null))
                  return
                var find=false
                for(var i=0;i<this.state.scheduleList[day].length;i++){
                  if(this.state.scheduleList[day][i].backgroundColor==this.state.addBackgroundColor){
                    this.state.scheduleList[day][i].periods.push(period)
                    find=true
                  }
                }
                if(!find){
                  this.state.scheduleList[day].push(
                    {
                      title: this.state.addTitle,
                      periods: [period],
                      backgroundColor:this.state.addBackgroundColor,
                      disabled:false ,
                    }
                  )
                }
                this.change=true
                this.forceUpdate()
              }
                
              } backgroundColor={this.state.addBackgroundColor}/>
              :<div/>
            }
          <div className={classes.rowStyle}>
            <div className={classes.cellStyle} style={{height:this.state.height}}></div>
            <div className={classes.cellStyle} style={{height:this.state.height}} ref={(element) => {this.element = element }}><Typography className={classes.textStyle} align='center'>شنبه</Typography></div>
            <div className={classes.cellStyle} style={{height:this.state.height}}><Typography className={classes.textStyle} align='center'>یک‌شنبه</Typography></div>
            <div className={classes.cellStyle} style={{height:this.state.height}}><Typography className={classes.textStyle} align='center'>دوشنبه</Typography></div>
            <div className={classes.cellStyle} style={{height:this.state.height}}><Typography className={classes.textStyle} align='center'>سه‌شنبه</Typography></div>
            <div className={classes.cellStyle} style={{height:this.state.height}}><Typography className={classes.textStyle} align='center'>چهارشنبه</Typography></div>
            <div className={classes.cellStyle} style={{height:this.state.height}}><Typography className={classes.textStyle} align='center'>پنج‌شنبه</Typography></div>
            <div className={classes.cellStyle} style={{height:this.state.height}}><Typography className={classes.textStyle} align='center'>جمعه</Typography></div>
          </div>
          {this.renderTime()}
          </div>
        );
    }

}

WeekScheduler.propTypes = {
  scheduleList: PropTypes.object.isRequired,
  title:PropTypes.string.isRequired,
  backgroundColor:PropTypes.string.isRequired,
  start:PropTypes.number.isRequired,
  end:PropTypes.number.isRequired,
  height:PropTypes.number.isRequired,
  onChangeSchedule: PropTypes.func.isRequired,
  classes:PropTypes.object.isRequired
};

export default withStyles(styles)(WeekScheduler);
