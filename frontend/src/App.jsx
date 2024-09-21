import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import SubmitRepair from './components/SubmitRepair';
import RepairStatus from './components/RepairStatus';
import RepairList from './components/RepairList';
import AdminRepairList from './components/AdminRepairList';
import UpdateRepairStatus from './components/UpdateRepairStatus';
import UpdateRepairCost from './components/UpdateRepairCost';


const App = () => {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/admin/updaterepaircost" element={<UpdateRepairCost/>}/>
        <Route path="/admin/updaterepairstatus/:repairId" element={<UpdateRepairStatusWrapper/>} />
        <Route path="/admin/adminrepairlist" element={<AdminRepairList />} />
        <Route path="/repairstatus/:repairId" element={<RepairStatus />} />
        <Route path="/repairlist" element={<RepairList />} />
        <Route path="/submitrepair" element={<SubmitRepair />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router></div>
  );
};

const UpdateRepairStatusWrapper =()=>{
  const {repairId} = useParams();
  return <UpdateRepairStatus repairId={repairId}/>;
};

export default App;
