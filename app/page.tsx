'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="mb-4 text-4xl font-bold">Mandalart</h1>
        <p className="text-gray-600">目標達成のためのマンダラートアプリケーション</p>
      </motion.div>
    </main>
  );
}
