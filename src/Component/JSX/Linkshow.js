import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import QRCode from "qrcode.react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import done from "../../asserts/done.png";
import axios from "axios";
import copy from "clipboard-copy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
// import { ConnectWallet, useAddress, useSDK } from "@thirdweb-dev/react";
const Linkshow = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.UserId);
  const [data, setdata] = useState([]);

  // const addresss = useAddress();

  const [btcPrice, setBtcPrice] = useState(null);

  // const sdk = useSDK();

  const [help, setHelp] = useState(false);

  const [amount, setamount] = useState([]);
  const [address, setaddress] = useState([]);
  const [privateKey, setprivateKey] = useState([]);

  const [_status, _setStatus] = useState();

  console.log("send data ", address, amount, privateKey,_status);
  const authToken = localStorage.getItem("token");
  console.log(authToken);
  // State to store QR code data for each payment
  const [qrCodes, setQrCodes] = useState([]);

  const { id, amd } = useParams();
  console.log("id===" + id);
  const [responseData, setResponseData] = useState(null);

  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://alpha-payment-backend.vercel.app/api/PaymentLinkGenerator/gett/${id}/${amd}`
        );
        if (!response.ok) {
          throw new Error("Request failed");
        }
        console.log("use effect 1");
        const data = await response.json();
        console.log(data);
        setdata(data.paymentLinks);
        setaddress(data.paymentLinks[0].address);
        setamount(data.paymentLinks[0].amount);
        setprivateKey(data.paymentLinks[0].privateKey);
        _setStatus(data.paymentLinks[0].status)
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
        const response = await axios.get(
          `https://alpha-payment-backend.vercel.app/api/changedetails/gett/${id}/${amd}/${address}/${amount}/${privateKey}`
        ); // Replace with your API endpoint
        if (response.data) {
          // navigate("/PaymentLinkGenerator")
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
    console.log("use effect 2");
  }, [address, amd, amount, id, navigate, privateKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price",
          {
            params: {
              ids: "bitcoin",
              vs_currencies: "usd",
            },
          }
        );
        const data = response.data;
        setBtcPrice(data.bitcoin.usd);
      } catch (error) {
        console.error("Error fetching BTC price:", error);
      }
    };

    // Fetch BTC price initially
    fetchData();

    // Set up an interval to fetch and update BTC price every 30 seconds (adjust as needed)
    // const intervalId = setInterval(fetchData, 30000);

    // // Clear the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, []);

  const handleCopyClick = (address) => {
    if (address) {
      copy(address);
      alert(`Copied: ${address}`);
    }
  };

  const getEmail = () => {
    setEmail("");
    axios
      .get(`https://alpha-payment-backend.vercel.app/api/getEmail/${email}`)
      .then((response) => {
        setEmail(response.data.email);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setEmail(null);
      });
  };

  // async function transferFunds() {
  //   try {
  //     const txResult = await sdk.wallet.transfer(address, amount);
  //     // If the transfer is successful, return true
  //     console.error("done" + txResult);
  //     // setaddfunds("");
  //     return true;
  //   } catch (error) {
  //     // If there's an error during the transfer, you can log it or handle it here
  //     console.error("Error during transfer:", error);
  //     alert("You have Insufficient balance");
  //     // setaddfunds("");
  //     // Return false to indicate that the transfer was not successful
  //     // setisTransactionok(false);
  //     return false;
  //   }
  // }

  return (
    <>
      {data.map((payment, index) => (
        <div className="Mainpamentpage">
          <div className="payment-page">
            <div className="payment-details">
              <h1 className="payment-title">Alpha Payment</h1>
              <div className="payment-amount">
                <span className="payment-amount-value">
                  {btcPrice
                    ? `${(payment.amount / btcPrice).toFixed(8)} BTC`
                    : "Loading..."}{" "}
                </span>
                <span className="payment-currency">${payment.amount}</span>
              </div>
              <p>{payment.expiresAt}</p>
              <p className="payment-address">Send the funds to this address</p>
              <div className="copy">
                <p className="payment-address-value">{payment.address}</p>
                <button
                  onClick={() => {
                    handleCopyClick(payment.address);
                  }}
                  className="copy-button"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
              <div>
                {payment.status === "Pending" ? (
                  <div>
                    <div>
                      <QRCode value={payment.address} />
                    </div>
                    {/* {!addresss ? (
                      <ConnectWallet
                        text="Connect Your Wallet"
                        color="primary"
                        size="large"
                      />
                    ) : (
                      <button onClick={transferFunds} id="add-fund-button" className="submit-button">
                        Add Funds
                      </button>
                    )} */}
                  </div>
                ) : (
                  <div>
                    {/* <p>Already Approved</p> */}
                    <img src={done} alt="" className="aprImg"  />
                    <a href="https://tiaiuto.shop/index.php/my-account/orders/"  target="_blank" rel="noreferrer">
                    <button  id="add-fund-button" className="submit-button">
                        Payment Confirmed
                      </button>
                  </a>
                  </div>
                )}
              </div>
            </div>

            <div className="payment-info-step__section-status snipcss-vQEDf">
              <div className="transaction-status">
                <div className="transaction-status-item transaction-status__item transaction-status-item_loading">
                  <div className="transaction-status-item__progress">
                    {/*  */}
                    {payment.status === "Pending" ? (
                      <div className="transaction-status-item__spinner"></div>
                    ) : (
                      <div className="transaction-status-item__progress-circle"></div>
                    )}
                  </div>
                  <div className="transaction-status-item__content">
                    <div className="transaction-status-item__title">
                      Waiting
                      <br />
                      for payment
                    </div>
                  </div>
                </div>
                <div className="transaction-status-item transaction-status__item">
                  <div className="transaction-status-item__progress">
                    <div className="transaction-status-item__progress-circle"></div>
                  </div>
                  <div className="transaction-status-item__content">
                    <div className="transaction-status-item__title">
                      Confirming
                      <br />
                      on blockchain
                    </div>
                  </div>
                </div>
                <div className="transaction-status-item transaction-status__item">
                  <div className="transaction-status-item__progress">
                    <div className="transaction-status-item__progress-circle"></div>
                  </div>
                  <div className="transaction-status-item__content">
                    <div className="transaction-status-item__title">
                      Confirmed
                      <br />
                      on blockchain
                    </div>
                  </div>
                </div>
                <div className="transaction-status-item transaction-status__item">
                  <div className="transaction-status-item__progress">
                    <div className="transaction-status-item__progress-circle"></div>
                  </div>
                  <div className="transaction-status-item__content">
                    <div className="transaction-status-item__title">
                      Sending
                      <br />
                      to seller
                    </div>
                  </div>
                </div>
                <div className="transaction-status-item transaction-status__item">
                  <div className="transaction-status-item__progress">
                    {/* <div className="transaction-status-item__progress-circle">
              </div> */}
                    {payment.status === "done" ? (
                      <div className="transaction-status-item__spinner"></div>
                    ) : (
                      <div className="transaction-status-item__progress-circle"></div>
                    )}
                  </div>
                  <div className="transaction-status-item__content">
                    <div className="transaction-status-item__title">
                      Sent to
                      <br />
                      seller 🎉
                    </div>
                  </div>
                </div>
              </div>
              <div className="payment-info-step__form-mobile">
                <div className="email-receipt-field">
                  <input
                    className="email-receipt-field__input"
                    placeholder="Email for transaction receipt"
                    defaultValue
                  />
                  <button type="button" className="email-receipt-field__button">
                    Confirm
                  </button>
                </div>
              </div>
              <div className="b-panel-help payment-info-step__panel-help">
                <div className="b-panel-help__container">
                  <div
                    className="b-panel-help__button"
                    tabIndex={0}
                    role="button"
                  >
                    Back
                  </div>
                  <button
                    onClick={() => {
                      setHelp(!help);
                    }}
                    type="button"
                    className="b-panel-help__button b-panel-help__button_help"
                  >
                    Help
                  </button>
                </div>
                {help ? (
                  <div className="b-panel-help__contents">
                    <div className="b-panel-help__box">
                      <p className="b-panel-help__text">
                        Copy the address and the amount to your wallet and press
                        <span className="b-panel-help__text-bold">Send</span>.
                      </p>
                      <p className="b-panel-help__text">
                        Please don’t send funds using smart contract, we won't
                        be able to detect them.
                      </p>
                      <p className="b-panel-help__text">
                        Still have questions? Reach out via the chat at the
                        bottom right corner.
                      </p>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          <div className="payment-bottom-info invoice__payment-info invoice__payment-info_transaction-page invoice__payment-info_with-order-id snipcss-IleUU">
            <br />
            <br />
            <div className="payment-bottom-info__id">
              Payment ID:
              <br />
              <span>{payment._id}</span>
            </div>
            <div className="payment-bottom-info__id">
              Order ID: {data[0]._id}
            </div>
            <div className="payment-bottom-info__description">
              optional :<span>{payment.note}</span>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div className="payment-bottom-info__email">
              <div className="payment-bottom-info__email-description">
                Leave your email and we'll notify you when the seller receives
                your payment
              </div>
              <div className="email-receipt-field payment-bottom-info__email-input">
                <input
                  className="email-receipt-field__input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Email for transaction receipt"
                />
                <button
                  type="button"
                  onClick={getEmail}
                  className="email-receipt-field__button"
                >
                  Confirm
                </button>
              </div>
              <div className="payment-bottom-info__email-error"></div>
              <div className="payment-bottom-info__text">
                AlphaPayments is for payment processing only. Please contact the
                store with any questions on goods/services
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Linkshow;
