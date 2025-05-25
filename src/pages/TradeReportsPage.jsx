
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart2, Percent, TrendingDown, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const dailyPerformanceData = [
  { date: 'Mon', profit: 120, trades: 5 },
  { date: 'Tue', profit: -50, trades: 3 },
  { date: 'Wed', profit: 200, trades: 7 },
  { date: 'Thu', profit: 80, trades: 4 },
  { date: 'Fri', profit: 150, trades: 6 },
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};


const TradeReportsPage = () => {
  const summaryStats = [
    { title: 'Win Rate', value: '72%', icon: Percent, color: 'text-green-500' },
    { title: 'Total Trades (Week)', value: '128', icon: ListChecks, color: 'text-blue-500' },
    { title: 'Net P/L (Week)', value: '$1,280.50', icon: BarChart2, color: 'text-purple-500' },
    { title: 'Max Drawdown', value: '5.8%', icon: TrendingDown, color: 'text-red-500' },
  ];

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <BarChart2 className="mr-3 h-8 w-8 text-primary" /> Trade Performance
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphic">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="shadow-lg glassmorphic">
        <CardHeader>
          <CardTitle className="text-xl">Daily Performance Overview</CardTitle>
          <CardDescription className="text-muted-foreground">Profit/Loss and number of trades this week.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyPerformanceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar yAxisId="left" dataKey="profit" name="Profit ($)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="trades" name="Trades" fill="hsl(var(--secondary-foreground))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg glassmorphic">
        <CardHeader>
          <CardTitle className="text-xl">Historical Trade Logs</CardTitle>
          <CardDescription className="text-muted-foreground">Detailed list of all trades. Pagination and search coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Trade log table will be implemented here.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TradeReportsPage;
  