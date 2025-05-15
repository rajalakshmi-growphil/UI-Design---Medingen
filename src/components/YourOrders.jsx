import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style/YourOrders.css";

import pendingIcon from "../assets/icons/Pending.svg";
import confirmedIcon from "../assets/icons/Confirmed.svg";
import outForDeliveryIcon from "../assets/icons/out_for_ delivery.svg";
import deliveredIcon from "../assets/icons/delivered.svg";

import callNowIcon from "../assets/icons/CallNow.svg";
import payNowIcon from "../assets/icons/pay_now.svg";
import reorderIcon from "../assets/icons/Reorder.svg";

const statusIconMap = {
  pending: pendingIcon,
  confirmed: confirmedIcon,
  "out for delivery": outForDeliveryIcon,
  delivered: deliveredIcon,
};

const actionIconMap = {
  "Call Now": callNowIcon,
  "Pay Now": payNowIcon,
  Reorder: reorderIcon,
};

const YourOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/orders");
        setOrders(response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="orders-container">Loading orders...</div>;
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return <div className="orders-container">No orders to display.</div>;
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">Your Orders</h2>
      {orders.map((order) => {
        const normalizedStatus = order.order_status.toLowerCase();
        const statusIcon = statusIconMap[normalizedStatus];

        return (
          <div
            className="order-card"
            key={order.order_id}
            onClick={() =>
              navigate(`/order/${order.order_id}`, { state: { order } })
            }
          >
            <div className="order-header">
              <div className="order-status-section">
                {statusIcon && (
                  <img
                    className="status-icon"
                    src={statusIcon}
                    alt={order.order_status}
                  />
                )}
                <span className="order-status">{order.action.label}</span>
              </div>
              <span className="order-date">
                Order Placed On
                <br />
                {order.order_placed_on}
              </span>
            </div>

            <div className="order-items">
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div className="item" key={index}>
                    <span className="item-name">{item.name}</span>
                    <span className="item-unit">{item.unit}</span>
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="total-price-section">
                <div className="total-label">Total Price</div>
                <div className="total-amount">
                  ₹
                  {order.items
                    .reduce(
                      (acc, item) => acc + item.quantity * item.price_per_unit,
                      0
                    )
                    .toFixed(2)}
                </div>
              </div>
            </div>

            <div className="order-footer">
              <p className="footer-message">{order.action.message}</p>
              <button className="action-btn">
                {actionIconMap[order.action.type] && (
                  <img
                    src={actionIconMap[order.action.type]}
                    alt={order.action.type}
                  />
                )}
                {order.action.type}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YourOrders;
