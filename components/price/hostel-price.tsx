// components/HostelRoomOptions.tsx
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BadgeCheck, Home } from "lucide-react";

interface RoomPrices {
  seater1: number;
  seater2: number;
  seater3: number;
}

interface HostelRoomOptionsProps {
  acPrices?: RoomPrices;
  nonAcPrices?: RoomPrices;
}

const HostelRoomOptions: React.FC<HostelRoomOptionsProps> = ({ acPrices, nonAcPrices }) => {
  const defaultPrices: RoomPrices = {
    seater1: 0,
    seater2: 0,
    seater3: 0
  };

  const ac = acPrices || defaultPrices;
  const nonac = nonAcPrices || defaultPrices;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-extrabold text-center text-[#2c3e50] mb-6 tracking-tight">Room Pricing</h2>
      <Tabs defaultValue="ac" className="w-full">
        <TabsList className="flex justify-center gap-4 bg-[#f1f5f9] rounded-lg p-1">
          <TabsTrigger value="ac" className="rounded-full px-6 py-2 font-medium text-[#1e293b] data-[state=active]:bg-[#5A00F0] data-[state=active]:text-white">AC</TabsTrigger>
          <TabsTrigger value="nonac" className="rounded-full px-6 py-2 font-medium text-[#1e293b] data-[state=active]:bg-[#5A00F0] data-[state=active]:text-white">Non AC</TabsTrigger>
        </TabsList>

        <TabsContent value="ac">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            <Card className="shadow-md border border-[#5A00F0]/20">
              <CardContent className="p-6 flex flex-col items-center">
                <Home className="text-[#5A00F0] w-6 h-6 mb-2" />
                <p className="font-semibold text-lg mb-1">1-Seater</p>
                <p className="text-[#5A00F0] text-xl font-bold">₹{ac.seater1}</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border border-[#5A00F0]/20">
              <CardContent className="p-6 flex flex-col items-center">
                <Home className="text-[#5A00F0] w-6 h-6 mb-2" />
                <p className="font-semibold text-lg mb-1">2-Seater</p>
                <p className="text-[#5A00F0] text-xl font-bold">₹{ac.seater2}</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border border-[#5A00F0]/20">
              <CardContent className="p-6 flex flex-col items-center">
                <Home className="text-[#5A00F0] w-6 h-6 mb-2" />
                <p className="font-semibold text-lg mb-1">3-Seater</p>
                <p className="text-[#5A00F0] text-xl font-bold">₹{ac.seater3}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nonac">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            <Card className="shadow-md border border-[#5A00F0]/20">
              <CardContent className="p-6 flex flex-col items-center">
                <BadgeCheck className="text-[#5A00F0] w-6 h-6 mb-2" />
                <p className="font-semibold text-lg mb-1">1-Seater</p>
                <p className="text-[#5A00F0] text-xl font-bold">₹{nonac.seater1}</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border border-[#5A00F0]/20">
              <CardContent className="p-6 flex flex-col items-center">
                <BadgeCheck className="text-[#5A00F0] w-6 h-6 mb-2" />
                <p className="font-semibold text-lg mb-1">2-Seater</p>
                <p className="text-[#5A00F0] text-xl font-bold">₹{nonac.seater2}</p>
              </CardContent>
            </Card>
            <Card className="shadow-md border border-[#5A00F0]/20">
              <CardContent className="p-6 flex flex-col items-center">
                <BadgeCheck className="text-[#5A00F0] w-6 h-6 mb-2" />
                <p className="font-semibold text-lg mb-1">3-Seater</p>
                <p className="text-[#5A00F0] text-xl font-bold">₹{nonac.seater3}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default HostelRoomOptions;
