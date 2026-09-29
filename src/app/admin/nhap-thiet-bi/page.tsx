"use client";

import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  layDanhSachLoaiThietBi,
  layDanhSachLoNhap,
  layDanhSachViTri,
  nhapThietBi,
  xemTruocNhapThietBi,
} from "@/services/thietBi.service";
import type { KetQuaImport } from "@/types/quanLyThietBi";
import type { LoaiThietBi, LoNhap, ViTri } from "@/types/thietBi";
import type { LoiHttp } from "@/types/api";
import { NHAN_TRANG_THAI_THIET_BI } from "@/utils/kiemTraThietBi";

const KICH_THUOC_TOI_DA = 5 * 1024 * 1024; // 5MB

function dinhDangDungLuong(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function dinhDangTien(giaTri?: number | null) {
  if (giaTri == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri);
}

export default function TrangNhapThietBi() {
  const [tep, datTep] = useState<File | null>(null);
  const [dangKeo, datDangKeo] = useState(false);
  const [ketQua, datKetQua] = useState<KetQuaImport | null>(null);
  const [ketQuaThanhCong, datKetQuaThanhCong] = useState<KetQuaImport | null>(null);
  const [loi, datLoi] = useState("");
  const [dangTai, datDangTai] = useState(false);
  const [dangImport, datDangImport] = useState(false);
  const [thongBao, datThongBao] = useState("");
  const [dangMoHuongDan, datDangMoHuongDan] = useState(false);

  const [danhSachLoai, datDanhSachLoai] = useState<LoaiThietBi[]>([]);
  const [danhSachViTri, datDanhSachViTri] = useState<ViTri[]>([]);
  const [danhSachLoNhap, datDanhSachLoNhap] = useState<LoNhap[]>([]);

  useEffect(() => {
    void layDanhSachLoaiThietBi({ trang: 1, gioiHan: 100 })
      .then((kq) => datDanhSachLoai(kq.danhSach))
      .catch(() => undefined);
    void layDanhSachViTri()
      .then((kq) => datDanhSachViTri(kq.danhSach))
      .catch(() => undefined);
    void layDanhSachLoNhap()
      .then((kq) => datDanhSachLoNhap(kq.danhSach))
      .catch(() => undefined);
  }, []);

  function xuLyChonTep(tepMoi: File | null) {
    datLoi("");
    datKetQua(null);
    datKetQuaThanhCong(null);
    datThongBao("");

    if (!tepMoi) {
      datTep(null);
      return;
    }

    const tenTep = tepMoi.name.toLowerCase();
    const hopLe = tenTep.endsWith(".xlsx") || tenTep.endsWith(".csv");
    if (!hopLe) {
      datTep(null);
      datLoi("File không đúng định dạng. Hệ thống chỉ hỗ trợ file .xlsx hoặc .csv.");
      return;
    }

    if (tepMoi.size === 0) {
      datTep(null);
      datLoi("File rỗng, không có dữ liệu.");
      return;
    }

    if (tepMoi.size > KICH_THUOC_TOI_DA) {
      datTep(null);
      datLoi("File vượt quá dung lượng cho phép (tối đa 5MB).");
      return;
    }

    datTep(tepMoi);
  }

  function chonTepTuInput(suKien: ChangeEvent<HTMLInputElement>) {
    const tepMoi = suKien.target.files?.[0] || null;
    xuLyChonTep(tepMoi);
  }

  function xuLyKeoTha(suKien: DragEvent<HTMLDivElement>) {
    suKien.preventDefault();
    suKien.stopPropagation();
    datDangKeo(false);

    const tepMoi = suKien.dataTransfer.files?.[0] || null;
    xuLyChonTep(tepMoi);
  }

  function xuLyDragOver(suKien: DragEvent<HTMLDivElement>) {
    suKien.preventDefault();
    suKien.stopPropagation();
    if (!dangKeo) datDangKeo(true);
  }

  function xuLyDragLeave(suKien: DragEvent<HTMLDivElement>) {
    suKien.preventDefault();
    suKien.stopPropagation();
    datDangKeo(false);
  }

  function taiFileMau() {
    const noiDungCsv =
      "\uFEFF" +
      "tenThietBi,tenLoai,soSerial,model,hangSanXuat,tenViTri,maLo,trangThai,giaMua,ngayBatDauBaoHanh,ngayHetBaoHanh,moTa\n" +
      "Máy tiện CNC 01,CNC,CNC-SN-202601,VF-2SS,Haas Automation,Xưởng Lắp ráp,,DANG_HOAT_DONG,120000000,2026-01-01,2027-01-01,Máy tiện chính xác cao\n" +
      "Robot hàn tự động 01,CNC,RB-SN-202602,KR-CYBERTECH,KUKA,Dây chuyền CNC 01,,DANG_HOAT_DONG,350000000,2026-01-01,2028-01-01,Cánh tay robot hàn\n";

    const blob = new Blob([noiDungCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "mau-nhap-thiet-bi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function xemTruoc() {
    if (!tep) {
      datLoi("Vui lòng chọn file trước khi xem trước.");
      return;
    }
    datDangTai(true);
    datLoi("");
    datKetQua(null);
    datKetQuaThanhCong(null);

    try {
      const kq = await xemTruocNhapThietBi(tep);
      datKetQua(kq);
    } catch (e) {
      datLoi((e as LoiHttp).message || "Không thể đọc dữ liệu file xem trước.");
    } finally {
      datDangTai(false);
    }
  }

  async function xacNhan() {
    if (!tep || !ketQua) return;
    datDangImport(true);
    datLoi("");

    try {
      const kq = await nhapThietBi(tep);
      datKetQuaThanhCong(kq);
      datThongBao(`Nhập thiết bị thành công! Đã thêm ${kq.soDongDaImport || kq.danhSachDaTao?.length || 0} thiết bị vào hệ thống.`);
      datTep(null);
      datKetQua(null);
    } catch (e) {
      datLoi((e as LoiHttp).message || "Có lỗi xảy ra trong quá trình import thiết bị.");
    } finally {
      datDangImport(false);
    }
  }

  function lamMoi() {
    datTep(null);
    datKetQua(null);
    datKetQuaThanhCong(null);
    datLoi("");
    datThongBao("");
  }

  const tongSoDong =
    ketQua?.tongSoDong ??
    (ketQua?.danhSachDongHopLe?.length || 0) + (ketQua?.danhSachLoi?.length || 0);
  const soDongHopLe =
    ketQua?.soDongHopLe ?? ketQua?.danhSachDongHopLe?.length ?? 0;
  const soDongLoi = ketQua?.soDongLoi ?? ketQua?.danhSachLoi?.length ?? 0;

  return (
    <>
      <section className="thanh-cong-cu" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <a
            className="nut nut-chinh"
            href="/danh-sach-25-thiet-bi-nha-may.xlsx"
            download="danh-sach-25-thiet-bi-nha-may.xlsx"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            📊 Tải file Excel mẫu 25 thiết bị nhà máy (.xlsx)
          </a>
          <a
            className="nut nut-phu"
            href="/danh-sach-25-thiet-bi-nha-may.csv"
            download="danh-sach-25-thiet-bi-nha-may.csv"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            📄 Tải file CSV (.csv)
          </a>
          <button
            className="nut nut-phu"
            type="button"
            onClick={() => datDangMoHuongDan((mo) => !mo)}
          >
            {dangMoHuongDan ? "Ẩn hướng dẫn" : "📖 Hướng dẫn & Danh mục"}
          </button>
        </div>
        <Link className="nut nut-phu" href="/admin/thiet-bi">
          Danh sách thiết bị →
        </Link>
      </section>

      {thongBao && <div className="thong-bao thanh-cong">{thongBao}</div>}
      {loi && <div className="thong-bao loi">{loi}</div>}

      {/* Hộp hướng dẫn & tra cứu danh mục hệ thống */}
      {dangMoHuongDan && (
        <section className="the-noi-dung" style={{ marginBottom: "20px" }}>
          <div className="hop-huong-dan" style={{ margin: 0, border: "none" }}>
            <h3 style={{ margin: "0 0 12px", color: "#0f766e", fontSize: "16px" }}>
              📖 Hướng dẫn định dạng file Excel / CSV nhập thiết bị
            </h3>
            <p style={{ color: "#475569", fontSize: "13px", lineHeight: 1.5, margin: "0 0 14px" }}>
              File tải lên cần có dòng tiêu đề cột ở dòng đầu tiên. Có thể sử dụng tên loại, tên vị trí hoặc ID trực tiếp.
            </p>

            <div className="khung-bang" style={{ marginBottom: "16px" }}>
              <table>
                <thead>
                  <tr>
                    <th>Tên cột</th>
                    <th>Bắt buộc</th>
                    <th>Mô tả &amp; Định dạng</th>
                    <th>Ví dụ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>tenThietBi</strong></td>
                    <td><span className="the-dong-loi" style={{ background: "#fef2f2", color: "#b91c1c" }}>Bắt buộc</span></td>
                    <td>Tên của thiết bị máy móc</td>
                    <td>Máy tiện CNC 01</td>
                  </tr>
                  <tr>
                    <td><strong>tenLoai</strong> / <strong>loaiThietBiId</strong></td>
                    <td><span className="the-dong-loi" style={{ background: "#fef2f2", color: "#b91c1c" }}>Bắt buộc</span></td>
                    <td>Tên loại thiết bị hoặc ID loại</td>
                    <td>CNC (hoặc 18)</td>
                  </tr>
                  <tr>
                    <td><strong>soSerial</strong></td>
                    <td>Tùy chọn</td>
                    <td>Số serial thiết bị (duy nhất, không trùng lặp)</td>
                    <td>CNC-SN-202601</td>
                  </tr>
                  <tr>
                    <td><strong>model</strong></td>
                    <td>Tùy chọn</td>
                    <td>Mã kiểu dáng / model máy</td>
                    <td>VF-2SS</td>
                  </tr>
                  <tr>
                    <td><strong>hangSanXuat</strong></td>
                    <td>Tùy chọn</td>
                    <td>Hãng hoặc công ty sản xuất</td>
                    <td>Haas Automation</td>
                  </tr>
                  <tr>
                    <td><strong>tenViTri</strong> / <strong>viTriId</strong></td>
                    <td>Tùy chọn</td>
                    <td>Vị trí lắp đặt thiết bị</td>
                    <td>Xưởng Lắp ráp (hoặc 17)</td>
                  </tr>
                  <tr>
                    <td><strong>maLo</strong> / <strong>loNhapId</strong></td>
                    <td>Tùy chọn</td>
                    <td>Mã lô nhập hàng</td>
                    <td>LO-2026-001</td>
                  </tr>
                  <tr>
                    <td><strong>trangThai</strong></td>
                    <td>Tùy chọn</td>
                    <td>DANG_HOAT_DONG, DANG_BAO_TRI, DANG_HONG, NGUNG_HOAT_DONG, THANH_LY</td>
                    <td>DANG_HOAT_DONG</td>
                  </tr>
                  <tr>
                    <td><strong>giaMua</strong></td>
                    <td>Tùy chọn</td>
                    <td>Số tiền mua thiết bị (VNĐ)</td>
                    <td>120000000</td>
                  </tr>
                  <tr>
                    <td><strong>ngayBatDauBaoHanh</strong>, <strong>ngayHetBaoHanh</strong></td>
                    <td>Tùy chọn</td>
                    <td>Định dạng ngày YYYY-MM-DD</td>
                    <td>2026-01-01</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginTop: "14px" }}>
              <div>
                <strong style={{ fontSize: "13px", color: "#334155" }}>Danh sách Loại thiết bị hiện có:</strong>
                <div className="danh-sach-chip">
                  {danhSachLoai.length > 0 ? (
                    danhSachLoai.map((l) => (
                      <span key={l.id} className="chip-danh-muc" title={`ID: ${l.id}`}>
                        {l.tenLoai}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Chưa có loại thiết bị</span>
                  )}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: "13px", color: "#334155" }}>Danh sách Vị trí hiện có:</strong>
                <div className="danh-sach-chip">
                  {danhSachViTri.length > 0 ? (
                    danhSachViTri.map((v) => (
                      <span key={v.id} className="chip-danh-muc" title={`ID: ${v.id}`}>
                        {v.tenViTri}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Chưa có vị trí</span>
                  )}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: "13px", color: "#334155" }}>Danh sách Lô nhập hiện có:</strong>
                <div className="danh-sach-chip">
                  {danhSachLoNhap.length > 0 ? (
                    danhSachLoNhap.map((ln) => (
                      <span key={ln.id} className="chip-danh-muc" title={`ID: ${ln.id}`}>
                        {ln.maLo}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Chưa có lô nhập</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Kết quả import thành công */}
      {ketQuaThanhCong && (
        <section className="the-noi-dung" style={{ marginBottom: "20px" }}>
          <div className="khung-thanh-cong-import">
            <div style={{ fontSize: "42px", color: "#16a34a", marginBottom: "8px" }}>✓</div>
            <h3>Nhập thiết bị thành công!</h3>
            <p>
              Đã tạo thành công{" "}
              <strong>{ketQuaThanhCong.soDongDaImport || ketQuaThanhCong.danhSachDaTao?.length || 0}</strong> thiết bị
              mới trong hệ thống.
            </p>

            {ketQuaThanhCong.danhSachDaTao && ketQuaThanhCong.danhSachDaTao.length > 0 && (
              <>
                <strong style={{ display: "block", marginBottom: "8px", color: "#166534", fontSize: "13px" }}>
                  Mã thiết bị &amp; Mã QR vừa được tạo:
                </strong>
                <div className="danh-sach-ma-tao">
                  {ketQuaThanhCong.danhSachDaTao.map((item) => (
                    <span key={item.id} className="the-ma-thiet-bi-tao">
                      <span>🏷️ {item.maThietBi}</span>
                      <span style={{ color: "#0d9488", fontSize: "11px" }}>({item.maQr})</span>
                    </span>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              <Link className="nut nut-chinh" href="/admin/thiet-bi">
                Xem danh sách thiết bị
              </Link>
              <button className="nut nut-phu" onClick={lamMoi}>
                Nhập file khác
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Khung tải lên file */}
      {!ketQuaThanhCong && (
        <section className="the-noi-dung">
          <div className="noi-dung-chi-tiet khung-tai-tep-import">
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: "18px" }}>Tải lên file dữ liệu thiết bị</h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                Hỗ trợ định dạng <strong>.xlsx</strong> hoặc <strong>.csv</strong> (dung lượng tối đa 5MB).
              </p>
            </div>

            <div
              className={`khung-keo-tha ${dangKeo ? "dang-keo" : ""}`}
              onDragOver={xuLyDragOver}
              onDragLeave={xuLyDragLeave}
              onDrop={xuLyKeoTha}
              onClick={() => document.getElementById("tep-nhap-thiet-bi")?.click()}
            >
              <input
                id="tep-nhap-thiet-bi"
                type="file"
                accept=".xlsx,.csv"
                style={{ display: "none" }}
                onChange={chonTepTuInput}
                disabled={dangTai || dangImport}
              />
              <div className="bieu-tuong-tai-tep">📁</div>
              <div className="tieu-de-tai-tep">
                Kéo thả file Excel / CSV vào đây, hoặc <span style={{ color: "#0f766e", textDecoration: "underline" }}>chọn file từ máy</span>
              </div>
              <div className="chu-thich-tai-tep">Hỗ trợ các file định dạng .xlsx, .csv</div>
            </div>

            {tep && (
              <div className="thong-tin-tep-chon">
                <div className="chi-tiet-tep-chon">
                  <span className="bieu-tuong-tep">📄</span>
                  <div>
                    <span className="ten-tep-chinh">{tep.name}</span>
                    <span className="dung-luong-tep">({dinhDangDungLuong(tep.size)})</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="nut-dong"
                  onClick={(e) => {
                    e.stopPropagation();
                    xuLyChonTep(null);
                  }}
                  title="Xóa file đã chọn"
                  aria-label="Xóa file"
                >
                  ×
                </button>
              </div>
            )}

            <footer className="chan-chi-tiet" style={{ marginTop: "10px" }}>
              <button
                type="button"
                className="nut nut-chinh"
                onClick={xemTruoc}
                disabled={!tep || dangTai || dangImport}
              >
                {dangTai ? "Đang đọc dữ liệu..." : "🔍 Xem trước dữ liệu"}
              </button>
            </footer>
          </div>

          {/* Khung kết quả xem trước Preview */}
          {ketQua && (
            <div className="noi-dung-chi-tiet" style={{ borderTop: "1px solid #e2e8f0", background: "#fcfdfd" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "16px", color: "#1e293b" }}>
                Kết quả kiểm tra dữ liệu file
              </h3>

              <div className="luoi-thong-ke-import">
                <div className="the-thong-ke tong">
                  <span className="nhan-thong-ke">Tổng số dòng</span>
                  <span className="so-thong-ke">{tongSoDong}</span>
                </div>
                <div className="the-thong-ke hop-le">
                  <span className="nhan-thong-ke">Dòng hợp lệ</span>
                  <span className="so-thong-ke" style={{ color: "#16a34a" }}>
                    {soDongHopLe}
                  </span>
                </div>
                <div className="the-thong-ke loi">
                  <span className="nhan-thong-ke">Dòng có lỗi</span>
                  <span className="so-thong-ke" style={{ color: soDongLoi > 0 ? "#dc2626" : "#64748b" }}>
                    {soDongLoi}
                  </span>
                </div>
              </div>

              {/* Danh sách lỗi nếu có */}
              {ketQua.danhSachLoi && ketQua.danhSachLoi.length > 0 && (
                <div>
                  <strong style={{ color: "#9f1239", fontSize: "13px" }}>
                    ⚠️ Phát hiện {ketQua.danhSachLoi.length} lỗi trong file. Vui lòng sửa lại trước khi xác nhận:
                  </strong>
                  <div className="danh-sach-loi-import">
                    {ketQua.danhSachLoi.map((loiItem, index) => (
                      <div className="muc-loi-import" key={`${loiItem.dong}-${loiItem.cot || ""}-${index}`}>
                        <span className="the-dong-loi">Dòng {loiItem.dong}</span>
                        {loiItem.cot && (
                          <span style={{ fontWeight: 600, color: "#881337" }}>[{loiItem.cot}]:</span>
                        )}
                        <span>{loiItem.thongBao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bảng xem trước các dòng hợp lệ */}
              {ketQua.danhSachDongHopLe && ketQua.danhSachDongHopLe.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ color: "#166534", fontSize: "13px" }}>
                      ✓ Danh sách dòng dữ liệu hợp lệ ({ketQua.danhSachDongHopLe.length} thiết bị):
                    </strong>
                  </div>

                  <div className="khung-bang khung-bang-xem-truoc">
                    <table>
                      <thead>
                        <tr>
                          <th>Dòng</th>
                          <th>Tên thiết bị</th>
                          <th>Loại thiết bị</th>
                          <th>Số Serial</th>
                          <th>Model</th>
                          <th>Hãng SX</th>
                          <th>Vị trí</th>
                          <th>Giá mua</th>
                          <th>Bảo hành</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ketQua.danhSachDongHopLe.map((item, idx) => {
                          const d = item.duLieu;
                          const tenLoaiHienThi =
                            d.loaiThietBi?.tenLoai ||
                            danhSachLoai.find((l) => l.id === d.loaiThietBiId)?.tenLoai ||
                            d.loaiThietBiId ||
                            "—";
                          const tenViTriHienThi =
                            d.viTri?.tenViTri ||
                            danhSachViTri.find((v) => v.id === d.viTriId)?.tenViTri ||
                            "—";
                          const trangThaiStr = String(d.trangThai || "DANG_HOAT_DONG");
                          const nhanTrangThai =
                            NHAN_TRANG_THAI_THIET_BI[trangThaiStr as keyof typeof NHAN_TRANG_THAI_THIET_BI] ||
                            trangThaiStr;

                          return (
                            <tr key={idx}>
                              <td>
                                <span className="the-dong-loi" style={{ background: "#ecfdf5", color: "#065f46" }}>
                                  #{item.dong}
                                </span>
                              </td>
                              <td><strong>{d.tenThietBi}</strong></td>
                              <td>{String(tenLoaiHienThi)}</td>
                              <td>{d.soSerial ? <code>{d.soSerial}</code> : "—"}</td>
                              <td>{d.model || "—"}</td>
                              <td>{d.hangSanXuat || "—"}</td>
                              <td>{String(tenViTriHienThi)}</td>
                              <td>{dinhDangTien(d.giaMua)}</td>
                              <td>
                                {d.ngayBatDauBaoHanh || d.ngayHetBaoHanh
                                  ? `${d.ngayBatDauBaoHanh || "?"} → ${d.ngayHetBaoHanh || "?"}`
                                  : "—"}
                              </td>
                              <td>
                                <span className="huy-hieu">{nhanTrangThai}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <footer className="chan-chi-tiet" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="nut nut-chinh"
                  onClick={xacNhan}
                  disabled={dangImport || !soDongHopLe || soDongLoi > 0}
                  style={{ minWidth: "180px" }}
                >
                  {dangImport ? (
                    <>
                      <span className="vong-xoay" style={{ marginRight: "6px" }} />
                      Đang nhập thiết bị...
                    </>
                  ) : (
                    `✓ Xác nhận nhập ${soDongHopLe} thiết bị`
                  )}
                </button>
              </footer>
            </div>
          )}
        </section>
      )}
    </>
  );
}
