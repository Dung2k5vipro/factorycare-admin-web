"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  capNhatBaoHanhThietBi,
  layBaoHanhThietBi,
  layDanhSachLoaiThietBi,
  layDanhSachThietBi,
} from "@/services/thietBi.service";
import type { LoiHttp } from "@/types/api";
import type { LoaiThietBi, ThietBi } from "@/types/thietBi";

type LocTrangThaiBaoHanh = "" | "CON_HAN" | "SAP_HET_HAN" | "HET_HAN" | "CHUA_CO";

function dinhDangNgay(ngay?: string | null) {
  if (!ngay) return "—";
  try {
    const d = new Date(ngay);
    return new Intl.DateTimeFormat("vi-VN").format(d);
  } catch {
    return ngay;
  }
}

function tinhSoNgayConLai(ngayHet?: string | null) {
  if (!ngayHet) return null;
  const homNay = new Date();
  homNay.setHours(0, 0, 0, 0);
  const ngayHetHan = new Date(ngayHet);
  ngayHetHan.setHours(0, 0, 0, 0);
  const diffTime = ngayHetHan.getTime() - homNay.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function TrangBaoHanh() {
  const [danhSach, datDanhSach] = useState<ThietBi[]>([]);
  const [danhSachLoai, datDanhSachLoai] = useState<LoaiThietBi[]>([]);
  const [dangTai, datDangTai] = useState(true);
  const [loiTai, datLoiTai] = useState("");

  // Bộ lọc
  const [tuKhoa, datTuKhoa] = useState("");
  const [loaiDangChon, datLoaiDangChon] = useState("");
  const [trangThaiBaoHanh, datTrangThaiBaoHanh] = useState<LocTrangThaiBaoHanh>("");
  const [trangHienTai, datTrangHienTai] = useState(1);
  const soBanGhiMoiTrang = 10;

  // Modal cập nhật bảo hành
  const [dangMoModal, datDangMoModal] = useState(false);
  const [thietBiSua, datThietBiSua] = useState<ThietBi | null>(null);
  const [ngayBatDau, datNgayBatDau] = useState("");
  const [ngayHet, datNgayHet] = useState("");
  const [dangLuu, datDangLuu] = useState(false);
  const [loiForm, datLoiForm] = useState("");
  const [thongBao, datThongBao] = useState("");

  function taiDuLieu() {
    datDangTai(true);
    datLoiTai("");
    layDanhSachThietBi({ trang: 1, gioiHan: 100 })
      .then((kq) => {
        datDanhSach(kq.danhSach);
      })
      .catch((e: LoiHttp) => datLoiTai(e.message || "Không thể tải danh sách thiết bị."))
      .finally(() => datDangTai(false));
  }

  useEffect(() => {
    taiDuLieu();
    void layDanhSachLoaiThietBi({ trang: 1, gioiHan: 100 })
      .then((kq) => datDanhSachLoai(kq.danhSach))
      .catch(() => undefined);
  }, []);

  // Tính toán trạng thái bảo hành từng máy
  const danhSachCoBaoHanh = useMemo(() => {
    return danhSach.map((item) => {
      const soNgay = tinhSoNgayConLai(item.ngayHetBaoHanh);
      let loaiTrangThai: LocTrangThaiBaoHanh = "CHUA_CO";
      let nhanTrangThai = "Chưa thiết lập";
      let cssClass = "huy-hieu-chua-co";

      if (soNgay !== null) {
        if (soNgay < 0) {
          loaiTrangThai = "HET_HAN";
          nhanTrangThai = `Hết hạn (Quá ${Math.abs(soNgay)} ngày)`;
          cssClass = "huy-hieu-het-han";
        } else if (soNgay <= 30) {
          loaiTrangThai = "SAP_HET_HAN";
          nhanTrangThai = `Sắp hết hạn (Còn ${soNgay} ngày)`;
          cssClass = "huy-hieu-sap-het";
        } else {
          loaiTrangThai = "CON_HAN";
          nhanTrangThai = `Còn bảo hành (${soNgay} ngày)`;
          cssClass = "huy-hieu-con-han";
        }
      }

      return {
        ...item,
        soNgayConLai: soNgay,
        loaiTrangThaiBaoHanh: loaiTrangThai,
        nhanTrangThaiBaoHanh: nhanTrangThai,
        cssClassBaoHanh: cssClass,
      };
    });
  }, [danhSach]);

  // Thống kê KPI
  const tongSo = danhSachCoBaoHanh.length;
  const soConHan = danhSachCoBaoHanh.filter((x) => x.loaiTrangThaiBaoHanh === "CON_HAN").length;
  const soSapHet = danhSachCoBaoHanh.filter((x) => x.loaiTrangThaiBaoHanh === "SAP_HET_HAN").length;
  const soHetHan = danhSachCoBaoHanh.filter((x) => x.loaiTrangThaiBaoHanh === "HET_HAN" || x.loaiTrangThaiBaoHanh === "CHUA_CO").length;

  // Lọc dữ liệu
  const danhSachLoc = useMemo(() => {
    return danhSachCoBaoHanh.filter((item) => {
      if (tuKhoa.trim()) {
        const tu = tuKhoa.toLowerCase();
        const khopTen = item.tenThietBi.toLowerCase().includes(tu);
        const khopMa = item.maThietBi.toLowerCase().includes(tu);
        const khopSerial = item.soSerial?.toLowerCase().includes(tu);
        const khopModel = item.model?.toLowerCase().includes(tu);
        if (!khopTen && !khopMa && !khopSerial && !khopModel) return false;
      }
      if (loaiDangChon) {
        if (item.loaiThietBiId !== Number(loaiDangChon) && item.loaiThietBi?.id !== Number(loaiDangChon)) {
          return false;
        }
      }
      if (trangThaiBaoHanh) {
        if (item.loaiTrangThaiBaoHanh !== trangThaiBaoHanh) return false;
      }
      return true;
    });
  }, [danhSachCoBaoHanh, tuKhoa, loaiDangChon, trangThaiBaoHanh]);

  const tongTrang = Math.ceil(danhSachLoc.length / soBanGhiMoiTrang) || 1;
  const danhSachHienThi = danhSachLoc.slice(
    (trangHienTai - 1) * soBanGhiMoiTrang,
    trangHienTai * soBanGhiMoiTrang
  );

  async function moModalCapNhat(tb: ThietBi) {
    datThietBiSua(tb);
    datLoiForm("");
    setBatDauVaHet(tb.ngayBatDauBaoHanh, tb.ngayHetBaoHanh);
    datDangMoModal(true);

    try {
      const kq = await layBaoHanhThietBi(tb.id);
      setBatDauVaHet(kq.ngayBatDauBaoHanh, kq.ngayHetBaoHanh);
    } catch {
      // Dùng dữ liệu hiện tại
    }
  }

  function setBatDauVaHet(batDau?: string | null, het?: string | null) {
    datNgayBatDau(batDau ? batDau.slice(0, 10) : "");
    datNgayHet(het ? het.slice(0, 10) : "");
  }

  function congThemNam(soNam: number) {
    const ngayGoc = ngayBatDau ? new Date(ngayBatDau) : new Date();
    const ngayMoi = new Date(ngayGoc);
    ngayMoi.setFullYear(ngayMoi.getFullYear() + soNam);
    if (!ngayBatDau) {
      datNgayBatDau(ngayGoc.toISOString().slice(0, 10));
    }
    datNgayHet(ngayMoi.toISOString().slice(0, 10));
  }

  async function xuLyLuu(suKien: FormEvent) {
    suKien.preventDefault();
    if (!thietBiSua) return;
    if (!ngayBatDau || !ngayHet) {
      datLoiForm("Vui lòng nhập đầy đủ ngày bắt đầu và ngày hết hạn bảo hành.");
      return;
    }
    if (ngayHet < ngayBatDau) {
      datLoiForm("Ngày hết hạn bảo hành phải sau hoặc bằng ngày bắt đầu.");
      return;
    }

    datDangLuu(true);
    datLoiForm("");

    try {
      await capNhatBaoHanhThietBi(thietBiSua.id, ngayBatDau, ngayHet);
      datThongBao(`Cập nhật bảo hành cho thiết bị "${thietBiSua.tenThietBi}" thành công.`);
      datDangMoModal(false);
      taiDuLieu();
      window.setTimeout(() => datThongBao(""), 4000);
    } catch (e) {
      datLoiForm((e as LoiHttp).message || "Không thể cập nhật bảo hành.");
    } finally {
      datDangLuu(false);
    }
  }

  function xoaBoLoc() {
    datTuKhoa("");
    datLoaiDangChon("");
    datTrangThaiBaoHanh("");
    datTrangHienTai(1);
  }

  return (
    <>
      {/* Thống kê KPI Bảo hành */}
      <section className="luoi-kpi-bao-hanh">
        <div className="the-kpi-bao-hanh tong-so">
          <span className="tieu-de-kpi">Tổng số thiết bị</span>
          <span className="so-kpi">{tongSo}</span>
          <span className="mo-ta-kpi">Thiết bị quản lý trong hệ thống</span>
        </div>
        <div
          className="the-kpi-bao-hanh con-han"
          style={{ cursor: "pointer" }}
          onClick={() => {
            datTrangThaiBaoHanh("CON_HAN");
            datTrangHienTai(1);
          }}
          title="Bấm để lọc thiết bị còn bảo hành"
        >
          <span className="tieu-de-kpi">Còn bảo hành</span>
          <span className="so-kpi" style={{ color: "#16a34a" }}>
            {soConHan}
          </span>
          <span className="mo-ta-kpi">Hạn bảo hành hợp lệ (&gt; 30 ngày)</span>
        </div>
        <div
          className="the-kpi-bao-hanh sap-het"
          style={{ cursor: "pointer" }}
          onClick={() => {
            datTrangThaiBaoHanh("SAP_HET_HAN");
            datTrangHienTai(1);
          }}
          title="Bấm để lọc thiết bị sắp hết hạn"
        >
          <span className="tieu-de-kpi">Sắp hết hạn</span>
          <span className="so-kpi" style={{ color: "#d97706" }}>
            {soSapHet}
          </span>
          <span className="mo-ta-kpi">Hết hạn trong vòng 30 ngày tới</span>
        </div>
        <div
          className="the-kpi-bao-hanh het-han"
          style={{ cursor: "pointer" }}
          onClick={() => {
            datTrangThaiBaoHanh("HET_HAN");
            datTrangHienTai(1);
          }}
          title="Bấm để lọc thiết bị hết hạn"
        >
          <span className="tieu-de-kpi">Hết hạn / Chưa có</span>
          <span className="so-kpi" style={{ color: "#dc2626" }}>
            {soHetHan}
          </span>
          <span className="mo-ta-kpi">Cần liên hệ hãng gia hạn bảo hành</span>
        </div>
      </section>

      {thongBao && <div className="thong-bao thanh-cong">{thongBao}</div>}

      <section className="the-noi-dung">
        {/* Bộ lọc */}
        <div className="bo-loc" style={{ gridTemplateColumns: "minmax(260px, 1fr) 190px 200px auto" }}>
          <div className="o-tim-kiem">
            <span>⌕</span>
            <input
              value={tuKhoa}
              onChange={(e) => {
                datTrangHienTai(1);
                datTuKhoa(e.target.value);
              }}
              placeholder="Tìm theo tên máy, mã TB, serial, model..."
              aria-label="Tìm kiếm thiết bị"
            />
          </div>

          <select
            value={loaiDangChon}
            onChange={(e) => {
              datTrangHienTai(1);
              datLoaiDangChon(e.target.value);
            }}
            aria-label="Lọc theo loại"
          >
            <option value="">Tất cả loại</option>
            {danhSachLoai.map((loai) => (
              <option key={loai.id} value={loai.id}>
                {loai.tenLoai}
              </option>
            ))}
          </select>

          <select
            value={trangThaiBaoHanh}
            onChange={(e) => {
              datTrangHienTai(1);
              datTrangThaiBaoHanh(e.target.value as LocTrangThaiBaoHanh);
            }}
            aria-label="Lọc trạng thái bảo hành"
          >
            <option value="">Tất cả trạng thái bảo hành</option>
            <option value="CON_HAN">🟢 Còn bảo hành</option>
            <option value="SAP_HET_HAN">🟡 Sắp hết hạn (≤ 30 ngày)</option>
            <option value="HET_HAN">🔴 Đã hết hạn</option>
            <option value="CHUA_CO">⚪ Chưa thiết lập bảo hành</option>
          </select>

          <button
            className="nut nut-phu"
            onClick={xoaBoLoc}
            disabled={!tuKhoa && !loaiDangChon && !trangThaiBaoHanh}
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Bảng dữ liệu */}
        {dangTai ? (
          <div className="trang-thai-du-lieu">
            <span className="vong-xoay" /> Đang tải danh sách bảo hành...
          </div>
        ) : loiTai ? (
          <div className="trang-thai-du-lieu">
            <p className="tieu-de-loi">{loiTai}</p>
            <button className="nut nut-phu" onClick={taiDuLieu}>
              Thử lại
            </button>
          </div>
        ) : danhSachLoc.length === 0 ? (
          <div className="trang-thai-du-lieu">
            <p>Không tìm thấy thiết bị nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          <div className="khung-bang">
            <table>
              <thead>
                <tr>
                  <th>Mã thiết bị</th>
                  <th>Tên thiết bị</th>
                  <th>Loại</th>
                  <th>Vị trí</th>
                  <th>Bắt đầu</th>
                  <th>Hết hạn</th>
                  <th>Thời hạn bảo hành</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {danhSachHienThi.map((tb) => (
                  <tr key={tb.id}>
                    <td>
                      <strong>{tb.maThietBi}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{tb.tenThietBi}</strong>
                        {tb.soSerial && (
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            Serial: <code>{tb.soSerial}</code>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{tb.loaiThietBi?.tenLoai || "—"}</td>
                    <td>{tb.viTri?.tenViTri || "—"}</td>
                    <td>{dinhDangNgay(tb.ngayBatDauBaoHanh)}</td>
                    <td>
                      <strong>{dinhDangNgay(tb.ngayHetBaoHanh)}</strong>
                    </td>
                    <td>
                      <span className={`huy-hieu ${tb.cssClassBaoHanh}`}>
                        {tb.nhanTrangThaiBaoHanh}
                      </span>
                    </td>
                    <td>
                      <button
                        className="nut nut-phu"
                        style={{ padding: "4px 12px", minHeight: "32px", fontSize: "12px" }}
                        onClick={() => void moModalCapNhat(tb)}
                      >
                        Gia hạn / Cập nhật
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang */}
        {!dangTai && !loiTai && tongTrang > 1 && (
          <footer className="phan-trang">
            <span>
              Trang {trangHienTai} / {tongTrang} ({danhSachLoc.length} thiết bị)
            </span>
            <div>
              <button
                className="nut-trang"
                disabled={trangHienTai <= 1}
                onClick={() => datTrangHienTai((cu) => cu - 1)}
              >
                ‹
              </button>
              <button className="nut-trang dang-chon">{trangHienTai}</button>
              <button
                className="nut-trang"
                disabled={trangHienTai >= tongTrang}
                onClick={() => datTrangHienTai((cu) => cu + 1)}
              >
                ›
              </button>
            </div>
          </footer>
        )}
      </section>

      {/* Modal Cập nhật / Gia hạn bảo hành */}
      {dangMoModal && thietBiSua && (
        <div className="lop-phu">
          <section className="hop-thoai" style={{ width: "min(560px, 100%)" }}>
            <header className="dau-hop-thoai">
              <h2>Gia hạn &amp; Cập nhật bảo hành</h2>
              <button className="nut-dong" onClick={() => datDangMoModal(false)}>
                ×
              </button>
            </header>

            <form className="bieu-mau bieu-mau-them" onSubmit={xuLyLuu}>
              {loiForm && <div className="thong-bao loi">{loiForm}</div>}

              <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f766e" }}>
                  {thietBiSua.tenThietBi}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  Mã TB: <strong>{thietBiSua.maThietBi}</strong> | Serial: <code>{thietBiSua.soSerial || "—"}</code> | Vị trí: {thietBiSua.viTri?.tenViTri || "—"}
                </div>
              </div>

              <div className="luoi-hai-cot">
                <div className="nhom-truong">
                  <label>
                    Ngày bắt đầu bảo hành <em>*</em>
                  </label>
                  <input
                    type="date"
                    value={ngayBatDau}
                    onChange={(e) => {
                      datNgayBatDau(e.target.value);
                      datLoiForm("");
                    }}
                  />
                </div>

                <div className="nhom-truong">
                  <label>
                    Ngày hết hạn bảo hành <em>*</em>
                  </label>
                  <input
                    type="date"
                    value={ngayHet}
                    onChange={(e) => {
                      datNgayHet(e.target.value);
                      datLoiForm("");
                    }}
                  />
                </div>
              </div>

              {/* Phím tắt gia hạn nhanh */}
              <div style={{ marginTop: "10px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", marginRight: "8px" }}>Gia hạn nhanh:</span>
                <div style={{ display: "inline-flex", gap: "6px" }}>
                  <button
                    type="button"
                    className="nut nut-phu"
                    style={{ minHeight: "28px", padding: "0 8px", fontSize: "11px" }}
                    onClick={() => congThemNam(1)}
                  >
                    + 1 Năm
                  </button>
                  <button
                    type="button"
                    className="nut nut-phu"
                    style={{ minHeight: "28px", padding: "0 8px", fontSize: "11px" }}
                    onClick={() => congThemNam(2)}
                  >
                    + 2 Năm
                  </button>
                  <button
                    type="button"
                    className="nut nut-phu"
                    style={{ minHeight: "28px", padding: "0 8px", fontSize: "11px" }}
                    onClick={() => congThemNam(3)}
                  >
                    + 3 Năm
                  </button>
                </div>
              </div>

              {ngayHet && (
                <div style={{ marginTop: "12px", fontSize: "13px", padding: "8px 12px", borderRadius: "6px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534" }}>
                  {ngayHet >= new Date().toISOString().slice(0, 10) ? (
                    <span>✓ Hạn bảo hành mới hợp lệ đến ngày <strong>{dinhDangNgay(ngayHet)}</strong></span>
                  ) : (
                    <span style={{ color: "#b91c1c" }}>⚠️ Ngày hết hạn này đã nằm trong quá khứ</span>
                  )}
                </div>
              )}

              <footer className="chan-hop-thoai">
                <button
                  type="button"
                  className="nut nut-phu"
                  onClick={() => datDangMoModal(false)}
                  disabled={dangLuu}
                >
                  Hủy
                </button>
                <button className="nut nut-chinh" disabled={dangLuu}>
                  {dangLuu ? "Đang lưu..." : "Lưu bảo hành"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
