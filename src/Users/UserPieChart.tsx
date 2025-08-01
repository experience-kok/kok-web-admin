"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const description = "A pie chart with a label";
interface Status {
  totalUsers: number; // 등록된 전체 사용자 수
  clientCount: number; // Client 권한 가진 사용자 수
  userCount: number; // USER 권한 가진 사용자 수
  activeUsers: number; // 활성화 상태인 사용자 수
  inactiveUsers: number; // 비활성화 상태인 사용자 수
}

export function UserPieChart() {
  const [userStatus, setUserStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getUserStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInterceptor.get(`/users/stats`);
      const userStatus = response.data.data;
      setUserStatus(userStatus);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 401:
            toast.error("토큰이 만료되었습니다. 다시 로그인 해주세요");
            navigate("/login");
            break;
          case 403:
            toast.error("사용자 통계 조회는 관리자만 가능합니다.");
            break;

          case 500:
            toast.error("사용자 통계 조회 실패 : 데이터베이스 연결 오류.");
            break;
        }
      }
    }
  };
  useEffect(() => {
    getUserStatus();
  }, []);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }
  const chartData = [
    {
      status: "total",
      visitors: userStatus?.totalUsers,
      fill: "#9c3bf6",
    },
    {
      status: "client",
      visitors: userStatus?.clientCount,
      fill: "#10B981",
    },
    {
      status: "userCount",
      visitors: userStatus?.userCount,
      fill: "#F59E0B",
    },
    {
      status: "active",
      visitors: userStatus?.activeUsers,
      fill: "#3B82F6",
    },
    {
      status: "inactive",
      visitors: userStatus?.inactiveUsers,
      fill: "#EF4444",
    },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    total: {
      label: "Total",
      color: "var(--chart-1)",
    },
    client: {
      label: "Client",
      color: "var(--chart-2)",
    },
    userCount: {
      label: "UserCount",
      color: "var(--chart-3)",
    },
    active: {
      label: "Active",
      color: "var(--chart-4)",
    },
    inactive: {
      label: "InActive",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>사용자 통계</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="visitors" label nameKey="status" />
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
