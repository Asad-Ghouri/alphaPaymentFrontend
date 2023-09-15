import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import QRCode from "qrcode.react";
import { NavLink , useNavigate,useParams } from "react-router-dom";
import done from "../../asserts/done.png"
import axios from "axios"
const Linkshow = () => {
  const navigate= useNavigate();
  const userId = useSelector((state) => state.UserId);
  const [data, setdata] = useState([]);

  const [amount, setamount] = useState([]);
  const [address, setaddress] = useState([]);
  const [privateKey, setprivateKey] = useState([]);
  console.log("send data ",address,amount,privateKey)
  const authToken = localStorage.getItem('token');
  console.log(authToken)
  // State to store QR code data for each payment
  const [qrCodes, setQrCodes] = useState([]);

  const {id,amd}=useParams();
  console.log("id==="+id)
  const [responseData, setResponseData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://alpha-payment-backend.vercel.app/api/PaymentLinkGenerator/gett/${id}/${amd}`);
        if (!response.ok) {
          throw new Error("Request failed");
        }
         console.log("use effect 1")
        const data = await response.json();
        console.log(data);
        setdata(data.paymentLinks);
        setaddress(data.paymentLinks[0].address)
        setamount(data.paymentLinks[0].amount)
        setprivateKey(data.paymentLinks[0].privateKey)
        // Generate QR codes for each payment
        const qrCodeData = data.paymentLinks.map((payment) => payment.qrCode);
        setQrCodes(qrCodeData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, [userId]);

  // console.log("data address is",data[0].address)

  

  useEffect(() => {

    const handleButtonClick = async () => {
      try {
        const response = await axios.get(`https://alpha-payment-backend.vercel.app/api/changedetails/gett/${id}/${amd}/${address}/${amount}/${privateKey}`); // Replace with your API endpoint
        if(response.data){
          // navigate("/PaymentLinkGenerator")
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // Call handleButtonClick initially
    handleButtonClick();

    // Set up an interval to call handleButtonClick every 10 seconds
    // const interval = setInterval(() => {
    //   handleButtonClick();
    // }, 10000); // 10,000 milliseconds = 10 seconds

    // // Clean up the interval when the component unmounts
    // return () => {
    //   clearInterval(interval);
    // };
    console.log("use effect 2")
  }, [address, amd, amount, id, navigate, privateKey]);

  return (
  
    <>
    {data.map((payment, index) => (
      
     <div className="payment-page">
      <div className="payment-details">
        <h1 className="payment-title">Payment Details</h1>
        <div className="payment-amount">
          <span className="payment-amount-value">{payment.amount}</span>
          <span className="payment-currency">${payment.amount}</span>
        </div>
        <p className="payment-address">Send the funds to this address</p>
        <p className="payment-address-value">{payment.address}</p>
        <div>
        {payment.status === "Pending" ? (
  <div>
    <h1>Axios GET Request</h1>
    {/* <button onClick={handleButtonClick}>Approve Transaction</button> */}
    <div>
               <QRCode value={payment.address} />
            </div>
  </div>
) : (
  <div>
    <p>Already Approved</p>
    <img src={done} alt="" />
  </div>
)}

    </div>
       
        
      </div>

      {/* <div className="payment-status">
        <h2 className="status-title">Payment Status</h2>
        <div className="status-list">
          <div className="status-item">
            <div className="status-icon waiting"></div>
            <p className="status-text">Waiting for payment</p>
          </div>
          <div className="status-item">
            <div className="status-icon expired"></div>
            <p className="status-text">Expired</p>
          </div>
          <div className="status-item">
            <div className="status-icon confirmed"></div>
            <p className="status-text">Confirmed on blockchain</p>
          </div>
          <div className="status-item">
            <div className="status-icon sending"></div>
            <p className="status-text">Sending to seller</p>
          </div>
          <div className="status-item">
            <div className="status-icon sent"></div>
            <p className="status-text">Sent to seller 🎉</p>
          </div>
        </div>
      </div> */}
    </div>
   ))}
   </>
  );
};

export default Linkshow;
