import {
  ArrowUpRightIcon,
  BarChart3Icon,
  LineChartIcon,
  PieChartIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

export const Box = (): JSX.Element => {
  // Data for the chart visualization
  const chartData = [
    { month: "Jan", value: 35 },
    { month: "Feb", value: 28 },
    { month: "Mar", value: 45 },
    { month: "Apr", value: 56 },
    { month: "May", value: 72 },
    { month: "Jun", value: 62 },
    { month: "Jul", value: 80 },
    { month: "Aug", value: 90 },
  ];

  // Stats data
  const statsData = [
    { title: "Total Revenue", value: "$45,231.89", change: "+20.1%" },
    { title: "Subscriptions", value: "+2350", change: "+180.1%" },
    { title: "Sales", value: "+12,234", change: "+19.5%" },
    { title: "Active Users", value: "+573", change: "+201.2%" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0F172A] p-6 text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button   className="border-gray-700 text-gray-300">
            Download
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Create New
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <Card key={index} className="bg-[#1E293B] border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="flex items-center text-emerald-500 text-sm">
                  {stat.change} <ArrowUpRightIcon className="ml-1 h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#1E293B] border-0 mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Overview</h2>
            <Tabs defaultValue="bar">
              <TabsList className="bg-[#0F172A]">
                <TabsTrigger value="bar">
                  <BarChart3Icon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="line">
                  <LineChartIcon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="pie">
                  <PieChartIcon className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="h-80">
            <TabsContent value="bar" className="h-full">
              <div className="flex items-end justify-between h-full w-full pt-6">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-12 bg-indigo-600 rounded-sm"
                      style={{ height: `${item.value}%` }}
                    ></div>
                    <span className="text-xs text-gray-400 mt-2">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="line" className="h-full">
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Line chart visualization</p>
              </div>
            </TabsContent>
            <TabsContent value="pie" className="h-full">
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Pie chart visualization</p>
              </div>
            </TabsContent>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#1E293B] border-0">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Recent Sales</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700 mr-3"></div>
                    <div>
                      <p className="font-medium">User {index + 1}</p>
                      <p className="text-sm text-gray-400">
                        user{index + 1}@example.com
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    +${(Math.random() * 1000).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-0">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex">
                  <div className="w-1 bg-indigo-600 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Activity {index + 1}</p>
                    <p className="text-sm text-gray-400">
                      {index + 1} hour ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
