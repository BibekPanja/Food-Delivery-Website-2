import React, { useEffect, useState } from "react";
import "./Order.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Order = () => {
  const [orders, setOrders] = useState([]);

  const url = "http://localhost:4000";

  // ========================================
  // FETCH ALL ORDERS
  // ========================================

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);

      console.log("Order API Response:", response.data);

      if (response.data.success) {
        setOrders(response.data.data || []);

        console.log("All Orders:", response.data.data);
      } else {
        toast.error(response.data.message || "Error fetching orders");
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);

      if (error.response) {
        console.error("Server Response:", error.response.data);
      }

      toast.error("Failed to fetch orders");
    }
  };

  // ========================================
  // LOAD ORDERS
  // ========================================
  const statusHandler = async (event, orderId) => {
    const responce = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value,
    });
    if (responce.data.success) {
      await fetchAllOrders();
    }
  };
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // ========================================
  // UI
  // ========================================

  return (
    <div className="order add">
      <h3>Order Page</h3>

      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={order._id || index} className="order-item">
              {/* Parcel Icon */}
              <img
                src={assets.parcel_icon}
                alt="Parcel"
                className="order-parcel-icon"
              />

              {/* Order Information */}
              <div className="order-information">
                {/* Food Items */}
                <p className="order-item-food">
                  {order.items?.map((item, itemIndex) => (
                    <span key={itemIndex}>
                      {item.name} x {item.quantity}
                      {itemIndex < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>

                {/* Customer Name */}
                <p className="order-item-name">
                  {order.address?.firstName || ""}{" "}
                  {order.address?.lastName || ""}
                </p>

                {/* Address */}
                <div className="order-item-address">
                  <p>{order.address?.street || ""}</p>

                  <p>
                    {order.address?.city || ""}

                    {order.address?.state ? `, ${order.address.state}` : ""}

                    {order.address?.country ? `, ${order.address.country}` : ""}

                    {order.address?.zipcode ? `, ${order.address.zipcode}` : ""}
                  </p>
                </div>

                {/* Phone */}
                <p className="order-item-phone">
                  Phone: {order.address?.phone || "N/A"}
                </p>

                {/* Email */}
                <p className="order-item-email">
                  Email: {order.address?.email || "N/A"}
                </p>
              </div>

              {/* Order Details */}
              <div className="order-item-details">
                <p>Items: {order.items?.length || 0}</p>

                <p>Amount: ${order.amount || 0}</p>

                <p>Payment: {order.payment ? "Paid" : "Not Paid"}</p>

                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;
