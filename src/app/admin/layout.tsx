"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  guiYeuCauDangXuat,
  layThongTinNguoiDungHienTai,
} from "@/services/xacThuc.service";
import { layNguoiDungDaLuu, xoaPhienDangNhap } from "@/services/phienDangNhap";
import type { NguoiDung } from "@/types/nguoiDung";

const DUONG_DAN_THIET_BI = [
  "/admin/thiet-bi",
  "/admin/nhap-thiet-bi",
  "/admin/vi-tri",
  "/admin/nha-cung-cap",
  "/admin/lo-nhap",
  "/admin/dieu-chuyen",
  "/admin/bao-hanh",
];

const CHUC_NANG_THIET_BI = [
  { duongDan: "/admin/thiet-bi", nhan: "Danh sách thiết bị" },
  { duongDan: "/admin/nhap-thiet-bi", nhan: "Nhập thiết bị" },
  { duongDan: "/admin/vi-tri", nhan: "Vị trí" },
  { duongDan: "/admin/nha-cung-cap", nhan: "Nhà cung cấp" },
  { duongDan: "/admin/lo-nhap", nhan: "Lô nhập" },
  { duongDan: "/admin/dieu-chuyen", nhan: "Điều chuyển" },
  { duongDan: "/admin/bao-hanh", nhan: "Bảo hành" },
];

function laTrangThietBi(duongDan: string) {
  return DUONG_DAN_THIET_BI.some((duongDanGoc) =>
    duongDan.startsWith(duongDanGoc),
  );
}

function layTieuDeTrang(duongDan: string) {
  if (duongDan.startsWith("/admin/su-co")) return "Sự cố & Sửa chữa";
  const chucNang = CHUC_NANG_THIET_BI.find((muc) =>
    duongDan.startsWith(muc.duongDan),
  );

  return chucNang?.nhan || "Người dùng & phân quyền";
}

export default function BoCucAdmin({ children }: { children: ReactNode }) {
  const router = useRouter();
  const duongDan = usePathname();
  const [nguoiDung, datNguoiDung] = useState<NguoiDung | null>(null);
  const [dangKiemTra, datDangKiemTra] = useState(true);
  const [loiKiemTra, datLoiKiemTra] = useState("");
  const [dangMoNhomThietBi, datDangMoNhomThietBi] = useState(false);

  useEffect(() => {
    let dangHoatDong = true;

    async function kiemTraDangNhap() {
      const nguoiDungDaLuu = layNguoiDungDaLuu();

      if (!nguoiDungDaLuu) {
        router.replace("/dang-nhap");
        return;
      }

      if (nguoiDungDaLuu.vaiTro !== "QUAN_TRI_VIEN") {
        xoaPhienDangNhap();
        router.replace("/dang-nhap");
        return;
      }

      try {
        const nguoiDungHienTai = await layThongTinNguoiDungHienTai();
        if (!dangHoatDong) return;

        const khongDuocTruyCap =
          nguoiDungHienTai.vaiTro !== "QUAN_TRI_VIEN" ||
          nguoiDungHienTai.trangThai === "NGUNG_HOAT_DONG";

        if (khongDuocTruyCap) {
          xoaPhienDangNhap();
          router.replace("/dang-nhap");
          return;
        }

        datNguoiDung(nguoiDungHienTai);
        datDangKiemTra(false);
      } catch {
        if (dangHoatDong) {
          datLoiKiemTra(
            "Không thể kiểm tra phiên đăng nhập. Vui lòng thử lại.",
          );
          datDangKiemTra(false);
        }
      }
    }

    void kiemTraDangNhap();

    return () => {
      dangHoatDong = false;
    };
  }, [router]);

  async function xuLyDangXuat() {
    try {
      await guiYeuCauDangXuat();
    } finally {
      xoaPhienDangNhap();
      router.replace("/dang-nhap");
      router.refresh();
    }
  }

  if (loiKiemTra) {
    return (
      <main className="man-hinh-tai">
        <p>{loiKiemTra}</p>
        <button
          className="nut nut-phu"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </main>
    );
  }

  if (dangKiemTra || !nguoiDung) {
    return (
      <main className="man-hinh-tai">
        <span className="vong-xoay" />
        Đang kiểm tra phiên đăng nhập...
      </main>
    );
  }

  return (
    <div className="khung-ung-dung">
      <aside className="thanh-ben">
        <div className="thuong-hieu">
          <div className="logo-nho">FC</div>
          <div>
            <strong>FactoryCare</strong>
            <span>Quản trị nhà máy</span>
          </div>
        </div>

        <nav className="dieu-huong" aria-label="Điều hướng chính">
          <span className="nhan-dieu-huong">QUẢN TRỊ</span>

          <a
            className={`muc-dieu-huong ${
              duongDan.startsWith("/admin/nguoi-dung") ? "dang-chon" : ""
            }`}
            href="/admin/nguoi-dung"
          >
            <span aria-hidden="true">◈</span>
            Người dùng &amp; phân quyền
          </a>

          <button
            className={`muc-dieu-huong nut-nhom-dieu-huong ${
              laTrangThietBi(duongDan) ? "dang-chon" : ""
            }`}
            type="button"
            aria-expanded={dangMoNhomThietBi}
            aria-controls="dieu-huong-thiet-bi"
            onClick={() => datDangMoNhomThietBi((dangMo) => !dangMo)}
          >
            <span aria-hidden="true">▣</span>
            <span className="ten-nhom-dieu-huong">Thiết bị</span>
            <span className="mui-ten-nhom" aria-hidden="true">
              {dangMoNhomThietBi ? "▴" : "▾"}
            </span>
          </button>

          {dangMoNhomThietBi && (
            <div
              id="dieu-huong-thiet-bi"
              className="dieu-huong-con"
              aria-label="Chức năng thiết bị"
            >
              {CHUC_NANG_THIET_BI.map((muc) => (
                <a
                  key={muc.duongDan}
                  className={
                    duongDan.startsWith(muc.duongDan) ? "dang-chon" : ""
                  }
                  href={muc.duongDan}
                >
                  {muc.nhan}
                </a>
              ))}
            </div>
          )}

          <a
            className={`muc-dieu-huong ${duongDan.startsWith("/admin/su-co") ? "dang-chon" : ""}`}
            href="/admin/su-co"
          >
            <span aria-hidden="true">⚠</span>
            Sự cố &amp; Sửa chữa
          </a>
        </nav>
      </aside>

      <div className="vung-noi-dung">
        <header className="thanh-dau">
          <div>
            <h1>{layTieuDeTrang(duongDan)}</h1>
          </div>
          <div className="thong-tin-tai-khoan">
            <span className="avatar">
              {nguoiDung.hoTen.slice(0, 1).toUpperCase()}
            </span>
            <span className="ten-tai-khoan">{nguoiDung.hoTen}</span>
            <button className="nut-link" onClick={xuLyDangXuat}>
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="noi-dung-chinh">{children}</main>
      </div>
    </div>
  );
}
