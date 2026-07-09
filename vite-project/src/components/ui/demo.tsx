import { LampContainer } from "@/components/ui/lamp";
import { SplineScene } from "@/components/ui/splite";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SplineDemo() {
  return (
    // Đổi h-screen thành min-h-screen để tránh lỗi cuộn trên mobile.
    // Dùng flex-col cho mobile, lg:flex-row cho desktop.
    <LampContainer>
      <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-between p-0 relative z-10">
        
        {/* Text + CTA -> Cập nhật chiếm full width trên mobile, nửa trái trên desktop */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-12 lg:py-8 relative z-10 text-center lg:text-left">
        
        {/* Thay thế Card components bằng thẻ HTML chuẩn */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-4">
          Print<span className="text-[#39FF14] drop-shadow-[0_0_20px_rgba(57,255,20,0.6)]">Hub 3D</span>
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
          Nền tảng kết nối dịch vụ in 3D thế hệ mới. Khám phá hàng trăm
          thiết kế 3D, đặt in theo yêu cầu, và quản lý đơn hàng dễ dàng.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#39FF14] hover:bg-[#32e612] text-black font-extrabold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-105 w-fit"
          >
            Bắt đầu ngay
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/catalog-preview"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-white/5 hover:bg-[#39FF14]/15 border border-white/10 hover:border-[#39FF14]/40 text-white hover:text-[#39FF14] font-semibold text-sm transition-all duration-300 hover:scale-105 w-fit"
          >
            Xem sản phẩm
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* 3D Robot -> Giới hạn chiều cao rõ ràng trên mobile, full cao trên desktop */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative z-10 [filter:hue-rotate(280deg)]">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
      </div>
    </LampContainer>
  );
}

import Component from "@/components/ui/login-1";

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Component onLogin={(username, role) => console.log(username, role)} />
    </div>
  );
};

export { DemoOne };