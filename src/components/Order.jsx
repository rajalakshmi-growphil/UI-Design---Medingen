import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./style/Order.css";

const Order = () => {
  const { state } = useLocation();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.order) {
      setOrder(state.order);
    }
  }, [state]);

  if (!order) return <div className="loading">Loading...</div>;

  const { order_timeline, delivery_location, items, order_id: id } = order;
  const orderTotal = items.reduce((sum, item) => sum + item.total_price, 0);

  const ALL_STEPS = ["Ordered", "Shipped", "Out for delivery", "Delivered"];
  const timelineMap = {};
  order_timeline.forEach((step) => {
    timelineMap[step.status] = step;
  });

  return (
    <>
      <div className="order-header-wrapper">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} />
        </button>
        <h2 className="order-header">Order</h2>
      </div>
      <div className="order-container">
        <h2 className="section-title">
          Order ID <span className="order-id">{id}</span>
        </h2>

        <div className="timeline">
          {ALL_STEPS.map((status, index) => {
            const step = timelineMap[status];
            const isCompleted = Boolean(step);

            return (
              <div key={index} className="timeline-step">
                <div className="step-left">
                  {isCompleted ? (
                    <>
                      <div className="step-date">
                        {step.timestamp.split(",")[0]}
                      </div>
                      <div className="step-time">
                        {step.timestamp.split(",")[1]}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="step-date">--</div>
                      <div className="step-time">--</div>
                    </>
                  )}
                </div>

                <div className="step-center">
                  <div
                    className={`dot ${
                      isCompleted ? "dot-completed" : "dot-pending"
                    }`}
                  />
                  {index < ALL_STEPS.length - 1 && <div className="line" />}
                </div>

                <div
                  className={`step-right ${
                    isCompleted ? "completed" : "pending"
                  }`}
                >
                  <div className="step-status">{status}</div>
                  {isCompleted && step.location && (
                    <div className="step-location">({step.location})</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="location-box">
          <div className="location-label">
            <FaMapMarkerAlt size={14} /> Use Current Location
          </div>
          <div className="location-address">{delivery_location.address}</div>
        </div>

        <div className="items-section">
          <h3 className="items-title">
            Items in order{" "}
            <span className="item-count">{items.length} Items</span>
          </h3>
          {items.map((item, idx) => (
            <div key={idx} className="item-row">
              <img src={item.image_url} alt={item.name} className="item-img" />
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-meta">
                  {item.unit} | Rs.{item.price_per_unit.toFixed(2)}
                  <span className="quantity-pill">x{item.quantity}</span>
                </div>
              </div>
              <div className="item-price">Rs.{item.total_price.toFixed(2)}</div>
            </div>
          ))}
          <div className="order-total">
            Order Total <span>Rs.{orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
