import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold">Order #{id}</h1>
      <p className="mt-4">Order details will be shown here.</p>
    </div>
  );
};

export default OrderDetail;
