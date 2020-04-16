import React from 'react';
import {Switch, Route} from 'react-router-dom';
import DTable from '../DTable/Dtable';
import header from '../AdminDashboard/ManagerHeader';

function AdminMainRouter(props)
{
  const url = {
    managers: '/managers',
  }

  return (
    <Switch>
      <Route path='/sahand/admin/dashboard' component={()=>{
        return <DTable prefetchLimit={2} header={header} url={url.managers}/>}} />
    </Switch>
  );
}
export default AdminMainRouter;
