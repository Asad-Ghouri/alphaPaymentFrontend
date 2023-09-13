import "../CSS/Sidebar.css";
import { AccountCircleRounded, AttachMoneyRounded, BarChartRounded, DashboardRounded } from '@mui/icons-material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import CategoryIcon from '@mui/icons-material/Category';

import Logout from '@mui/icons-material/Logout';

import logo from '../Images/IMG_3028.JPG'
import { NavLink , useNavigate} from "react-router-dom";


function MerchatSidebar() {

  const navigate= useNavigate();

  function LogOut(){
    localStorage.setItem('token', "");
    navigate("/");
  }
  return (
    <div className="App">
      <div className="sidebar_container">
        {/* sidebar div */}
        <div className="sidebar">
          {/* profile */}
          <div className="profile">
          <NavLink to='/'>
            <img className="Logo"
              src="https://alphapay.solutions/wp-content/uploads/2023/09/WhatsApp_Image_2023-09-12_at_11.49.52_AM-removebg-preview.png"
              alt="profile_img"
            />
            </NavLink>
          </div>
          {/* groups */}
          <div className="groups">
            {/* group 1 */}
            <div className="group">
              <NavLink to='/MerchatDashboard' className='nav-links'>
                <DashboardRounded className="icon" style={{ color: 'white' }} /> <span>Dashboard
                </span>            </NavLink>
              <NavLink to='/GetApikey' className='nav-links'>
                <BarChartRounded className="icon" style={{ color: 'white' }} /> <span>Api Key</span>
              </NavLink>
              <NavLink to='/PaymentLinkGenerator' className='nav-links'>
                <InventoryIcon className="icon" style={{ color: 'white' }} /> <span> Payment Link </span>
              </NavLink>
              
              <button onClick={LogOut} className='nav-links nav-linkbtn'>
                <Logout className="icon" style={{ color: 'white' }} /> <span> Log Out </span>
              </button>

              <NavLink to='/DonationLink' className='nav-links'>
                <HistoryIcon className="icon" style={{ color: 'white' }} /> <span>Donation Link</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default MerchatSidebar;