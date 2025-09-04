import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orderCounts, setOrderCounts] = useState({
    active: 0,
    completed: 0,
    pending: 0
  });

  const updateOrderCounts = (ordersList) => {
    const counts = ordersList.reduce((acc, order) => {
      const status = order.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { active: 0, completed: 0, pending: 0 });
    setOrderCounts(counts);
  };

  const fetchAndUpdateCounts = async () => {
    try {
      const response = await API.get("/orders/all");
      updateOrderCounts(response.data);
    } catch (error) {
      console.error("Error fetching orders for counts:", error);
    }
  };

  useEffect(() => {
    fetchAndUpdateCounts();
  }, []);

  return (
    <OrderContext.Provider value={{ orderCounts, updateOrderCounts, fetchAndUpdateCounts }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
