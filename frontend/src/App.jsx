import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import SubmitRepair from './components/user/SubmitRepair';
import RepairStatus from './components/user/RepairStatus';
import RepairList from './components/user/RepairList';
import AdminRepairList from './components/admin/AdminRepairList';
import UpdateRepairStatus from './components/admin/UpdateRepairStatus';
import UpdateRepairCost from './components/admin/UpdateRepairCost';
import AdminRoute from './components/protectedroute/AdminRoute';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import UserProfile from './components/user/UserProfile';
import ResubmitRepairRequest from './components/user/ResubmitRepairRequest';
import RepairHistory from './components/user/RepairHistory';


const App = () => {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/admin/admindashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
        <Route path="/admin/updaterepaircost" element={<UpdateRepairCost/>}/>
        <Route path="/admin/updaterepairstatus/:repairId" element={<UpdateRepairStatusWrapper/>} />
        <Route path="/admin/adminrepairlist" element={<AdminRoute><AdminRepairList /></AdminRoute>} />
        <Route path="/repairstatus/:repairId" element={<RepairStatus />} />
        <Route path="/repairlist" element={<RepairList />} />
        <Route path="/submitrepair" element={<SubmitRepair />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
        <Route path="/resubmitrepair/:repairId" element={<ProtectedRoute><ResubmitRepairRequest/></ProtectedRoute>} />
        <Route path="/repairhistory" element={<ProtectedRoute><RepairHistory/></ProtectedRoute>} />
      </Routes>
    </Router></div>
  );
};

const UpdateRepairStatusWrapper =()=>{
  const {repairId} = useParams();
  return <UpdateRepairStatus repairId={repairId}/>;
};

export default App;
