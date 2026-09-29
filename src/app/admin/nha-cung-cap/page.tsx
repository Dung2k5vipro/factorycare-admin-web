"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { FormEvent, useEffect, useState } from "react";
import {
  capNhatNhaCungCap,
  layDanhSachNhaCungCap,
  themNhaCungCap,
} from "@/services/nhaCungCap.service";
import type { DuLieuNhaCungCap, NhaCungCap } from "@/types/quanLyThietBi";
import { LoiHttp } from "@/types/api";
import {
  kiemTraEmailKhongBatBuoc,
  kiemTraSoDienThoai,
} from "@/utils/kiemTraQuanLyThietBi";
const SO_BAN_GHI_MOI_TRANG = 10;
const DU_LIEU_BAN_DAU: DuLieuNhaCungCap = {
  tenNhaCungCap: "",
  nguoiLienHe: "",
  soDienThoai: "",
  email: "",
  diaChi: "",
  ghiChu: "",
};
export default function TrangNhaCungCap() {
  const [danhSach, datDanhSach] = useState<NhaCungCap[]>([]);
  const [tuKhoaNhap, datTuKhoaNhap] = useState("");
  const [tuKhoa, datTuKhoa] = useState("");
  const [trang, datTrang] = useState(1);
  const [tongTrang, datTongTrang] = useState(0);
  const [dangTai, datDangTai] = useState(true);
  const [loi, datLoi] = useState("");
  const [dangMo, datDangMo] = useState(false);
  const [dangSua, datDangSua] = useState<NhaCungCap | null>(null);
  const [duLieu, datDuLieu] = useState(DU_LIEU_BAN_DAU);
  const [loiForm, datLoiForm] = useState<Record<string, string>>({});
  const [dangXuLy, datDangXuLy] = useState(false);
  const [thongBao, datThongBao] = useState("");
  function taiDanhSach() {
    datDangTai(true);
    datLoi("");
    layDanhSachNhaCungCap({
      trang,
      gioiHan: SO_BAN_GHI_MOI_TRANG,
      tuKhoa: tuKhoa || undefined,
    })
      .then((kq) => {
        datDanhSach(kq.danhSach);
        datTongTrang(kq.phanTrang.tongTrang);
      })
      .catch((e: LoiHttp) => datLoi(e.message))
      .finally(() => datDangTai(false));
  }
  useEffect(() => {
    taiDanhSach();
  }, [trang, tuKhoa]);
  useEffect(() => {
    const boDem = window.setTimeout(() => {
      const giaTri = tuKhoaNhap.trim();
      if (giaTri !== tuKhoa) {
        datTrang(1);
        datTuKhoa(giaTri);
      }
    }, 350);
    return () => window.clearTimeout(boDem);
  }, [tuKhoaNhap, tuKhoa]);
  function moForm(nhaCungCap?: NhaCungCap) {
    datDangSua(nhaCungCap || null);
    datDuLieu(
      nhaCungCap
        ? {
            tenNhaCungCap: nhaCungCap.tenNhaCungCap,
            nguoiLienHe: nhaCungCap.nguoiLienHe || "",
            soDienThoai: nhaCungCap.soDienThoai || "",
            email: nhaCungCap.email || "",
            diaChi: nhaCungCap.diaChi || "",
            ghiChu: nhaCungCap.ghiChu || "",
          }
        : DU_LIEU_BAN_DAU,
    );
    datLoiForm({});
    datDangMo(true);
  }
  function capNhat(tenTruong: keyof DuLieuNhaCungCap, giaTri: string) {
    datDuLieu((cu) => ({ ...cu, [tenTruong]: giaTri }));
    datLoiForm((cu) => ({ ...cu, [tenTruong]: "", chung: "" }));
  }
  function kiemTra() {
    const loiMoi: Record<string, string> = {};
    if (!duLieu.tenNhaCungCap.trim())
      loiMoi.tenNhaCungCap = "Tên nhà cung cấp không được để trống.";
    const loiSo = kiemTraSoDienThoai(duLieu.soDienThoai || "");
    if (loiSo) loiMoi.soDienThoai = loiSo;
    const loiEmail = kiemTraEmailKhongBatBuoc(duLieu.email || "");
    if (loiEmail) loiMoi.email = loiEmail;
    datLoiForm(loiMoi);
    return !Object.keys(loiMoi).length;
  }
  async function luu(suKien: FormEvent) {
    suKien.preventDefault();
    if (!kiemTra()) return;
    datDangXuLy(true);
    try {
      const duLieuGui = {
        ...duLieu,
        tenNhaCungCap: duLieu.tenNhaCungCap.trim(),
        nguoiLienHe: duLieu.nguoiLienHe?.trim(),
        soDienThoai: duLieu.soDienThoai?.trim(),
        email: duLieu.email?.trim(),
        diaChi: duLieu.diaChi?.trim(),
        ghiChu: duLieu.ghiChu?.trim(),
      };
      if (dangSua) await capNhatNhaCungCap(dangSua.id, duLieuGui);
      else await themNhaCungCap(duLieuGui);
      datDangMo(false);
      datThongBao(
        dangSua
          ? "Cập nhật nhà cung cấp thành công."
          : "Thêm nhà cung cấp thành công.",
      );
      taiDanhSach();
    } catch (e) {
      const loiHttp = e as LoiHttp;
      datLoiForm({ chung: loiHttp.message });
    } finally {
      datDangXuLy(false);
    }
  }
  return (
    <>
      <section className="thanh-cong-cu">
        <button className="nut nut-chinh" onClick={() => moForm()}>
          Thêm nhà cung cấp
        </button>
      </section>
      {thongBao && <div className="thong-bao thanh-cong">{thongBao}</div>}
      <section className="the-noi-dung">
        <div className="bo-loc">
          <div className="o-tim-kiem">
            <span>⌕</span>
            <input
              value={tuKhoaNhap}
              onChange={(e) => datTuKhoaNhap(e.target.value)}
              placeholder="Tìm kiếm"
              aria-label="Tìm kiếm nhà cung cấp"
            />
          </div>
        </div>
        {dangTai ? (
          <div className="trang-thai-du-lieu">
            <span className="vong-xoay" /> Đang tải...
          </div>
        ) : loi ? (
          <div className="trang-thai-du-lieu">
            <p className="tieu-de-loi">{loi}</p>
            <button className="nut nut-phu" onClick={taiDanhSach}>
              Thử lại
            </button>
          </div>
        ) : danhSach.length === 0 ? (
          <div className="trang-thai-du-lieu">
            <p>
              {tuKhoa
                ? "Không tìm thấy nhà cung cấp phù hợp."
                : "Chưa có nhà cung cấp."}
            </p>
          </div>
        ) : (
          <div className="khung-bang">
            <table>
              <thead>
                <tr>
                  <th>Tên nhà cung cấp</th>
                  <th>Người liên hệ</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {danhSach.map((nhaCungCap) => (
                  <tr key={nhaCungCap.id}>
                    <td>
                      <strong>{nhaCungCap.tenNhaCungCap}</strong>
                    </td>
                    <td>{nhaCungCap.nguoiLienHe || "—"}</td>
                    <td>{nhaCungCap.soDienThoai || "—"}</td>
                    <td>{nhaCungCap.email || "—"}</td>
                    <td>
                      <button
                        className="nut nut-phu"
                        onClick={() => moForm(nhaCungCap)}
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!dangTai && !loi && tongTrang > 0 && (
          <footer className="phan-trang">
            <span>
              Trang {trang} / {tongTrang}
            </span>
            <div>
              <button
                className="nut-trang"
                disabled={trang <= 1}
                onClick={() => datTrang((cu) => cu - 1)}
              >
                ‹
              </button>
              <button className="nut-trang dang-chon">{trang}</button>
              <button
                className="nut-trang"
                disabled={trang >= tongTrang}
                onClick={() => datTrang((cu) => cu + 1)}
              >
                ›
              </button>
            </div>
          </footer>
        )}
      </section>
      {dangMo && (
        <div className="lop-phu">
          <section className="hop-thoai">
            <header className="dau-hop-thoai">
              <h2>{dangSua ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}</h2>
              <button className="nut-dong" onClick={() => datDangMo(false)}>
                ×
              </button>
            </header>
            <form className="bieu-mau bieu-mau-them" onSubmit={luu}>
              {loiForm.chung && (
                <div className="thong-bao loi">{loiForm.chung}</div>
              )}
              <div className="luoi-hai-cot">
                <div className="nhom-truong">
                  <label>
                    Tên nhà cung cấp <em>*</em>
                  </label>
                  <input
                    value={duLieu.tenNhaCungCap}
                    onChange={(e) => capNhat("tenNhaCungCap", e.target.value)}
                  />
                  {loiForm.tenNhaCungCap && (
                    <span className="loi-truong">{loiForm.tenNhaCungCap}</span>
                  )}
                </div>
                <div className="nhom-truong">
                  <label>Người liên hệ</label>
                  <input
                    value={duLieu.nguoiLienHe || ""}
                    onChange={(e) => capNhat("nguoiLienHe", e.target.value)}
                  />
                </div>
                <div className="nhom-truong">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    value={duLieu.soDienThoai || ""}
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      capNhat("soDienThoai", e.target.value.replace(/\D/g, ""))
                    }
                  />
                  {loiForm.soDienThoai && (
                    <span className="loi-truong">{loiForm.soDienThoai}</span>
                  )}
                </div>
                <div className="nhom-truong">
                  <label>Email</label>
                  <input
                    type="email"
                    value={duLieu.email || ""}
                    onChange={(e) => capNhat("email", e.target.value)}
                  />
                  {loiForm.email && (
                    <span className="loi-truong">{loiForm.email}</span>
                  )}
                </div>
                <div className="nhom-truong">
                  <label>Địa chỉ</label>
                  <input
                    value={duLieu.diaChi || ""}
                    onChange={(e) => capNhat("diaChi", e.target.value)}
                  />
                </div>
                <div className="nhom-truong">
                  <label>Ghi chú</label>
                  <input
                    value={duLieu.ghiChu || ""}
                    onChange={(e) => capNhat("ghiChu", e.target.value)}
                  />
                </div>
              </div>
              <footer className="chan-hop-thoai">
                <button
                  type="button"
                  className="nut nut-phu"
                  onClick={() => datDangMo(false)}
                >
                  Hủy
                </button>
                <button className="nut nut-chinh" disabled={dangXuLy}>
                  {dangXuLy ? "Đang lưu..." : "Lưu"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
