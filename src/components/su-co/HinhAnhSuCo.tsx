"use client";

import { useCallback, useEffect, useState } from "react";
import { chuanHoaDanhSachAnh } from "@/utils/hinhAnh";

interface HinhAnhSuCoProps {
  danhSachAnh?: unknown;
  tieuDeAnh?: string;
  nhanRong?: string;
}

function PhanTuAnh({
  duongDanGoc,
  tieuDe,
  viTri,
  onChon,
}: {
  duongDanGoc: string;
  tieuDe: string;
  viTri: number;
  onChon: () => void;
}) {
  const [duongDanHienTai, setDuongDanHienTai] = useState(duongDanGoc);
  const [daThuFallback, setDaThuFallback] = useState(false);
  const [coLoi, setCoLoi] = useState(false);

  useEffect(() => {
    setDuongDanHienTai(duongDanGoc);
    setDaThuFallback(false);
    setCoLoi(false);
  }, [duongDanGoc]);

  function xuLyLoi() {
    if (!daThuFallback) {
      try {
        const urlObj = new URL(duongDanHienTai, typeof window !== "undefined" ? window.location.href : "http://localhost:3000");
        if (urlObj.pathname.startsWith("/uploads/") && duongDanHienTai !== urlObj.pathname) {
          setDaThuFallback(true);
          setDuongDanHienTai(urlObj.pathname);
          return;
        }
      } catch {
        // Tiếp tục báo lỗi
      }
    }
    setCoLoi(true);
  }

  if (coLoi) {
    return (
      <div className="anh-su-co-loi" title={`Không thể tải: ${duongDanGoc}`}>
        <span className="bieu-tuong-anh-loi" aria-hidden="true">🖼️</span>
        <span>Ảnh {viTri + 1} lỗi</span>
        <button
          type="button"
          style={{
            fontSize: "11px",
            marginTop: "2px",
            border: "none",
            background: "none",
            color: "#0284c7",
            cursor: "pointer",
            textDecoration: "underline",
            padding: "2px 4px",
          }}
          onClick={() => {
            setCoLoi(false);
            setDaThuFallback(false);
            setDuongDanHienTai(duongDanGoc);
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <button
      className="nut-anh-su-co"
      type="button"
      onClick={onChon}
      aria-label={`Xem ${tieuDe} ${viTri + 1} phóng to`}
    >
      <img
        src={duongDanHienTai}
        alt={`${tieuDe} ${viTri + 1}`}
        loading="lazy"
        onError={xuLyLoi}
      />
      <span className="lop-phu-hover-anh">
        <span className="bieu-tuong-kinh-lup" aria-hidden="true">🔍</span>
      </span>
    </button>
  );
}

function KhungAnhPhongTo({
  duongDanGoc,
  tieuDe,
}: {
  duongDanGoc: string;
  tieuDe: string;
}) {
  const [duongDanHienTai, setDuongDanHienTai] = useState(duongDanGoc);
  const [daThuFallback, setDaThuFallback] = useState(false);
  const [coLoi, setCoLoi] = useState(false);

  useEffect(() => {
    setDuongDanHienTai(duongDanGoc);
    setDaThuFallback(false);
    setCoLoi(false);
  }, [duongDanGoc]);

  function xuLyLoi() {
    if (!daThuFallback) {
      try {
        const urlObj = new URL(duongDanHienTai, typeof window !== "undefined" ? window.location.href : "http://localhost:3000");
        if (urlObj.pathname.startsWith("/uploads/") && duongDanHienTai !== urlObj.pathname) {
          setDaThuFallback(true);
          setDuongDanHienTai(urlObj.pathname);
          return;
        }
      } catch {
        // Tiếp tục
      }
    }
    setCoLoi(true);
  }

  if (coLoi) {
    return (
      <div style={{ color: "white", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "16px" }}>Không thể hiển thị ảnh này từ máy chủ.</p>
        <p style={{ margin: "8px 0 0", fontSize: "12px", opacity: 0.7 }}>{duongDanGoc}</p>
      </div>
    );
  }

  return (
    <img
      src={duongDanHienTai}
      alt={tieuDe}
      onError={xuLyLoi}
    />
  );
}

export default function HinhAnhSuCo({
  danhSachAnh,
  tieuDeAnh = "Ảnh sự cố",
  nhanRong = "Chưa có hình ảnh.",
}: HinhAnhSuCoProps) {
  const [viTriDangXem, datViTriDangXem] = useState<number | null>(null);

  const danhSachDuongDan = chuanHoaDanhSachAnh(danhSachAnh);

  const dongModal = useCallback(() => {
    datViTriDangXem(null);
  }, []);

  const xemAnhTruoc = useCallback(
    (suKien?: React.MouseEvent) => {
      suKien?.stopPropagation();
      if (viTriDangXem === null || danhSachDuongDan.length <= 1) return;
      datViTriDangXem((viTri) => (viTri === null || viTri === 0 ? danhSachDuongDan.length - 1 : viTri - 1));
    },
    [viTriDangXem, danhSachDuongDan.length]
  );

  const xemAnhTiep = useCallback(
    (suKien?: React.MouseEvent) => {
      suKien?.stopPropagation();
      if (viTriDangXem === null || danhSachDuongDan.length <= 1) return;
      datViTriDangXem((viTri) => (viTri === null || viTri >= danhSachDuongDan.length - 1 ? 0 : viTri + 1));
    },
    [viTriDangXem, danhSachDuongDan.length]
  );

  // Lắng nghe phím ESC và mũi tên trái/phải khi đang xem ảnh phóng to
  useEffect(() => {
    if (viTriDangXem === null) return;

    function xuLyPhim(suKien: KeyboardEvent) {
      if (suKien.key === "Escape") {
        dongModal();
      } else if (suKien.key === "ArrowLeft") {
        xemAnhTruoc();
      } else if (suKien.key === "ArrowRight") {
        xemAnhTiep();
      }
    }

    window.addEventListener("keydown", xuLyPhim);
    return () => window.removeEventListener("keydown", xuLyPhim);
  }, [viTriDangXem, dongModal, xemAnhTruoc, xemAnhTiep]);

  if (danhSachDuongDan.length === 0) {
    return <p className="chu-phu">{nhanRong}</p>;
  }

  const anhHienTai = viTriDangXem !== null ? danhSachDuongDan[viTriDangXem] : null;

  return (
    <>
      <div className="danh-sach-anh-su-co">
        {danhSachDuongDan.map((anh, viTri) => (
          <div key={`${anh}-${viTri}`} className="khung-anh-su-co">
            <PhanTuAnh
              duongDanGoc={anh}
              tieuDe={tieuDeAnh}
              viTri={viTri}
              onChon={() => datViTriDangXem(viTri)}
            />
          </div>
        ))}
      </div>

      {anhHienTai && (
        <div
          className="lop-phu lop-phu-anh"
          role="dialog"
          aria-modal="true"
          aria-label={tieuDeAnh}
          onClick={dongModal}
        >
          <div className="hop-xem-anh" onClick={(suKien) => suKien.stopPropagation()}>
            <button
              className="nut-dong-anh"
              type="button"
              onClick={dongModal}
              aria-label="Đóng ảnh"
            >
              ×
            </button>

            {danhSachDuongDan.length > 1 && (
              <>
                <button
                  className="nut-chuyen-anh nut-anh-truoc"
                  type="button"
                  onClick={xemAnhTruoc}
                  aria-label="Ảnh trước"
                >
                  ‹
                </button>
                <button
                  className="nut-chuyen-anh nut-anh-tiep"
                  type="button"
                  onClick={xemAnhTiep}
                  aria-label="Ảnh tiếp theo"
                >
                  ›
                </button>
              </>
            )}

            <div className="khung-anh-phong-to">
              <KhungAnhPhongTo
                duongDanGoc={anhHienTai}
                tieuDe={`${tieuDeAnh} (${(viTriDangXem ?? 0) + 1}/${danhSachDuongDan.length})`}
              />
            </div>

            {danhSachDuongDan.length > 1 && (
              <div className="thong-tin-anh-phong-to">
                <span>
                  Ảnh {(viTriDangXem ?? 0) + 1} / {danhSachDuongDan.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
