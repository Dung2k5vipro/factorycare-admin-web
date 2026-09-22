"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { dangNhap } from "@/services/xacThuc.service";
import { luuPhienDangNhap } from "@/services/phienDangNhap";
import type { LoiHttp } from "@/types/api";
import { kiemTraEmail } from "@/utils/kiemTraNguoiDung";

function BieuMauDangNhap() {
  const router = useRouter();
  const thamSoTimKiem = useSearchParams();
  const [email, datEmail] = useState("");
  const [matKhau, datMatKhau] = useState("");
  const [loiDangNhap, datLoiDangNhap] = useState("");
  const [dangTai, datDangTai] = useState(false);

  const thongBaoHetPhien = thamSoTimKiem.get("hetPhien") === "1"
    ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
    : "";

  async function xuLyDangNhap(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    datLoiDangNhap("");

    const loiEmail = kiemTraEmail(email);
    if (loiEmail) {
      datLoiDangNhap(loiEmail);
      return;
    }
    if (!matKhau) {
      datLoiDangNhap("Vui lòng nhập mật khẩu.");
      return;
    }

    datDangTai(true);
    try {
      const ketQua = await dangNhap(email.trim(), matKhau);
      if (ketQua.nguoiDung.vaiTro !== "QUAN_TRI_VIEN") {
        datLoiDangNhap("Tài khoản không có quyền truy cập Web Admin.");
        return;
      }
      if (ketQua.nguoiDung.trangThai === "NGUNG_HOAT_DONG") {
        datLoiDangNhap("Tài khoản đã ngừng hoạt động.");
        return;
      }

      luuPhienDangNhap(ketQua.token, ketQua.nguoiDung);
      router.replace("/admin/nguoi-dung");
    } catch (loi) {
      datLoiDangNhap(
        (loi as LoiHttp).message ||
          "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      datDangTai(false);
    }
  }

  return (
    <main className="khung-dang-nhap">
      <section className="the-dang-nhap" aria-labelledby="tieu-de-dang-nhap">
        <div className="dau-trang-dang-nhap">
          <div className="logo-nho">FC</div>
          <div>
            <p className="nhan-thuong-hieu">FACTORYCARE</p>
            <p className="mo-ta-thuong-hieu">Quản trị nhà máy</p>
          </div>
        </div>
        <h1 id="tieu-de-dang-nhap">Đăng nhập quản trị</h1>
        {(loiDangNhap || thongBaoHetPhien) && <div className="thong-bao loi" role="alert">{loiDangNhap || thongBaoHetPhien}</div>}

        <form onSubmit={xuLyDangNhap} className="bieu-mau">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(suKien) => datEmail(suKien.target.value)}
            placeholder="email@example.com"
            autoComplete="username"
            disabled={dangTai}
          />
          <label htmlFor="mat-khau">Mật khẩu</label>
          <input
            id="mat-khau"
            type="password"
            value={matKhau}
            onChange={(suKien) => datMatKhau(suKien.target.value)}
            autoComplete="current-password"
            disabled={dangTai}
          />
          <button className="nut nut-chinh nut-rong" type="submit" disabled={dangTai}>
            {dangTai ? <><span className="vong-xoay" aria-hidden="true" /> Đang xác thực...</> : "Đăng nhập"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function TrangDangNhap() {
  return <Suspense fallback={<main className="man-hinh-tai"><span className="vong-xoay" /> Đang tải...</main>}><BieuMauDangNhap /></Suspense>;
}
