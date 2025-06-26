import React from 'react';

interface PriceTemplateProps {
  hostelName?: string;
}

const PriceTemplate: React.FC<PriceTemplateProps> = ({ 
  hostelName = "Paradise Hostel" 
}) => {
  const priceData = [
    { roomType: "3 Seater", acPrice: "₹8,500", nonAcPrice: "₹6,200" },
    { roomType: "2 Seater", acPrice: "₹12,000", nonAcPrice: "₹9,500" },
    { roomType: "1 Seater", acPrice: "₹18,000", nonAcPrice: "₹14,500" }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="overflow-hidden rounded-lg border border-purple-200">
        <table className="w-full">
          {/* Header Row with Hostel Name */}
          <thead>
            <tr>
              <th 
                colSpan={3} 
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 text-xl font-bold text-center"
              >
                {hostelName}
              </th>
            </tr>
          </thead>
          
          <tbody>
            {/* Column Headers Row */}
            <tr className="bg-purple-100">
              <th className="py-3 px-4 text-left font-semibold text-purple-800 border-r border-purple-200">
                S.No
              </th>
              <th className="py-3 px-4 text-center font-semibold text-purple-800 border-r border-purple-200">
                AC Rooms
              </th>
              <th className="py-3 px-4 text-center font-semibold text-purple-800">
                Non-AC Rooms
              </th>
            </tr>
            
            {/* Data Rows */}
            {priceData.map((row, index) => (
              <tr 
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-purple-50'
                } hover:bg-purple-100 transition-colors duration-200`}
              >
                <td className="py-4 px-4 font-medium text-purple-900 border-r border-purple-200">
                  {row.roomType}
                </td>
                <td className="py-4 px-4 text-center font-bold text-purple-700 border-r border-purple-200">
                  <span className="bg-purple-200 px-3 py-1 rounded-full text-sm">
                    {row.acPrice}
                  </span>
                </td>
                <td className="py-4 px-4 text-center font-bold text-purple-700">
                  <span className="bg-purple-200 px-3 py-1 rounded-full text-sm">
                    {row.nonAcPrice}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Note */}
      
    </div>
  );
};

export default PriceTemplate;