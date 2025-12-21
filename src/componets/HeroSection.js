"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen m-1 bg-gray-900 text-white text-center px-4">
      <h1 className="font-bold text-4xl mb-4">
      Welcome to Smart MCQ Plugin
      </h1>
      <span className="text-3xl text-gray-300">
        AI-Powered MCQ Generator for Smarter Testing
      </span>
      <button
        className="bg-blue-900 hover:bg-blue-700 hover:cursor-pointer px-4 py-1 m-2 rounded text-white font-semibold text-xl"
        onClick={() => router.push('/identify')}
      >
        Proceed
      </button>
    </div>
  );
};

export default HeroSection;
