"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { ThietBi } from "@/types/thietBi";

interface Props {
  danhSachThietBi: ThietBi[];
  dangMo: boolean;
  dong: () => void;
}

type KieuIn = "A4_CHUAN" | "A4_NHO" | "TEM_CUON";

interface ThietBiCoQr extends ThietBi {
  anhQrBase64: string;
}

export default function InMaQr({ danhSachThietBi, dangMo, dong }: Props) {
  const [danhSachCoQr, datDanhSachCoQr] = useState<ThietBiCoQr[]>([]);
  const [dangTaoQr, datDangTaoQr] = useState(true);
  const [kieuIn, datKieuIn] = useState<KieuIn>("A4_CHUAN");
  const [hienViTri, datHienViTri] = useState(true);
  const [hienSerial, datHienSerial] = useState(true);

  useEffect(() => {
    if (!dangMo || danhSachThietBi.length === 0) {
      datDanhSachCoQr([]);
      return;
    }

    let daHuy = false;
    datDangTaoQr(true);

    async function taoTatCaQr() {
      const ketQua: ThietBiCoQr[] = [];
      for (const tb of danhSachThietBi) {
        const maQrText = tb.maQr || `FC-${tb.maThietBi}`;
        try {
          const base64 = await QRCode.toDataURL(maQrText, {
            errorCorrectionLevel: "M",
            margin: 1,
            width: 260,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });
          ketQua.push({
            ...tb,
            anhQrBase64: base64,
          });
        } catch {
          ketQua.push({
            ...tb,
            anhQrBase64: "",
          });
        }
      }
      if (!daHuy) {
        datDanhSachCoQr(ketQua);
        datDangTaoQr(false);
      }
    }

    void taoTatCaQr();

    return () => {
      daHuy = true;
    };
  }, [dangMo, danhSachThietBi]);

  if (!dangMo) return null;

  function thucHienIn() {
    window.print();
  }

  function taiAnhQr(tb: ThietBiCoQr) {
    if (!tb.anhQrBase64) return;
    const link = document.createElement("a");
    link.href = tb.anhQrBase64;
    link.download = `QR_${tb.maThietBi}_${tb.soSerial || "device"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const laInDonLe = danhSachThietBi.length === 1;

  return (
    <div className="lop-phu lop-phu-in-qr">
      {/* Vùng hộp thoại xem trước (Không in phần này khi bấm Print) */}
      <section className="hop-thoai hop-thoai-in-qr" role="dialog" aria-modal="true">
        <header className="dau-hop-thoai phan-khong-in">
          <div>
            <h2>{laInDonLe ? "In nhãn QR thiết bị" : `In mã QR hàng loạt (${danhSachThietBi.length} thiết bị)`}</h2>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>
              {laInDonLe
                ? "Xem trước và in tem nhãn tài sản cho thiết bị được chọn."
                : "Xem trước trang in nhãn tài sản cho toàn bộ danh sách đã chọn."}
            </p>
          </div>
          <button className="nut-dong" type="button" onClick={dong} aria-label="Đóng">
            ×
          </button>
        </header>

        {/* Thanh công cụ tùy chỉnh in (Không in) */}
        <div className="thanh-tuy-chinh-in phan-khong-in">
          <div className="nhom-tuy-chinh">
            <label>Khổ giấy &amp; Bố cục in:</label>
            <select
              value={kieuIn}
              onChange={(e) => datKieuIn(e.target.value as KieuIn)}
              style={{ width: "auto", minWidth: "220px", height: "36px" }}
            >
              <option value="A4_CHUAN">📄 Khổ A4 (Lưới chuẩn 2x4 = 8 tem)</option>
              <option value="A4_NHO">📑 Khổ A4 (Lưới nhỏ 3x7 = 21 tem)</option>
              <option value="TEM_CUON">🏷️ Tem nhãn cuộn (Máy in nhiệt 75x50mm)</option>
            </select>
          </div>

          <div className="nhom-tuy-chinh" style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px" }}>
              <input
                type="checkbox"
                checked={hienViTri}
                onChange={(e) => datHienViTri(e.target.checked)}
              />
              Hiện vị trí
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px" }}>
              <input
                type="checkbox"
                checked={hienSerial}
                onChange={(e) => datHienSerial(e.target.checked)}
              />
              Hiện Serial / Model
            </label>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            {laInDonLe && danhSachCoQr[0]?.anhQrBase64 && (
              <button
                type="button"
                className="nut nut-phu"
                style={{ minHeight: "36px", fontSize: "13px" }}
                onClick={() => taiAnhQr(danhSachCoQr[0])}
              >
                💾 Tải ảnh QR (.png)
              </button>
            )}
            <button
              type="button"
              className="nut nut-chinh"
              style={{ minHeight: "36px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              onClick={thucHienIn}
              disabled={dangTaoQr}
            >
              🖨️ {laInDonLe ? "In nhãn này" : `In ${danhSachCoQr.length} nhãn QR`}
            </button>
          </div>
        </div>

        {/* Khung chứa các tem nhãn hiển thị xem trước & in ấn */}
        <div className="noi-dung-in-qr">
          {dangTaoQr ? (
            <div className="trang-thai-du-lieu">
              <span className="vong-xoay" /> Đang tạo mã QR hình ảnh...
            </div>
          ) : (
            <div id="vung-in-tem-qr" className={`luoi-tem-qr kieu-${kieuIn.toLowerCase()}`}>
              {danhSachCoQr.map((tb) => {
                const maQrText = tb.maQr || `FC-${tb.maThietBi}`;
                const tenLoaiText = tb.loaiThietBi?.tenLoai || "Thiết bị";
                const tenViTriText = tb.viTri?.tenViTri || "Chưa gán";

                return (
                  <div key={tb.id} className="the-tem-qr">
                    <div className="dau-tem-qr">
                      <span className="logo-tem">FACTORYCARE</span>
                      <span className="loai-tem">{tenLoaiText}</span>
                    </div>

                    <div className="than-tem-qr">
                      <div className="khoi-anh-qr">
                        {tb.anhQrBase64 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={tb.anhQrBase64} alt={`QR ${tb.maThietBi}`} />
                        ) : (
                          <div className="qr-loi">QR</div>
                        )}
                        <span className="chu-ma-qr">{maQrText}</span>
                      </div>

                      <div className="thong-tin-tem-qr">
                        <div className="ma-thiet-bi-tem">{tb.maThietBi}</div>
                        <div className="ten-thiet-bi-tem" title={tb.tenThietBi}>
                          {tb.tenThietBi}
                        </div>

                        {hienSerial && (tb.model || tb.soSerial) && (
                          <div className="dong-phu-tem">
                            {tb.model && <span>Model: <strong>{tb.model}</strong></span>}
                            {tb.soSerial && <span>SN: <strong>{tb.soSerial}</strong></span>}
                          </div>
                        )}

                        {hienViTri && (
                          <div className="vi-tri-tem">
                            📍 <span>{tenViTriText}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="chan-tem-qr">
                      <span>Quét QR để báo sự cố &amp; bảo trì</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className="chan-hop-thoai phan-khong-in" style={{ justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Mẹo: Sử dụng máy in văn phòng (Khổ A4) hoặc máy in mã vạch / nhãn nhiệt (Khổ cuộn).
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="nut nut-phu" onClick={dong}>
              Đóng
            </button>
            <button
              type="button"
              className="nut nut-chinh"
              onClick={thucHienIn}
              disabled={dangTaoQr}
            >
              🖨️ Bắt đầu in
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
