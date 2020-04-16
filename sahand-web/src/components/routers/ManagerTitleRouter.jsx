import {Switch, Route} from 'react-router-dom';
import React from 'react';
import {Typography}from '@material-ui/core';
function ManagerTitleRouter(props)
{
  return (
    <Typography variant="title" color="inherit" noWrap>
    <Switch>
      <Route path='/sahand/manager/dashboard/report/school' component={()=>'گزارش عملکرد مدرسه'} />
      <Route path='/sahand/manager/dashboard/report/students' component={()=>'گزارش دانش‌آموزان مدرسه'} />
      <Route path='/sahand/manager/dashboard/appointment' component={()=>'قرار ملاقات'} />
      <Route path='/sahand/manager/dashboard/home-activity' component={()=>'فعالیت در خانه'} />
      <Route path='/sahand/manager/dashboard/student-register' component={()=>'ثبت نام دانش آموز'} />
      <Route path='/sahand/manager/dashboard/teacher-register' component={()=>'لیست معلمان'} />
      <Route path='/sahand/manager/dashboard/class-register' component={()=>'لیست کلاس ها'} />
      <Route path='/sahand/manager/dashboard/course-register' component={()=>'لیست دروس'} />
      <Route path='/sahand/manager/dashboard/settings' component={()=>'تنظیمات'} />
      <Route path='/sahand/manager/dashboard/class-work' component={()=>'فعالیت‌های کلاسی'} />
      <Route path='/sahand/manager/dashboard/news' component={()=>'اخبار مدرسه'} />
      <Route path='/sahand/manager/dashboard/magazine' component={()=>'انتشارات'} />
      <Route path='/sahand/manager/dashboard/report' component={()=>'گزارش‌ها'} />
      <Route path='/sahand/manager/dashboard/calendar' component={()=>'تقویم اجرایی'} />
      <Route path='/sahand/manager/dashboard/gallery' component={()=>'گالری'} />
      <Route path='/sahand/manager/dashboard/encourage' component={()=>'‌تشویق‌ها'} />
      <Route path='/sahand/manager/dashboard/messages' component={()=>'پیام‌ها'} />
      <Route path='/sahand/manager/dashboard/' component={()=>'خانه'} />
    </Switch>
    </Typography>
  );
}
export default ManagerTitleRouter;
