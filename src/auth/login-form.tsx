import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStringInput } from "@/hooks/use-string-input";
import { login } from "@/auth/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { value: email, handleValue: handleEmail } = useStringInput("");
  const { value: password, handleValue: handlePassword } = useStringInput("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 동기 함수
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login(email, password);
      toast.success("로그인 성공하였습니다.");
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            toast.error("잘못된 요청입니다. 입력 데이터를 확인해주세요.");
            break;
          case 401:
            toast.error("토큰이 만료되었습니다. 다시 로그인 해주세요");
            navigate("/login");
            break;
          case 403:
            toast.error("접근 권한이 없습니다.");
            break;
          case 429:
            toast.error(
              "로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요"
            );
            break;
          case 500:
            toast.error("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
            break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>체험콕 관리자 로그인</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="chkok@example.com"
                    required
                    value={email}
                    onChange={handleEmail}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">비밀번호</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={handlePassword}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중입니다..." : "로그인"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
