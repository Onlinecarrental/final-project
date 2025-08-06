import React, { useEffect, useState } from "react";
import BaseCard from "../../../components/card";
import { PieChart, Pie, Cell } from "recharts";
import axios from "axios";

const COLORS = ["#000000", "#5F38F3"];

function CarStatusDashboard() {
  const [data, setData] = useState([
    { name: "Approved", value: 0 },
    { name: "Pending", value: 0 },
  ]);
  const [total, setTotal] = useState(0);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchCars = async () => {
      try {
        if (!user.uid) return;
        const res = await axios.get('https://backendonlinecar.netlify.app/.netlify/functions/express-server/api/cars');
        const agentCars = (res.data.data || []).filter(car => car.agentId === user.uid);
        const approved = agentCars.filter(car => car.status === 'rented').length;
        const pending = agentCars.filter(car => car.status === 'pending').length;
        setData([
          { name: "Approved", value: approved },
          { name: "Pending", value: pending },
        ]);
        setTotal(approved + pending);
      } catch (err) {
        setData([
          { name: "Approved", value: 0 },
          { name: "Pending", value: 0 },
        ]);
        setTotal(0);
      }
    };
    fetchCars();
  }, [user.uid]);

  return (
    <BaseCard width="w-full" height="h-[250px]" bgColor="bg-white" className="border">
      <div className="flex items-center  h-full">
        {/* Legend */}
        <div className="flex flex-col justify-center pl-4 pr-8 space-y-4">
          {data.map((entry, idx) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <span className={`w-4 h-4 rounded-full ${idx === 0 ? 'bg-black' : 'bg-[#5F38F3]'}`} />
              <span className="text-sm font-medium">{entry.name}</span>
              <span className="text-xs text-gray-700 font-semibold">{total > 0 ? `${Math.round((entry.value / total) * 100)}%` : '0%'}</span>
            </div>
          ))}
        </div>
        {/* Donut Chart */}
        <div className="flex-1">
          <h2 className="text-center text-xl font-bold mb-2">Car Status</h2>
          <div className="flex justify-center items-center">
            <PieChart width={150} height={150}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

export default CarStatusDashboard;
