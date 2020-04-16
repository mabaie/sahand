import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {
  Typography
} from "@material-ui/core";

function AdminTitleRouter(props)
{
  return (
    <Typography variant="title" color="inherit" noWrap>  
    <Switch>
      <Route path='/sahand/admin/dashboard' component={()=>'لیست مدیران'} />
    </Switch>
    </Typography>
  );
}
export default AdminTitleRouter;
